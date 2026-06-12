package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/auth"
	codexmiddleware "github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/middleware"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/respond"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/postgres"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/config"
)

type AuthHandler struct {
	store  *postgres.Store
	tokens *auth.TokenService
	cfg    config.AuthConfig
}

type registerRequest struct {
	Name     *string `json:"name"`
	Email    string  `json:"email"`
	Password string  `json:"password"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type authResponse struct {
	User postgres.User `json:"user"`
}

type updateCurrentUserRequest struct {
	Name  *string `json:"name"`
	Email *string `json:"email"`
}

type changePasswordRequest struct {
	CurrentPassword string `json:"currentPassword"`
	NewPassword     string `json:"newPassword"`
}

func NewAuthHandler(store *postgres.Store, tokens *auth.TokenService, cfg config.AuthConfig) *AuthHandler {
	return &AuthHandler{store: store, tokens: tokens, cfg: cfg}
}

func (h *AuthHandler) CSRF(w http.ResponseWriter, r *http.Request) {
	token, err := auth.GenerateSecureToken(32)
	if err != nil {
		respond.Error(w, http.StatusInternalServerError, "csrf_generation_failed", "Could not generate CSRF token.")
		return
	}

	h.setCSRFCookie(w, token)
	respond.JSON(w, http.StatusOK, map[string]string{"csrfToken": token})
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var payload registerRequest
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		respond.Error(w, http.StatusBadRequest, "invalid_body", "Request body is invalid.")
		return
	}

	payload.Email = strings.ToLower(strings.TrimSpace(payload.Email))
	if payload.Email == "" || len(payload.Password) < 8 {
		respond.Error(w, http.StatusBadRequest, "invalid_credentials", "Email and a password with at least 8 characters are required.")
		return
	}

	passwordHash, err := auth.HashPassword(payload.Password)
	if err != nil {
		respond.Error(w, http.StatusInternalServerError, "password_hash_failed", "Could not secure the password.")
		return
	}

	user, err := h.store.CreateUser(r.Context(), payload.Name, payload.Email, passwordHash)
	if err != nil {
		respond.Error(w, http.StatusConflict, "user_registration_failed", "Could not register this user.")
		return
	}

	if err := h.startSession(w, user.ID, user.Email); err != nil {
		respond.Error(w, http.StatusInternalServerError, "session_failed", "Could not start authentication session.")
		return
	}

	respond.JSON(w, http.StatusCreated, authResponse{User: user})
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var payload loginRequest
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		respond.Error(w, http.StatusBadRequest, "invalid_body", "Request body is invalid.")
		return
	}

	user, passwordHash, err := h.store.FindUserByEmail(r.Context(), payload.Email)
	if err != nil || !auth.CheckPasswordHash(payload.Password, passwordHash) {
		respond.Error(w, http.StatusUnauthorized, "invalid_credentials", "Invalid email or password.")
		return
	}

	if err := h.startSession(w, user.ID, user.Email); err != nil {
		respond.Error(w, http.StatusInternalServerError, "session_failed", "Could not start authentication session.")
		return
	}

	respond.JSON(w, http.StatusOK, authResponse{User: user})
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	userID, ok := codexmiddleware.UserIDFromContext(r.Context())
	if !ok {
		respond.Error(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.")
		return
	}

	user, err := h.store.FindUserByID(r.Context(), userID)
	if err != nil {
		if errors.Is(err, postgres.ErrNotFound) {
			respond.Error(w, http.StatusUnauthorized, "unauthorized", "Authenticated user does not exist.")
			return
		}
		respond.Error(w, http.StatusInternalServerError, "user_lookup_failed", "Could not load current user.")
		return
	}

	respond.JSON(w, http.StatusOK, user)
}

func (h *AuthHandler) UpdateMe(w http.ResponseWriter, r *http.Request) {
	userID, ok := codexmiddleware.UserIDFromContext(r.Context())
	if !ok {
		respond.Error(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.")
		return
	}

	var payload updateCurrentUserRequest
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		respond.Error(w, http.StatusBadRequest, "invalid_body", "Request body is invalid.")
		return
	}

	user, err := h.store.UpdateUser(r.Context(), userID, payload.Name, payload.Email)
	if err != nil {
		respond.Error(w, http.StatusBadRequest, "user_update_failed", "Could not update current user.")
		return
	}

	respond.JSON(w, http.StatusOK, user)
}

func (h *AuthHandler) ChangePassword(w http.ResponseWriter, r *http.Request) {
	userID, ok := codexmiddleware.UserIDFromContext(r.Context())
	if !ok {
		respond.Error(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.")
		return
	}

	var payload changePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		respond.Error(w, http.StatusBadRequest, "invalid_body", "Request body is invalid.")
		return
	}
	if len(payload.NewPassword) < 8 {
		respond.Error(w, http.StatusBadRequest, "invalid_password", "New password must have at least 8 characters.")
		return
	}

	currentUser, err := h.store.FindUserByID(r.Context(), userID)
	if err != nil {
		respond.Error(w, http.StatusUnauthorized, "unauthorized", "Authenticated user does not exist.")
		return
	}

	_, passwordHash, err := h.store.FindUserByEmail(r.Context(), currentUser.Email)
	if err != nil || !auth.CheckPasswordHash(payload.CurrentPassword, passwordHash) {
		respond.Error(w, http.StatusUnauthorized, "invalid_password", "Current password is invalid.")
		return
	}

	newHash, err := auth.HashPassword(payload.NewPassword)
	if err != nil {
		respond.Error(w, http.StatusInternalServerError, "password_hash_failed", "Could not secure the password.")
		return
	}
	if err := h.store.UpdateUserPassword(r.Context(), userID, newHash); err != nil {
		respond.Error(w, http.StatusInternalServerError, "password_update_failed", "Could not update password.")
		return
	}
	respond.JSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (h *AuthHandler) DeleteMe(w http.ResponseWriter, r *http.Request) {
	userID, ok := codexmiddleware.UserIDFromContext(r.Context())
	if !ok {
		respond.Error(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.")
		return
	}
	if err := h.store.DeleteUser(r.Context(), userID); err != nil {
		respond.Error(w, http.StatusInternalServerError, "user_delete_failed", "Could not delete current user.")
		return
	}
	h.clearCookie(w, h.cfg.CookieName, true)
	h.clearCookie(w, h.cfg.CSRFCookieName, false)
	respond.JSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	h.clearCookie(w, h.cfg.CookieName, true)
	h.clearCookie(w, h.cfg.CSRFCookieName, false)
	respond.JSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (h *AuthHandler) startSession(w http.ResponseWriter, userID string, email string) error {
	token, _, err := h.tokens.Issue(userID, email)
	if err != nil {
		return err
	}

	csrfToken, err := auth.GenerateSecureToken(32)
	if err != nil {
		return err
	}

	expires := time.Now().Add(h.cfg.SessionTTL)
	http.SetCookie(w, &http.Cookie{
		Name:     h.cfg.CookieName,
		Value:    token,
		Path:     "/",
		Expires:  expires,
		MaxAge:   int(h.cfg.SessionTTL.Seconds()),
		HttpOnly: true,
		Secure:   h.cfg.CookieSecure,
		SameSite: h.cfg.CookieSameSite,
	})
	h.setCSRFCookie(w, csrfToken)
	return nil
}

func (h *AuthHandler) setCSRFCookie(w http.ResponseWriter, token string) {
	http.SetCookie(w, &http.Cookie{
		Name:     h.cfg.CSRFCookieName,
		Value:    token,
		Path:     "/",
		MaxAge:   int(h.cfg.SessionTTL.Seconds()),
		HttpOnly: false,
		Secure:   h.cfg.CookieSecure,
		SameSite: h.cfg.CookieSameSite,
	})
}

func (h *AuthHandler) clearCookie(w http.ResponseWriter, name string, httpOnly bool) {
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
		HttpOnly: httpOnly,
		Secure:   h.cfg.CookieSecure,
		SameSite: h.cfg.CookieSameSite,
	})
}
