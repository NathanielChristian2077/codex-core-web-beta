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

type ResourceHandler struct{ store *postgres.Store }

func NewResourceHandler(store *postgres.Store) *ResourceHandler { return &ResourceHandler{store: store} }

func (h *ResourceHandler) ListProjects(w http.ResponseWriter, r *http.Request) {
	userID, ok := userID(w, r)
	if !ok {
		return
	}
	h.writeRaw(w, h.store.ListProjectsJSON(r.Context(), userID))
}
func (h *ResourceHandler) CreateProject(w http.ResponseWriter, r *http.Request) {
	userID, ok := userID(w, r)
	if !ok {
		return
	}
	var p postgres.ProjectPayload
	if !decode(w, r, &p) {
		return
	}
	if strings.TrimSpace(p.Name) == "" {
		respond.Error(w, 400, "invalid_project", "Project name is required.")
		return
	}
	raw, err := h.store.CreateProjectJSON(r.Context(), userID, p)
	h.writeRawStatus(w, 201, raw, err)
}
func (h *ResourceHandler) GetProject(w http.ResponseWriter, r *http.Request) {
	userID, ok := userID(w, r)
	if !ok {
		return
	}
	h.writeRaw(w, h.store.GetProjectJSON(r.Context(), userID, chi.URLParam(r, "projectID")))
}
func (h *ResourceHandler) UpdateProject(w http.ResponseWriter, r *http.Request) {
	_, projectID, ok := h.requireEditor(w, r)
	if !ok {
		return
	}
	var p postgres.ProjectPayload
	if !decode(w, r, &p) {
		return
	}
	h.writeRaw(w, h.store.UpdateProjectJSON(r.Context(), projectID, p))
}
func (h *ResourceHandler) DeleteProject(w http.ResponseWriter, r *http.Request) {
	uid, ok := userID(w, r)
	if !ok {
		return
	}
	h.writeOK(w, h.store.DeleteProject(r.Context(), uid, chi.URLParam(r, "projectID")))
}
func (h *ResourceHandler) ApplyPreset(w http.ResponseWriter, r *http.Request) {
	_, projectID, ok := h.requireEditor(w, r)
	if !ok {
		return
	}
	var p struct {
		PresetSlug string `json:"presetSlug"`
	}
	if !decode(w, r, &p) {
		return
	}
	h.writeOK(w, h.store.ApplyPreset(r.Context(), projectID, p.PresetSlug))
}

func (h *ResourceHandler) ListNodeTypes(w http.ResponseWriter, r *http.Request) {
	_, pid, ok := h.requireAccess(w, r)
	if !ok {
		return
	}
	h.writeRaw(w, h.store.ListNodeTypesJSON(r.Context(), pid))
}
func (h *ResourceHandler) CreateNodeType(w http.ResponseWriter, r *http.Request) {
	_, pid, ok := h.requireEditor(w, r)
	if !ok {
		return
	}
	var p postgres.TypePayload
	if !decode(w, r, &p) {
		return
	}
	if strings.TrimSpace(p.Name) == "" || strings.TrimSpace(p.Slug) == "" {
		respond.Error(w, 400, "invalid_node_type", "Node type name and slug are required.")
		return
	}
	raw, err := h.store.CreateNodeTypeJSON(r.Context(), pid, p)
	h.writeRawStatus(w, 201, raw, err)
}
func (h *ResourceHandler) UpdateNodeType(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "nodeTypeID")
	if !h.requireResourceEditor(w, r, "nodeType", id) {
		return
	}
	var p postgres.TypePayload
	if !decode(w, r, &p) {
		return
	}
	h.writeRaw(w, h.store.UpdateNodeTypeJSON(r.Context(), id, p))
}
func (h *ResourceHandler) DeleteNodeType(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "nodeTypeID")
	if !h.requireResourceEditor(w, r, "nodeType", id) {
		return
	}
	h.writeOK(w, h.store.DeleteByKind(r.Context(), "nodeType", id))
}

func (h *ResourceHandler) ListEdgeTypes(w http.ResponseWriter, r *http.Request) {
	_, pid, ok := h.requireAccess(w, r)
	if !ok {
		return
	}
	h.writeRaw(w, h.store.ListEdgeTypesJSON(r.Context(), pid))
}
func (h *ResourceHandler) CreateEdgeType(w http.ResponseWriter, r *http.Request) {
	_, pid, ok := h.requireEditor(w, r)
	if !ok {
		return
	}
	var p postgres.TypePayload
	if !decode(w, r, &p) {
		return
	}
	if strings.TrimSpace(p.Name) == "" || strings.TrimSpace(p.Slug) == "" {
		respond.Error(w, 400, "invalid_edge_type", "Edge type name and slug are required.")
		return
	}
	raw, err := h.store.CreateEdgeTypeJSON(r.Context(), pid, p)
	h.writeRawStatus(w, 201, raw, err)
}
func (h *ResourceHandler) UpdateEdgeType(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "edgeTypeID")
	if !h.requireResourceEditor(w, r, "edgeType", id) {
		return
	}
	var p postgres.TypePayload
	if !decode(w, r, &p) {
		return
	}
	h.writeRaw(w, h.store.UpdateEdgeTypeJSON(r.Context(), id, p))
}
func (h *ResourceHandler) DeleteEdgeType(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "edgeTypeID")
	if !h.requireResourceEditor(w, r, "edgeType", id) {
		return
	}
	h.writeOK(w, h.store.DeleteByKind(r.Context(), "edgeType", id))
}

