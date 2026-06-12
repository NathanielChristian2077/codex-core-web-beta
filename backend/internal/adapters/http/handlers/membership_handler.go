package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	codexmiddleware "github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/middleware"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/respond"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/postgres"
	"github.com/go-chi/chi/v5"
)

type MembershipHandler struct{ store *postgres.Store }

func NewMembershipHandler(store *postgres.Store) *MembershipHandler {
	return &MembershipHandler{store: store}
}

type updateMemberRoleRequest struct {
	Role string `json:"role"`
}

func (h *MembershipHandler) ListMembers(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if !h.requireProjectAccess(w, r, projectID) {
		return
	}
	raw, err := h.store.ListMembersJSON(r.Context(), projectID)
	h.writeRaw(w, raw, err)
}

func (h *MembershipHandler) AddMember(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if !h.requireMemberManager(w, r, projectID) {
		return
	}

	var payload postgres.MembershipPayload
	if !decodeMembership(w, r, &payload) {
		return
	}
	if strings.TrimSpace(payload.Email) == "" {
		respond.Error(w, http.StatusBadRequest, "invalid_member", "Member email is required.")
		return
	}

	raw, err := h.store.AddMemberJSON(r.Context(), projectID, payload)
	h.writeRawStatus(w, http.StatusCreated, raw, err)
}

func (h *MembershipHandler) UpdateMemberRole(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if !h.requireMemberManager(w, r, projectID) {
		return
	}

	var payload updateMemberRoleRequest
	if !decodeMembership(w, r, &payload) {
		return
	}
	if strings.TrimSpace(payload.Role) == "" {
		respond.Error(w, http.StatusBadRequest, "invalid_member_role", "Member role is required.")
		return
	}

	raw, err := h.store.UpdateMemberRoleJSON(r.Context(), projectID, chi.URLParam(r, "userID"), payload.Role)
	h.writeRaw(w, raw, err)
}

func (h *MembershipHandler) RemoveMember(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if !h.requireMemberManager(w, r, projectID) {
		return
	}

	err := h.store.RemoveMember(r.Context(), projectID, chi.URLParam(r, "userID"))
	if err != nil {
		h.writeErr(w, err, "member_remove_failed", "Could not remove this member.")
		return
	}
	respond.JSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (h *MembershipHandler) requireProjectAccess(w http.ResponseWriter, r *http.Request, projectID string) bool {
	userID, ok := codexmiddleware.UserIDFromContext(r.Context())
	if !ok {
		respond.Error(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.")
		return false
	}
	allowed, err := h.store.UserCanAccessProject(r.Context(), userID, projectID)
	if err != nil || !allowed {
		respond.Error(w, http.StatusNotFound, "project_not_found", "Project not found.")
		return false
	}
	return true
}

func (h *MembershipHandler) requireMemberManager(w http.ResponseWriter, r *http.Request, projectID string) bool {
	userID, ok := codexmiddleware.UserIDFromContext(r.Context())
	if !ok {
		respond.Error(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.")
		return false
	}
	allowed, err := h.store.UserCanManageProjectMembers(r.Context(), userID, projectID)
	if err != nil || !allowed {
		respond.Error(w, http.StatusForbidden, "forbidden", "Only project owners can manage members.")
		return false
	}
	return true
}

func decodeMembership(w http.ResponseWriter, r *http.Request, target any) bool {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(target); err != nil {
		respond.Error(w, http.StatusBadRequest, "invalid_body", "Request body is invalid.")
		return false
	}
	return true
}

func (h *MembershipHandler) writeRaw(w http.ResponseWriter, raw json.RawMessage, err error) {
	h.writeRawStatus(w, http.StatusOK, raw, err)
}

func (h *MembershipHandler) writeRawStatus(w http.ResponseWriter, status int, raw json.RawMessage, err error) {
	if err != nil {
		h.writeErr(w, err, "membership_request_failed", "Membership request failed.")
		return
	}
	if string(raw) == "null" {
		respond.Error(w, http.StatusNotFound, "member_not_found", "Member not found.")
		return
	}
	respond.JSON(w, status, json.RawMessage(raw))
}

func (h *MembershipHandler) writeErr(w http.ResponseWriter, err error, code, message string) {
	if errors.Is(err, postgres.ErrNotFound) {
		respond.Error(w, http.StatusNotFound, code, message)
		return
	}
	if strings.Contains(strings.ToLower(err.Error()), "role") {
		respond.Error(w, http.StatusBadRequest, "invalid_member_role", err.Error())
		return
	}
	respond.Error(w, http.StatusInternalServerError, code, message)
}
