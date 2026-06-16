package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/respond"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/postgres"
	"github.com/go-chi/chi/v5"
)

type duplicateProjectRequest struct {
	Name *string `json:"name"`
}

func (h *ResourceHandler) ExportProject(w http.ResponseWriter, r *http.Request) {
	_, projectID, ok := h.requireAccess(w, r)
	if !ok {
		return
	}

	raw, err := h.store.ExportProjectJSON(r.Context(), projectID)
	if err != nil {
		h.writeErr(w, err, "project_export_failed", "Could not export project.")
		return
	}

	w.Header().Set("Content-Disposition", "attachment; filename=codex-project-export.json")
	respond.JSON(w, http.StatusOK, json.RawMessage(raw))
}

func (h *ResourceHandler) DuplicateProject(w http.ResponseWriter, r *http.Request) {
	userID, projectID, ok := h.requireAccess(w, r)
	if !ok {
		return
	}

	var payload duplicateProjectRequest
	if r.Body != nil {
		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()
		if err := decoder.Decode(&payload); err != nil {
			respond.Error(w, http.StatusBadRequest, "invalid_body", "Request body is invalid.")
			return
		}
	}
	if payload.Name != nil && strings.TrimSpace(*payload.Name) == "" {
		payload.Name = nil
	}

	raw, err := h.store.DuplicateProjectJSON(r.Context(), userID, projectID, payload.Name)
	h.writeRawStatus(w, http.StatusCreated, raw, err)
}

func (h *ResourceHandler) ImportProject(w http.ResponseWriter, r *http.Request) {
	userID, ok := userID(w, r)
	if !ok {
		return
	}

	var payload postgres.ProjectTransferPayload
	if !decode(w, r, &payload) {
		return
	}

	raw, err := h.store.ImportProjectJSON(r.Context(), userID, payload)
	h.writeRawStatus(w, http.StatusCreated, raw, err)
}

func (h *ResourceHandler) ExportCampaign(w http.ResponseWriter, r *http.Request) {
	h.ExportProject(w, r)
}

func (h *ResourceHandler) DuplicateCampaign(w http.ResponseWriter, r *http.Request) {
	h.DuplicateProject(w, r)
}

func (h *ResourceHandler) ImportCampaign(w http.ResponseWriter, r *http.Request) {
	h.ImportProject(w, r)
}

func campaignProjectID(r *http.Request) string {
	return chi.URLParam(r, "projectID")
}