func (h *ResourceHandler) ListNodes(w http.ResponseWriter, r *http.Request) {
	_, pid, ok := h.requireAccess(w, r)
	if !ok {
		return
	}
	q := r.URL.Query()
	h.writeRaw(w, h.store.ListNodesJSON(r.Context(), pid, q.Get("typeId"), q.Get("typeSlug"), q.Get("search")))
}
func (h *ResourceHandler) CreateNode(w http.ResponseWriter, r *http.Request) {
	_, pid, ok := h.requireEditor(w, r)
	if !ok {
		return
	}
	var p postgres.NodePayload
	if !decode(w, r, &p) {
		return
	}
	if strings.TrimSpace(p.TypeID) == "" || strings.TrimSpace(p.Title) == "" {
		respond.Error(w, 400, "invalid_node", "Node typeId and title are required.")
		return
	}
	raw, err := h.store.CreateNodeJSON(r.Context(), pid, p)
	h.writeRawStatus(w, 201, raw, err)
}
func (h *ResourceHandler) GetNode(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "nodeID")
	if !h.requireResourceAccess(w, r, "node", id) {
		return
	}
	h.writeRaw(w, h.store.GetNodeJSON(r.Context(), id))
}
func (h *ResourceHandler) UpdateNode(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "nodeID")
	if !h.requireResourceEditor(w, r, "node", id) {
		return
	}
	var p postgres.NodePayload
	if !decode(w, r, &p) {
		return
	}
	h.writeRaw(w, h.store.UpdateNodeJSON(r.Context(), id, p))
}
func (h *ResourceHandler) DeleteNode(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "nodeID")
	if !h.requireResourceEditor(w, r, "node", id) {
		return
	}
	h.writeOK(w, h.store.DeleteByKind(r.Context(), "node", id))
}

func (h *ResourceHandler) ListEdges(w http.ResponseWriter, r *http.Request) {
	_, pid, ok := h.requireAccess(w, r)
	if !ok {
		return
	}
	h.writeRaw(w, h.store.ListEdgesJSON(r.Context(), pid))
}
func (h *ResourceHandler) CreateEdge(w http.ResponseWriter, r *http.Request) {
	_, pid, ok := h.requireEditor(w, r)
	if !ok {
		return
	}
	var p postgres.EdgePayload
	if !decode(w, r, &p) {
		return
	}
	if p.SourceNodeID == "" || p.TargetNodeID == "" || p.TypeID == "" {
		respond.Error(w, 400, "invalid_edge", "Edge sourceNodeId, targetNodeId and typeId are required.")
		return
	}
	raw, err := h.store.CreateEdgeJSON(r.Context(), pid, p)
	h.writeRawStatus(w, 201, raw, err)
}
func (h *ResourceHandler) UpdateEdge(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "edgeID")
	if !h.requireResourceEditor(w, r, "edge", id) {
		return
	}
	var p postgres.EdgePayload
	if !decode(w, r, &p) {
		return
	}
	h.writeRaw(w, h.store.UpdateEdgeJSON(r.Context(), id, p))
}
func (h *ResourceHandler) DeleteEdge(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "edgeID")
	if !h.requireResourceEditor(w, r, "edge", id) {
		return
	}
	h.writeOK(w, h.store.DeleteByKind(r.Context(), "edge", id))
}
func (h *ResourceHandler) GetGraph(w http.ResponseWriter, r *http.Request) {
	_, pid, ok := h.requireAccess(w, r)
	if !ok {
		return
	}
	h.writeRaw(w, h.store.GraphJSON(r.Context(), pid))
}

func (h *ResourceHandler) ListViews(w http.ResponseWriter, r *http.Request) {
	_, pid, ok := h.requireAccess(w, r)
	if !ok {
		return
	}
	h.writeRaw(w, h.store.ListViewsJSON(r.Context(), pid))
}
func (h *ResourceHandler) CreateView(w http.ResponseWriter, r *http.Request) {
	_, pid, ok := h.requireEditor(w, r)
	if !ok {
		return
	}
	var p postgres.ViewPayload
	if !decode(w, r, &p) {
		return
	}
	if strings.TrimSpace(p.Name) == "" {
		respond.Error(w, 400, "invalid_view", "View name is required.")
		return
	}
	raw, err := h.store.CreateViewJSON(r.Context(), pid, p)
	h.writeRawStatus(w, 201, raw, err)
}
func (h *ResourceHandler) UpdateView(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "viewID")
	if !h.requireResourceEditor(w, r, "view", id) {
		return
	}
	var p postgres.ViewPayload
	if !decode(w, r, &p) {
		return
	}
	h.writeRaw(w, h.store.UpdateViewJSON(r.Context(), id, p))
}
func (h *ResourceHandler) DeleteView(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "viewID")
	if !h.requireResourceEditor(w, r, "view", id) {
		return
	}
	h.writeOK(w, h.store.DeleteByKind(r.Context(), "view", id))
}
func (h *ResourceHandler) ListLayouts(w http.ResponseWriter, r *http.Request) {
	viewID := chi.URLParam(r, "viewID")
	if !h.requireResourceAccess(w, r, "view", viewID) {
		return
	}
	h.writeRaw(w, h.store.ListLayoutsJSON(r.Context(), viewID))
}
func (h *ResourceHandler) UpsertLayout(w http.ResponseWriter, r *http.Request) {
	viewID := chi.URLParam(r, "viewID")
	pid, err := h.store.ProjectIDFor(r.Context(), "view", viewID)
	if err != nil {
		h.writeErr(w, err, "view_not_found", "View not found.")
		return
	}
	if !h.requireEditorByProjectID(w, r, pid) {
		return
	}
	var p postgres.LayoutPayload
	if !decode(w, r, &p) {
		return
	}
	if p.NodeID == "" {
		p.NodeID = chi.URLParam(r, "nodeID")
	}
	h.writeRaw(w, h.store.UpsertLayoutJSON(r.Context(), pid, viewID, p))
}

func (h *ResourceHandler) requireAccess(w http.ResponseWriter, r *http.Request) (string, string, bool) {
	uid, ok := userID(w, r)
	if !ok {
		return "", "", false
	}
	pid := chi.URLParam(r, "projectID")
	allowed, err := h.store.UserCanAccessProject(r.Context(), uid, pid)
	if err != nil || !allowed {
		respond.Error(w, 404, "project_not_found", "Project not found.")
		return "", "", false
	}
	return uid, pid, true
}
func (h *ResourceHandler) requireEditor(w http.ResponseWriter, r *http.Request) (string, string, bool) {
	uid, ok := userID(w, r)
	if !ok {
		return "", "", false
	}
	pid := chi.URLParam(r, "projectID")
	if !h.requireEditorByProjectID(w, r, pid) {
		return "", "", false
	}
	return uid, pid, true
}
func (h *ResourceHandler) requireEditorByProjectID(w http.ResponseWriter, r *http.Request, pid string) bool {
	uid, ok := userID(w, r)
	if !ok {
		return false
	}
	allowed, err := h.store.UserCanEditProject(r.Context(), uid, pid)
	if err != nil || !allowed {
		respond.Error(w, 403, "forbidden", "You do not have permission to modify this project.")
		return false
	}
	return true
}
func (h *ResourceHandler) requireResourceAccess(w http.ResponseWriter, r *http.Request, kind, id string) bool {
	uid, ok := userID(w, r)
	if !ok {
		return false
	}
	pid, err := h.store.ProjectIDFor(r.Context(), kind, id)
	if err != nil {
		h.writeErr(w, err, "resource_not_found", "Resource not found.")
		return false
	}
	allowed, err := h.store.UserCanAccessProject(r.Context(), uid, pid)
	if err != nil || !allowed {
		respond.Error(w, 404, "resource_not_found", "Resource not found.")
		return false
	}
	return true
}
func (h *ResourceHandler) requireResourceEditor(w http.ResponseWriter, r *http.Request, kind, id string) bool {
	pid, err := h.store.ProjectIDFor(r.Context(), kind, id)
	if err != nil {
		h.writeErr(w, err, "resource_not_found", "Resource not found.")
		return false
	}
	return h.requireEditorByProjectID(w, r, pid)
}

func userID(w http.ResponseWriter, r *http.Request) (string, bool) {
	uid, ok := codexmiddleware.UserIDFromContext(r.Context())
	if !ok {
		respond.Error(w, 401, "unauthorized", "Authentication is required.")
		return "", false
	}
	return uid, true
}
func decode(w http.ResponseWriter, r *http.Request, target any) bool {
	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	if err := d.Decode(target); err != nil {
		respond.Error(w, 400, "invalid_body", "Request body is invalid.")
		return false
	}
	return true
}
func (h *ResourceHandler) writeRaw(w http.ResponseWriter, raw json.RawMessage, err error) {
	h.writeRawStatus(w, 200, raw, err)
}
func (h *ResourceHandler) writeRawStatus(w http.ResponseWriter, status int, raw json.RawMessage, err error) {
	if err != nil {
		h.writeErr(w, err, "request_failed", "Request failed.")
		return
	}
	respond.JSON(w, status, json.RawMessage(raw))
}
func (h *ResourceHandler) writeOK(w http.ResponseWriter, err error) {
	if err != nil {
		h.writeErr(w, err, "request_failed", "Request failed.")
		return
	}
	respond.JSON(w, 200, map[string]bool{"ok": true})
}
func (h *ResourceHandler) writeErr(w http.ResponseWriter, err error, code, message string) {
	if errors.Is(err, postgres.ErrNotFound) {
		respond.Error(w, 404, code, message)
		return
	}
	respond.Error(w, 500, code, message)
}
