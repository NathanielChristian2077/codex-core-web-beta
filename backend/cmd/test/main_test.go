// =============================================================================
// Codex Core Engine Web – Backend MVP Test Suite
// =============================================================================
//
// Package layout assumption:
//   The tests below are written as integration-style handler tests and unit
//   tests that compile against the folder structure described in the contract.
//   Adjust import paths to match your actual Go module name.
//
// Module assumed: module github.com/yourorg/codex
//
// Required test helpers (set up once in TestMain):
//   - A real or in-memory PostgreSQL (e.g. via testcontainers-go or a local
//     test DB pointed at by TEST_DATABASE_URL env var)
//   - A running HTTP server wired through httptest.NewServer
//
// External test deps (go get once):
//   github.com/stretchr/testify v1
//   github.com/google/uuid
//
// Run with:
//   go test ./... -v -count=1
// =============================================================================

package api_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// =============================================================================
// Test harness helpers
// =============================================================================

// testServer wraps httptest.Server and carries a session cookie so individual
// tests don't have to manage auth manually.
type testServer struct {
	*httptest.Server
	cookie string // value of the auth cookie after login
}

// newTestServer starts the application in test mode.
// Replace newApp() with however your app wires itself up (chi router, etc.).
func newTestServer(t *testing.T) *testServer {
	t.Helper()
	// app := newApp(testConfig())   ← wire your real router here
	// srv := httptest.NewServer(app)
	// For now we use a placeholder that tests can run without a real server.
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotImplemented)
	}))
	t.Cleanup(srv.Close)
	return &testServer{Server: srv}
}

func (ts *testServer) do(t *testing.T, method, path string, body any) *http.Response {
	t.Helper()
	var r io.Reader
	if body != nil {
		b, err := json.Marshal(body)
		require.NoError(t, err)
		r = bytes.NewReader(b)
	}
	req, err := http.NewRequest(method, ts.URL+path, r)
	require.NoError(t, err)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	if ts.cookie != "" {
		req.Header.Set("Cookie", ts.cookie)
	}
	resp, err := http.DefaultClient.Do(req)
	require.NoError(t, err)
	return resp
}

func decode(t *testing.T, resp *http.Response, dst any) {
	t.Helper()
	defer resp.Body.Close()
	require.NoError(t, json.NewDecoder(resp.Body).Decode(dst))
}

func bodyString(t *testing.T, resp *http.Response) string {
	t.Helper()
	defer resp.Body.Close()
	b, err := io.ReadAll(resp.Body)
	require.NoError(t, err)
	return string(b)
}

// registerAndLogin creates a fresh user and stores the auth cookie on ts.
func (ts *testServer) registerAndLogin(t *testing.T) map[string]any {
	t.Helper()
	email := fmt.Sprintf("user-%s@test.dev", uuid.New().String()[:8])
	payload := map[string]any{
		"email":       email,
		"password":    "Str0ngP@ssword!",
		"displayName": "Test User",
	}
	regResp := ts.do(t, http.MethodPost, "/api/auth/register", payload)
	require.Equal(t, http.StatusCreated, regResp.StatusCode,
		"register should return 201, got %d – body: %s", regResp.StatusCode, bodyString(t, regResp))

	loginResp := ts.do(t, http.MethodPost, "/api/auth/login", map[string]any{
		"email":    email,
		"password": "Str0ngP@ssword!",
	})
	require.Equal(t, http.StatusOK, loginResp.StatusCode)
	ts.cookie = loginResp.Header.Get("Set-Cookie")

	var me map[string]any
	decode(t, loginResp, &me)
	return me
}

// =============================================================================
// 1. Health
// =============================================================================

func TestHealth_ReturnsOK(t *testing.T) {
	ts := newTestServer(t)
	resp := ts.do(t, http.MethodGet, "/health", nil)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
}

// =============================================================================
// 2. Auth – Register
// =============================================================================

func TestRegister_Success(t *testing.T) {
	ts := newTestServer(t)
	email := fmt.Sprintf("reg-%s@test.dev", uuid.New().String()[:8])
	resp := ts.do(t, http.MethodPost, "/api/auth/register", map[string]any{
		"email":    email,
		"password": "ValidPass1!",
	})
	assert.Equal(t, http.StatusCreated, resp.StatusCode)
}

func TestRegister_DuplicateEmail_ReturnsConflict(t *testing.T) {
	ts := newTestServer(t)
	email := fmt.Sprintf("dup-%s@test.dev", uuid.New().String()[:8])
	body := map[string]any{"email": email, "password": "ValidPass1!"}
	ts.do(t, http.MethodPost, "/api/auth/register", body)
	resp := ts.do(t, http.MethodPost, "/api/auth/register", body)
	assert.Equal(t, http.StatusConflict, resp.StatusCode)

	var errBody map[string]any
	decode(t, resp, &errBody)
	errObj, ok := errBody["error"].(map[string]any)
	require.True(t, ok, "response must have 'error' object")
	assert.Equal(t, "CONFLICT", errObj["code"])
}

func TestRegister_InvalidEmail_Returns422(t *testing.T) {
	ts := newTestServer(t)
	resp := ts.do(t, http.MethodPost, "/api/auth/register", map[string]any{
		"email":    "not-an-email",
		"password": "ValidPass1!",
	})
	assert.Equal(t, http.StatusUnprocessableEntity, resp.StatusCode)
}

func TestRegister_MissingPassword_Returns422(t *testing.T) {
	ts := newTestServer(t)
	resp := ts.do(t, http.MethodPost, "/api/auth/register", map[string]any{
		"email": fmt.Sprintf("x-%s@test.dev", uuid.New().String()[:8]),
	})
	assert.Equal(t, http.StatusUnprocessableEntity, resp.StatusCode)
}

func TestRegister_PasswordHash_NotExposedInResponse(t *testing.T) {
	ts := newTestServer(t)
	email := fmt.Sprintf("hash-%s@test.dev", uuid.New().String()[:8])
	resp := ts.do(t, http.MethodPost, "/api/auth/register", map[string]any{
		"email":    email,
		"password": "ValidPass1!",
	})
	raw := bodyString(t, resp)
	assert.NotContains(t, raw, "password_hash",
		"password hash must never be returned by the API")
}

// =============================================================================
// 3. Auth – Login / Logout / Me
// =============================================================================

func TestLogin_ValidCredentials_ReturnsCookieAndUser(t *testing.T) {
	ts := newTestServer(t)
	email := fmt.Sprintf("login-%s@test.dev", uuid.New().String()[:8])
	ts.do(t, http.MethodPost, "/api/auth/register", map[string]any{
		"email": email, "password": "ValidPass1!",
	})
	resp := ts.do(t, http.MethodPost, "/api/auth/login", map[string]any{
		"email": email, "password": "ValidPass1!",
	})
	assert.Equal(t, http.StatusOK, resp.StatusCode)
	assert.NotEmpty(t, resp.Header.Get("Set-Cookie"), "auth cookie must be set")

	// Cookie must be HttpOnly
	setCookie := resp.Header.Get("Set-Cookie")
	assert.True(t, strings.Contains(strings.ToLower(setCookie), "httponly"),
		"auth cookie must be HttpOnly")
}

func TestLogin_WrongPassword_Returns401(t *testing.T) {
	ts := newTestServer(t)
	email := fmt.Sprintf("wp-%s@test.dev", uuid.New().String()[:8])
	ts.do(t, http.MethodPost, "/api/auth/register", map[string]any{
		"email": email, "password": "ValidPass1!",
	})
	resp := ts.do(t, http.MethodPost, "/api/auth/login", map[string]any{
		"email": email, "password": "WrongPassword!",
	})
	assert.Equal(t, http.StatusUnauthorized, resp.StatusCode)
}

func TestLogin_UnknownEmail_Returns401(t *testing.T) {
	ts := newTestServer(t)
	resp := ts.do(t, http.MethodPost, "/api/auth/login", map[string]any{
		"email": "nobody@nowhere.dev", "password": "anything",
	})
	assert.Equal(t, http.StatusUnauthorized, resp.StatusCode)
}

func TestMe_Authenticated_ReturnsUser(t *testing.T) {
	ts := newTestServer(t)
	user := ts.registerAndLogin(t)
	resp := ts.do(t, http.MethodGet, "/api/auth/me", nil)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var me map[string]any
	decode(t, resp, &me)
	assert.Equal(t, user["email"], me["email"])
	assert.NotContains(t, fmt.Sprint(me), "password_hash")
}

func TestMe_Unauthenticated_Returns401(t *testing.T) {
	ts := newTestServer(t)
	resp := ts.do(t, http.MethodGet, "/api/auth/me", nil)
	assert.Equal(t, http.StatusUnauthorized, resp.StatusCode)
}

func TestLogout_ClearsCookie(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	resp := ts.do(t, http.MethodPost, "/api/auth/logout", nil)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// After logout, /me must return 401
	ts.cookie = resp.Header.Get("Set-Cookie") // should be an expired/empty cookie
	meResp := ts.do(t, http.MethodGet, "/api/auth/me", nil)
	assert.Equal(t, http.StatusUnauthorized, meResp.StatusCode)
}

// =============================================================================
// 4. Projects
// =============================================================================

func TestCreateProject_BlankPreset_Returns201(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	resp := ts.do(t, http.MethodPost, "/api/projects", map[string]any{
		"name":      "My Blank Project",
		"presetKey": "blank",
	})
	assert.Equal(t, http.StatusCreated, resp.StatusCode)

	var proj map[string]any
	decode(t, resp, &proj)
	assert.NotEmpty(t, proj["id"])
	assert.Equal(t, "My Blank Project", proj["name"])
	assert.Equal(t, "blank", proj["presetKey"])
}

func TestCreateProject_RPGPreset_CreatesTypesAndView(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	resp := ts.do(t, http.MethodPost, "/api/projects", map[string]any{
		"name":        "Middle-earth Campaign",
		"description": "A story graph for the campaign.",
		"presetKey":   "rpg_campaign",
	})
	require.Equal(t, http.StatusCreated, resp.StatusCode)

	var proj map[string]any
	decode(t, resp, &proj)
	projectID := proj["id"].(string)

	// Verify node types were created by the RPG preset
	ntResp := ts.do(t, http.MethodGet, "/api/projects/"+projectID+"/node-types", nil)
	require.Equal(t, http.StatusOK, ntResp.StatusCode)
	var ntList []map[string]any
	decode(t, ntResp, &ntList)

	slugs := make([]string, 0, len(ntList))
	for _, nt := range ntList {
		slugs = append(slugs, nt["slug"].(string))
	}
	for _, expected := range []string{"event", "character", "location", "object", "faction"} {
		assert.Contains(t, slugs, expected, "RPG preset must create node type: "+expected)
	}

	// Verify edge types
	etResp := ts.do(t, http.MethodGet, "/api/projects/"+projectID+"/edge-types", nil)
	require.Equal(t, http.StatusOK, etResp.StatusCode)
	var etList []map[string]any
	decode(t, etResp, &etList)

	etSlugs := make([]string, 0, len(etList))
	for _, et := range etList {
		etSlugs = append(etSlugs, et["slug"].(string))
	}
	for _, expected := range []string{"involves", "happens_at", "owns", "knows"} {
		assert.Contains(t, etSlugs, expected, "RPG preset must create edge type: "+expected)
	}
}

func TestCreateProject_MissingName_Returns422(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	resp := ts.do(t, http.MethodPost, "/api/projects", map[string]any{
		"presetKey": "blank",
	})
	assert.Equal(t, http.StatusUnprocessableEntity, resp.StatusCode)
}

func TestCreateProject_OwnerMembershipCreated(t *testing.T) {
	ts := newTestServer(t)
	user := ts.registerAndLogin(t)
	resp := ts.do(t, http.MethodPost, "/api/projects", map[string]any{
		"name":      "Membership Test",
		"presetKey": "blank",
	})
	require.Equal(t, http.StatusCreated, resp.StatusCode)
	var proj map[string]any
	decode(t, resp, &proj)
	projectID := proj["id"].(string)

	membersResp := ts.do(t, http.MethodGet, "/api/projects/"+projectID+"/members", nil)
	require.Equal(t, http.StatusOK, membersResp.StatusCode)

	var members []map[string]any
	decode(t, membersResp, &members)
	require.Len(t, members, 1)
	assert.Equal(t, user["id"], members[0]["userId"])
	assert.Equal(t, "owner", members[0]["role"])
}

func TestListProjects_ReturnsOnlyOwnedAndMemberProjects(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	ts.do(t, http.MethodPost, "/api/projects", map[string]any{"name": "P1", "presetKey": "blank"})
	ts.do(t, http.MethodPost, "/api/projects", map[string]any{"name": "P2", "presetKey": "blank"})

	resp := ts.do(t, http.MethodGet, "/api/projects", nil)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var list []map[string]any
	decode(t, resp, &list)
	assert.GreaterOrEqual(t, len(list), 2)
}

func TestGetProject_NotMember_Returns403(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	createResp := ts.do(t, http.MethodPost, "/api/projects", map[string]any{
		"name": "Private", "presetKey": "blank",
	})
	var proj map[string]any
	decode(t, createResp, &proj)
	projectID := proj["id"].(string)

	// New user — different session
	ts2 := newTestServer(t)
	ts2.registerAndLogin(t)
	resp := ts2.do(t, http.MethodGet, "/api/projects/"+projectID, nil)
	assert.Equal(t, http.StatusForbidden, resp.StatusCode)
}

func TestDeleteProject_OnlyOwnerCanDelete(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	createResp := ts.do(t, http.MethodPost, "/api/projects", map[string]any{
		"name": "ToDelete", "presetKey": "blank",
	})
	var proj map[string]any
	decode(t, createResp, &proj)
	projectID := proj["id"].(string)

	// Add an editor member
	ts2 := newTestServer(t)
	editor := ts2.registerAndLogin(t)
	ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/members", map[string]any{
		"userId": editor["id"],
		"role":   "editor",
	})

	// Editor cannot delete
	delResp := ts2.do(t, http.MethodDelete, "/api/projects/"+projectID, nil)
	assert.Equal(t, http.StatusForbidden, delResp.StatusCode)

	// Owner can delete
	ownerDelResp := ts.do(t, http.MethodDelete, "/api/projects/"+projectID, nil)
	assert.Equal(t, http.StatusNoContent, ownerDelResp.StatusCode)
}

func TestPatchProject_UpdatesNameAndDescription(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	createResp := ts.do(t, http.MethodPost, "/api/projects", map[string]any{
		"name": "Original", "presetKey": "blank",
	})
	var proj map[string]any
	decode(t, createResp, &proj)
	projectID := proj["id"].(string)

	patchResp := ts.do(t, http.MethodPatch, "/api/projects/"+projectID, map[string]any{
		"name":        "Updated Name",
		"description": "New description",
	})
	assert.Equal(t, http.StatusOK, patchResp.StatusCode)

	var updated map[string]any
	decode(t, patchResp, &updated)
	assert.Equal(t, "Updated Name", updated["name"])
	assert.Equal(t, "New description", updated["description"])
}

// =============================================================================
// 5. Node Types
// =============================================================================

func createProject(t *testing.T, ts *testServer, preset string) string {
	t.Helper()
	resp := ts.do(t, http.MethodPost, "/api/projects", map[string]any{
		"name": "TestProject-" + uuid.New().String()[:6], "presetKey": preset,
	})
	require.Equal(t, http.StatusCreated, resp.StatusCode)
	var proj map[string]any
	decode(t, resp, &proj)
	return proj["id"].(string)
}

func TestCreateNodeType_ValidPayload_Returns201(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID := createProject(t, ts, "blank")

	resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/node-types", map[string]any{
		"name":        "Character",
		"slug":        "character",
		"description": "A person in the story",
		"color":       "#FF5733",
		"icon":        "user",
		"fields": []map[string]any{
			{
				"key":          "species",
				"label":        "Species",
				"type":         "text",
				"required":     false,
				"defaultValue": nil,
				"options":      []any{},
				"validation":   map[string]any{"min": nil, "max": nil, "pattern": nil},
			},
		},
	})
	assert.Equal(t, http.StatusCreated, resp.StatusCode)
}

func TestCreateNodeType_DuplicateSlug_Returns409(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID := createProject(t, ts, "blank")

	body := map[string]any{"name": "Hero", "slug": "hero", "fields": []any{}}
	ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/node-types", body)
	resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/node-types", body)
	assert.Equal(t, http.StatusConflict, resp.StatusCode)
}

func TestCreateNodeType_InvalidFieldType_Returns422(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID := createProject(t, ts, "blank")

	resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/node-types", map[string]any{
		"name": "Broken",
		"slug": "broken",
		"fields": []map[string]any{
			{"key": "x", "label": "X", "type": "not_a_real_type"},
		},
	})
	assert.Equal(t, http.StatusUnprocessableEntity, resp.StatusCode)
}

func TestCreateNodeType_SameSlugDifferentProject_IsAllowed(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	p1 := createProject(t, ts, "blank")
	p2 := createProject(t, ts, "blank")

	body := map[string]any{"name": "Hero", "slug": "hero", "fields": []any{}}
	r1 := ts.do(t, http.MethodPost, "/api/projects/"+p1+"/node-types", body)
	r2 := ts.do(t, http.MethodPost, "/api/projects/"+p2+"/node-types", body)
	assert.Equal(t, http.StatusCreated, r1.StatusCode)
	assert.Equal(t, http.StatusCreated, r2.StatusCode)
}

func TestDeleteNodeType_BlockedIfNodesExist(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID := createProject(t, ts, "blank")

	ntResp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/node-types", map[string]any{
		"name": "Blocker", "slug": "blocker", "fields": []any{},
	})
	var nt map[string]any
	decode(t, ntResp, &nt)
	ntID := nt["id"].(string)

	// Create a node of that type
	ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
		"typeId": ntID, "title": "Existing Node", "properties": map[string]any{},
	})

	delResp := ts.do(t, http.MethodDelete, "/api/node-types/"+ntID, nil)
	assert.Equal(t, http.StatusConflict, delResp.StatusCode,
		"deleting a node type in use must return 409 CONFLICT")
}

// =============================================================================
// 6. Edge Types
// =============================================================================

func TestCreateEdgeType_ValidPayload_Returns201(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID := createProject(t, ts, "blank")

	resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/edge-types", map[string]any{
		"name":        "Knows",
		"slug":        "knows",
		"directed":    true,
		"color":       "#00BFFF",
		"strokeStyle": "solid",
		"fields":      []any{},
	})
	assert.Equal(t, http.StatusCreated, resp.StatusCode)
}

func TestCreateEdgeType_DuplicateSlug_Returns409(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID := createProject(t, ts, "blank")

	body := map[string]any{"name": "Link", "slug": "link", "fields": []any{}}
	ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/edge-types", body)
	resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/edge-types", body)
	assert.Equal(t, http.StatusConflict, resp.StatusCode)
}

func TestDeleteEdgeType_BlockedIfEdgesExist(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID := createProject(t, ts, "blank")

	// Create node type
	ntResp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/node-types", map[string]any{
		"name": "Person", "slug": "person", "fields": []any{},
	})
	var nt map[string]any
	decode(t, ntResp, &nt)
	ntID := nt["id"].(string)

	// Create edge type
	etResp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/edge-types", map[string]any{
		"name": "Rel", "slug": "rel", "fields": []any{},
	})
	var et map[string]any
	decode(t, etResp, &et)
	etID := et["id"].(string)

	// Create two nodes
	n1Resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
		"typeId": ntID, "title": "N1", "properties": map[string]any{},
	})
	n2Resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
		"typeId": ntID, "title": "N2", "properties": map[string]any{},
	})
	var n1, n2 map[string]any
	decode(t, n1Resp, &n1)
	decode(t, n2Resp, &n2)

	// Create edge
	ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/edges", map[string]any{
		"typeId": etID, "sourceNodeId": n1["id"], "targetNodeId": n2["id"],
		"properties": map[string]any{},
	})

	delResp := ts.do(t, http.MethodDelete, "/api/edge-types/"+etID, nil)
	assert.Equal(t, http.StatusConflict, delResp.StatusCode)
}

// =============================================================================
// 7. Nodes
// =============================================================================

func setupProjectWithTypes(t *testing.T, ts *testServer) (projectID, nodeTypeID string) {
	t.Helper()
	projectID = createProject(t, ts, "blank")

	ntResp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/node-types", map[string]any{
		"name": "Character",
		"slug": "character",
		"fields": []map[string]any{
			{
				"key": "species", "label": "Species", "type": "text",
				"required": false, "defaultValue": nil,
				"options": []any{}, "validation": map[string]any{},
			},
		},
	})
	require.Equal(t, http.StatusCreated, ntResp.StatusCode)
	var nt map[string]any
	decode(t, ntResp, &nt)
	return projectID, nt["id"].(string)
}

func TestCreateNode_ValidProperties_Returns201(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID, ntID := setupProjectWithTypes(t, ts)

	resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
		"typeId":     ntID,
		"title":      "Bilbo Baggins",
		"content":    "A burglar, apparently.",
		"properties": map[string]any{"species": "Hobbit"},
	})
	assert.Equal(t, http.StatusCreated, resp.StatusCode)

	var node map[string]any
	decode(t, resp, &node)
	assert.Equal(t, "Bilbo Baggins", node["title"])
	assert.NotEmpty(t, node["id"])
}

func TestCreateNode_RequiredFieldMissing_Returns422(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID := createProject(t, ts, "blank")

	ntResp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/node-types", map[string]any{
		"name": "Species",
		"slug": "species",
		"fields": []map[string]any{
			{
				"key": "scientificName", "label": "Scientific Name", "type": "text",
				"required": true, "defaultValue": nil,
				"options": []any{}, "validation": map[string]any{},
			},
		},
	})
	var nt map[string]any
	decode(t, ntResp, &nt)

	resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
		"typeId": nt["id"], "title": "Missing Field Node",
		"properties": map[string]any{}, // scientificName missing
	})
	assert.Equal(t, http.StatusUnprocessableEntity, resp.StatusCode)

	var body map[string]any
	decode(t, resp, &body)
	errObj := body["error"].(map[string]any)
	assert.Equal(t, "VALIDATION_ERROR", errObj["code"])
}

func TestCreateNode_UnknownProperty_Returns422(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID, ntID := setupProjectWithTypes(t, ts)

	resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
		"typeId": ntID, "title": "Sneaky Node",
		"properties": map[string]any{
			"species":      "Elf",
			"unknownField": "should be rejected",
		},
	})
	assert.Equal(t, http.StatusUnprocessableEntity, resp.StatusCode)
}

func TestCreateNode_CrossProjectTypeID_Returns422(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)

	p1 := createProject(t, ts, "blank")
	p2 := createProject(t, ts, "blank")

	ntResp := ts.do(t, http.MethodPost, "/api/projects/"+p1+"/node-types", map[string]any{
		"name": "Type1", "slug": "type1", "fields": []any{},
	})
	var nt map[string]any
	decode(t, ntResp, &nt)
	ntID := nt["id"].(string)

	// Attempt to create a node in p2 using a type from p1
	resp := ts.do(t, http.MethodPost, "/api/projects/"+p2+"/nodes", map[string]any{
		"typeId": ntID, "title": "Cross-project Node",
		"properties": map[string]any{},
	})
	assert.Equal(t, http.StatusUnprocessableEntity, resp.StatusCode)
}

func TestGetNode_Returns200WithCorrectShape(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID, ntID := setupProjectWithTypes(t, ts)

	createResp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
		"typeId": ntID, "title": "Frodo",
		"properties": map[string]any{"species": "Hobbit"},
	})
	var node map[string]any
	decode(t, createResp, &node)

	resp := ts.do(t, http.MethodGet, "/api/nodes/"+node["id"].(string), nil)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var fetched map[string]any
	decode(t, resp, &fetched)
	assert.Equal(t, node["id"], fetched["id"])
	assert.Equal(t, "Frodo", fetched["title"])
}

func TestPatchNode_UpdatesTitle(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID, ntID := setupProjectWithTypes(t, ts)

	createResp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
		"typeId": ntID, "title": "Original Title",
		"properties": map[string]any{"species": "Dwarf"},
	})
	var node map[string]any
	decode(t, createResp, &node)

	patchResp := ts.do(t, http.MethodPatch, "/api/nodes/"+node["id"].(string), map[string]any{
		"title": "Updated Title",
	})
	assert.Equal(t, http.StatusOK, patchResp.StatusCode)

	var updated map[string]any
	decode(t, patchResp, &updated)
	assert.Equal(t, "Updated Title", updated["title"])
}

func TestDeleteNode_Returns204(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID, ntID := setupProjectWithTypes(t, ts)

	createResp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
		"typeId": ntID, "title": "ToDelete",
		"properties": map[string]any{},
	})
	var node map[string]any
	decode(t, createResp, &node)

	delResp := ts.do(t, http.MethodDelete, "/api/nodes/"+node["id"].(string), nil)
	assert.Equal(t, http.StatusNoContent, delResp.StatusCode)

	getResp := ts.do(t, http.MethodGet, "/api/nodes/"+node["id"].(string), nil)
	assert.Equal(t, http.StatusNotFound, getResp.StatusCode)
}

// =============================================================================
// 8. Edges
// =============================================================================

func setupProjectWithNodesAndEdgeType(t *testing.T, ts *testServer) (projectID, n1ID, n2ID, etID string) {
	t.Helper()
	projectID, ntID := setupProjectWithTypes(t, ts)

	etResp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/edge-types", map[string]any{
		"name": "Knows", "slug": "knows", "fields": []any{},
	})
	var et map[string]any
	decode(t, etResp, &et)
	etID = et["id"].(string)

	n1Resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
		"typeId": ntID, "title": "Node A", "properties": map[string]any{},
	})
	n2Resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
		"typeId": ntID, "title": "Node B", "properties": map[string]any{},
	})
	var n1, n2 map[string]any
	decode(t, n1Resp, &n1)
	decode(t, n2Resp, &n2)
	return projectID, n1["id"].(string), n2["id"].(string), etID
}

func TestCreateEdge_ValidPayload_Returns201(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID, n1ID, n2ID, etID := setupProjectWithNodesAndEdgeType(t, ts)

	resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/edges", map[string]any{
		"typeId": etID, "sourceNodeId": n1ID, "targetNodeId": n2ID,
		"properties": map[string]any{},
	})
	assert.Equal(t, http.StatusCreated, resp.StatusCode)

	var edge map[string]any
	decode(t, resp, &edge)
	assert.NotEmpty(t, edge["id"])
	assert.Equal(t, n1ID, edge["sourceNodeId"])
	assert.Equal(t, n2ID, edge["targetNodeId"])
}

func TestCreateEdge_CrossProjectNodes_Returns422(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)

	p1ID, n1ID, _, etID := setupProjectWithNodesAndEdgeType(t, ts)

	// n2 belongs to a different project
	_, ntID2 := setupProjectWithTypes(t, ts) // different project implicitly
	_ = ntID2
	p2ID := createProject(t, ts, "blank")
	ntResp := ts.do(t, http.MethodPost, "/api/projects/"+p2ID+"/node-types", map[string]any{
		"name": "Foreign", "slug": "foreign", "fields": []any{},
	})
	var nt2 map[string]any
	decode(t, ntResp, &nt2)
	n2Resp := ts.do(t, http.MethodPost, "/api/projects/"+p2ID+"/nodes", map[string]any{
		"typeId": nt2["id"], "title": "Foreign Node", "properties": map[string]any{},
	})
	var n2 map[string]any
	decode(t, n2Resp, &n2)

	resp := ts.do(t, http.MethodPost, "/api/projects/"+p1ID+"/edges", map[string]any{
		"typeId": etID, "sourceNodeId": n1ID, "targetNodeId": n2["id"],
		"properties": map[string]any{},
	})
	assert.Equal(t, http.StatusUnprocessableEntity, resp.StatusCode,
		"cross-project edge must be rejected")
}

func TestDeleteEdge_Returns204(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID, n1ID, n2ID, etID := setupProjectWithNodesAndEdgeType(t, ts)

	createResp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/edges", map[string]any{
		"typeId": etID, "sourceNodeId": n1ID, "targetNodeId": n2ID,
		"properties": map[string]any{},
	})
	var edge map[string]any
	decode(t, createResp, &edge)

	delResp := ts.do(t, http.MethodDelete, "/api/edges/"+edge["id"].(string), nil)
	assert.Equal(t, http.StatusNoContent, delResp.StatusCode)
}

// =============================================================================
// 9. Graph Endpoint
// =============================================================================

func TestGraphEndpoint_ReturnsExpectedShape(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID := createProject(t, ts, "rpg_campaign")

	resp := ts.do(t, http.MethodGet, "/api/projects/"+projectID+"/graph?includeTypes=true&includeLayouts=true", nil)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var graph map[string]any
	decode(t, resp, &graph)

	for _, key := range []string{"project", "nodeTypes", "edgeTypes", "nodes", "edges", "views", "layouts"} {
		assert.Contains(t, graph, key, "graph response must contain key: "+key)
	}
}

func TestGraphEndpoint_DoesNotExposeOtherProjectData(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)

	p1 := createProject(t, ts, "blank")
	p2 := createProject(t, ts, "blank")

	// Create a node in p1
	ntResp := ts.do(t, http.MethodPost, "/api/projects/"+p1+"/node-types", map[string]any{
		"name": "Secret", "slug": "secret", "fields": []any{},
	})
	var nt map[string]any
	decode(t, ntResp, &nt)
	ts.do(t, http.MethodPost, "/api/projects/"+p1+"/nodes", map[string]any{
		"typeId": nt["id"], "title": "Secret Node", "properties": map[string]any{},
	})

	// Fetch graph for p2 — should not contain p1's node
	resp := ts.do(t, http.MethodGet, "/api/projects/"+p2+"/graph", nil)
	var graph map[string]any
	decode(t, resp, &graph)

	nodes := graph["nodes"].([]any)
	for _, n := range nodes {
		node := n.(map[string]any)
		assert.NotEqual(t, "Secret Node", node["title"],
			"p2 graph must not leak p1 nodes")
	}
}

// =============================================================================
// 10. Views
// =============================================================================

func TestCreateView_Returns201(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID := createProject(t, ts, "blank")

	resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/views", map[string]any{
		"name": "Main View",
		"mode": "graph",
	})
	assert.Equal(t, http.StatusCreated, resp.StatusCode)

	var view map[string]any
	decode(t, resp, &view)
	assert.Equal(t, "Main View", view["name"])
	assert.Equal(t, "graph", view["mode"])
}

func TestListViews_ReturnsProjectViews(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	// RPG preset creates a default view
	projectID := createProject(t, ts, "rpg_campaign")

	resp := ts.do(t, http.MethodGet, "/api/projects/"+projectID+"/views", nil)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var views []map[string]any
	decode(t, resp, &views)
	assert.GreaterOrEqual(t, len(views), 1, "RPG preset must create at least one default view")
}

// =============================================================================
// 11. Layouts
// =============================================================================

func TestUpsertLayout_Returns200(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID, ntID := setupProjectWithTypes(t, ts)

	// Get or create a view
	viewResp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/views", map[string]any{
		"name": "Layout Test View", "mode": "graph",
	})
	var view map[string]any
	decode(t, viewResp, &view)
	viewID := view["id"].(string)

	nodeResp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
		"typeId": ntID, "title": "Positioned Node", "properties": map[string]any{},
	})
	var node map[string]any
	decode(t, nodeResp, &node)
	nodeID := node["id"].(string)

	resp := ts.do(t, http.MethodPut, "/api/views/"+viewID+"/layouts/"+nodeID, map[string]any{
		"x": 120.5, "y": -40.25, "locked": false,
	})
	assert.Equal(t, http.StatusOK, resp.StatusCode)
}

func TestBulkLayoutUpdate_Returns200(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID, ntID := setupProjectWithTypes(t, ts)

	viewResp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/views", map[string]any{
		"name": "Bulk View", "mode": "graph",
	})
	var view map[string]any
	decode(t, viewResp, &view)
	viewID := view["id"].(string)

	// Create two nodes
	var nodeIDs []string
	for i := 0; i < 2; i++ {
		nr := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
			"typeId": ntID, "title": fmt.Sprintf("BulkNode%d", i),
			"properties": map[string]any{},
		})
		var n map[string]any
		decode(t, nr, &n)
		nodeIDs = append(nodeIDs, n["id"].(string))
	}

	items := make([]map[string]any, len(nodeIDs))
	for i, id := range nodeIDs {
		items[i] = map[string]any{"nodeId": id, "x": float64(i * 100), "y": 0.0, "locked": false}
	}

	resp := ts.do(t, http.MethodPatch, "/api/views/"+viewID+"/layouts/bulk", map[string]any{
		"items": items,
	})
	assert.Equal(t, http.StatusOK, resp.StatusCode)
}

func TestLayout_CrossProjectNode_IsRejected(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)

	p1ID, ntID := setupProjectWithTypes(t, ts)
	p2ID := createProject(t, ts, "blank")

	viewResp := ts.do(t, http.MethodPost, "/api/projects/"+p2ID+"/views", map[string]any{
		"name": "P2 View", "mode": "graph",
	})
	var view map[string]any
	decode(t, viewResp, &view)
	viewID := view["id"].(string)

	// Node belongs to p1
	nodeResp := ts.do(t, http.MethodPost, "/api/projects/"+p1ID+"/nodes", map[string]any{
		"typeId": ntID, "title": "P1 Node", "properties": map[string]any{},
	})
	var node map[string]any
	decode(t, nodeResp, &node)

	resp := ts.do(t, http.MethodPut, "/api/views/"+viewID+"/layouts/"+node["id"].(string), map[string]any{
		"x": 0.0, "y": 0.0, "locked": false,
	})
	assert.Equal(t, http.StatusUnprocessableEntity, resp.StatusCode,
		"layout entry must not reference a node from another project")
}

// =============================================================================
// 12. Memberships
// =============================================================================

func TestAddMember_OwnerCanInvite(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID := createProject(t, ts, "blank")

	// Register a second user
	ts2 := newTestServer(t)
	user2 := ts2.registerAndLogin(t)

	resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/members", map[string]any{
		"userId": user2["id"],
		"role":   "editor",
	})
	assert.Equal(t, http.StatusCreated, resp.StatusCode)
}

func TestAddMember_EditorCannotInvite(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID := createProject(t, ts, "blank")

	ts2 := newTestServer(t)
	editor := ts2.registerAndLogin(t)
	ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/members", map[string]any{
		"userId": editor["id"], "role": "editor",
	})

	ts3 := newTestServer(t)
	user3 := ts3.registerAndLogin(t)

	// Editor tries to invite user3
	resp := ts2.do(t, http.MethodPost, "/api/projects/"+projectID+"/members", map[string]any{
		"userId": user3["id"], "role": "editor",
	})
	assert.Equal(t, http.StatusForbidden, resp.StatusCode)
}

func TestUpdateMemberRole_OwnerCanChange(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID := createProject(t, ts, "blank")

	ts2 := newTestServer(t)
	user2 := ts2.registerAndLogin(t)
	ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/members", map[string]any{
		"userId": user2["id"], "role": "editor",
	})

	resp := ts.do(t, http.MethodPatch, "/api/projects/"+projectID+"/members/"+user2["id"].(string), map[string]any{
		"role": "viewer",
	})
	assert.Equal(t, http.StatusOK, resp.StatusCode)
}

func TestRemoveMember_OwnerCanRemove(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID := createProject(t, ts, "blank")

	ts2 := newTestServer(t)
	user2 := ts2.registerAndLogin(t)
	ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/members", map[string]any{
		"userId": user2["id"], "role": "editor",
	})

	resp := ts.do(t, http.MethodDelete, "/api/projects/"+projectID+"/members/"+user2["id"].(string), nil)
	assert.Equal(t, http.StatusNoContent, resp.StatusCode)
}

// =============================================================================
// 13. Authorization – Viewer Role
// =============================================================================

func TestViewer_CanReadButNotMutate(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID, ntID := setupProjectWithTypes(t, ts)

	ts2 := newTestServer(t)
	viewer := ts2.registerAndLogin(t)
	ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/members", map[string]any{
		"userId": viewer["id"], "role": "viewer",
	})

	// Viewer can read
	getResp := ts2.do(t, http.MethodGet, "/api/projects/"+projectID, nil)
	assert.Equal(t, http.StatusOK, getResp.StatusCode)

	// Viewer cannot create a node
	createResp := ts2.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
		"typeId": ntID, "title": "Sneaky Node", "properties": map[string]any{},
	})
	assert.Equal(t, http.StatusForbidden, createResp.StatusCode)
}

// =============================================================================
// 14. FieldDefinition Validation (Unit-style – validate the validator)
// =============================================================================

// These tests exercise the field validator in isolation.
// Adjust import path to your actual field_validator package.

// NOTE: The tests below are representative contracts. Wire them to the real
// validator once internal/app/services/field_validator.go is implemented.

type FieldDefinition struct {
	Key          string         `json:"key"`
	Label        string         `json:"label"`
	Type         string         `json:"type"`
	Required     bool           `json:"required"`
	DefaultValue any            `json:"defaultValue"`
	Options      []string       `json:"options"`
	Validation   map[string]any `json:"validation"`
}

// ValidateFieldDefinitions is a placeholder signature matching the contract.
// Replace with the real function from your codebase.
func ValidateFieldDefinitions(fields []FieldDefinition) error { return nil }

// ValidateNodeProperties validates a properties map against a list of field defs.
func ValidateNodeProperties(fields []FieldDefinition, properties map[string]any) error { return nil }

func TestFieldValidator_ValidTextField(t *testing.T) {
	fields := []FieldDefinition{
		{Key: "bio", Label: "Biography", Type: "text", Required: false, Options: []string{}},
	}
	err := ValidateFieldDefinitions(fields)
	assert.NoError(t, err)
}

func TestFieldValidator_InvalidType_ReturnsError(t *testing.T) {
	fields := []FieldDefinition{
		{Key: "x", Label: "X", Type: "rainbow_emoji", Required: false},
	}
	// This test documents the expected contract:
	// ValidateFieldDefinitions must reject unknown field types.
	// Uncomment once wired to the real implementation:
	// err := ValidateFieldDefinitions(fields)
	// assert.Error(t, err)
	_ = fields // silence unused warning until wired
	t.Skip("wire to real ValidateFieldDefinitions to activate")
}

func TestFieldValidator_SelectWithoutOptions_ReturnsError(t *testing.T) {
	fields := []FieldDefinition{
		{Key: "tier", Label: "Tier", Type: "select", Required: false, Options: []string{}},
	}
	_ = fields
	t.Skip("wire to real ValidateFieldDefinitions to activate")
}

func TestFieldValidator_RequiredFieldMissingInProperties(t *testing.T) {
	fields := []FieldDefinition{
		{Key: "name", Label: "Name", Type: "text", Required: true},
	}
	properties := map[string]any{} // name is missing
	_ = properties
	_ = fields
	t.Skip("wire to real ValidateNodeProperties to activate")
}

func TestFieldValidator_UnknownPropertyKeyRejected(t *testing.T) {
	fields := []FieldDefinition{
		{Key: "name", Label: "Name", Type: "text", Required: false},
	}
	properties := map[string]any{"name": "Legolas", "notAField": "surprise"}
	_ = properties
	_ = fields
	t.Skip("wire to real ValidateNodeProperties to activate")
}

func TestFieldValidator_URLField_InvalidURL_ReturnsError(t *testing.T) {
	fields := []FieldDefinition{
		{Key: "website", Label: "Website", Type: "url", Required: false},
	}
	properties := map[string]any{"website": "not a url!!"}
	_ = properties
	_ = fields
	t.Skip("wire to real ValidateNodeProperties to activate")
}

func TestFieldValidator_SelectValue_MustMatchOption(t *testing.T) {
	fields := []FieldDefinition{
		{Key: "tier", Label: "Tier", Type: "select", Required: false,
			Options: []string{"bronze", "silver", "gold"}},
	}
	properties := map[string]any{"tier": "platinum"} // not in options
	_ = properties
	_ = fields
	t.Skip("wire to real ValidateNodeProperties to activate")
}

func TestFieldValidator_MultiSelectValues_AllMustMatchOptions(t *testing.T) {
	fields := []FieldDefinition{
		{Key: "tags", Label: "Tags", Type: "multi_select", Required: false,
			Options: []string{"hero", "villain", "neutral"}},
	}
	properties := map[string]any{"tags": []string{"hero", "unknown_tag"}}
	_ = properties
	_ = fields
	t.Skip("wire to real ValidateNodeProperties to activate")
}

// =============================================================================
// 15. Error Response Shape
// =============================================================================

func TestErrorResponse_HasCorrectShape(t *testing.T) {
	ts := newTestServer(t)
	// Not authenticated — should get UNAUTHENTICATED error
	resp := ts.do(t, http.MethodGet, "/api/projects", nil)
	assert.Equal(t, http.StatusUnauthorized, resp.StatusCode)

	var body map[string]any
	decode(t, resp, &body)
	errObj, ok := body["error"].(map[string]any)
	require.True(t, ok, "response body must contain 'error' object")
	assert.Equal(t, "UNAUTHENTICATED", errObj["code"])
	assert.NotEmpty(t, errObj["message"])
}

func TestErrorResponse_NotFound_Returns404WithCode(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	resp := ts.do(t, http.MethodGet, "/api/nodes/"+uuid.New().String(), nil)
	assert.Equal(t, http.StatusNotFound, resp.StatusCode)

	var body map[string]any
	decode(t, resp, &body)
	errObj := body["error"].(map[string]any)
	assert.Equal(t, "NOT_FOUND", errObj["code"])
}

// =============================================================================
// 16. Preset – Transactional Rollback
// =============================================================================

func TestPreset_FailureRollsBackProject(t *testing.T) {
	// This test documents the contract: if preset application fails, the whole
	// project creation transaction must roll back.
	// To exercise this, you need to inject a failing preset or use a mock.
	t.Skip("requires fault injection or mock preset registry – implement in integration suite")
}

// =============================================================================
// 17. Unauthenticated Access Blocked on All Project Endpoints
// =============================================================================

func TestUnauthenticated_AllProjectEndpointsReturn401(t *testing.T) {
	ts := newTestServer(t)
	// No login — no cookie

	fakeID := uuid.New().String()
	cases := []struct {
		method string
		path   string
	}{
		{http.MethodGet, "/api/projects"},
		{http.MethodPost, "/api/projects"},
		{http.MethodGet, "/api/projects/" + fakeID},
		{http.MethodPatch, "/api/projects/" + fakeID},
		{http.MethodDelete, "/api/projects/" + fakeID},
		{http.MethodGet, "/api/projects/" + fakeID + "/node-types"},
		{http.MethodPost, "/api/projects/" + fakeID + "/node-types"},
		{http.MethodGet, "/api/node-types/" + fakeID},
		{http.MethodPatch, "/api/node-types/" + fakeID},
		{http.MethodDelete, "/api/node-types/" + fakeID},
		{http.MethodGet, "/api/projects/" + fakeID + "/edge-types"},
		{http.MethodPost, "/api/projects/" + fakeID + "/edge-types"},
		{http.MethodGet, "/api/projects/" + fakeID + "/nodes"},
		{http.MethodPost, "/api/projects/" + fakeID + "/nodes"},
		{http.MethodGet, "/api/nodes/" + fakeID},
		{http.MethodPatch, "/api/nodes/" + fakeID},
		{http.MethodDelete, "/api/nodes/" + fakeID},
		{http.MethodGet, "/api/projects/" + fakeID + "/edges"},
		{http.MethodPost, "/api/projects/" + fakeID + "/edges"},
		{http.MethodGet, "/api/projects/" + fakeID + "/graph"},
		{http.MethodGet, "/api/projects/" + fakeID + "/views"},
		{http.MethodPost, "/api/projects/" + fakeID + "/views"},
		{http.MethodGet, "/api/views/" + fakeID + "/layouts"},
		{http.MethodPatch, "/api/views/" + fakeID + "/layouts/bulk"},
	}

	for _, tc := range cases {
		t.Run(tc.method+" "+tc.path, func(t *testing.T) {
			resp := ts.do(t, tc.method, tc.path, nil)
			assert.Equal(t, http.StatusUnauthorized, resp.StatusCode,
				"%s %s must return 401 for unauthenticated requests", tc.method, tc.path)
		})
	}
}

// =============================================================================
// 18. Concurrency / Version field
// =============================================================================

func TestNode_VersionIncrements_OnUpdate(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID, ntID := setupProjectWithTypes(t, ts)

	createResp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
		"typeId": ntID, "title": "Versioned Node", "properties": map[string]any{},
	})
	var node map[string]any
	decode(t, createResp, &node)
	initialVersion := node["version"]

	patchResp := ts.do(t, http.MethodPatch, "/api/nodes/"+node["id"].(string), map[string]any{
		"title": "Versioned Node V2",
	})
	var updated map[string]any
	decode(t, patchResp, &updated)

	// Version should have incremented
	assert.NotEqual(t, initialVersion, updated["version"],
		"node version must increment after update")
}

// =============================================================================
// 19. Timestamp fields
// =============================================================================

func TestNode_HasCreatedAtAndUpdatedAt(t *testing.T) {
	ts := newTestServer(t)
	ts.registerAndLogin(t)
	projectID, ntID := setupProjectWithTypes(t, ts)

	resp := ts.do(t, http.MethodPost, "/api/projects/"+projectID+"/nodes", map[string]any{
		"typeId": ntID, "title": "Timestamped", "properties": map[string]any{},
	})
	var node map[string]any
	decode(t, resp, &node)

	assert.NotEmpty(t, node["createdAt"], "node must have createdAt")
	assert.NotEmpty(t, node["updatedAt"], "node must have updatedAt")

	// Timestamps must be parseable as RFC3339
	_, err := time.Parse(time.RFC3339, node["createdAt"].(string))
	assert.NoError(t, err, "createdAt must be valid RFC3339")
}

// =============================================================================
// 20. WebSocket – documented contracts (require ws test harness to activate)
// =============================================================================

// TestWebSocket_UnauthenticatedConnectionRejected documents:
//   GET /ws/projects/:projectId must reject unauthenticated connections.
//
// TestWebSocket_NonMemberConnectionRejected documents:
//   GET /ws/projects/:projectId must reject users with no membership.
//
// TestWebSocket_NodeCreateCommand_BroadcastsToRoom documents:
//   A node.create command must persist the node and broadcast node.created
//   to all room members.
//
// TestWebSocket_FailedCommand_ReturnsErrorAck documents:
//   A command with invalid payload must return a command.ack with
//   status "error" and not broadcast any mutation event.
//
// TestWebSocket_LayoutUpdate_Debounce documents:
//   layout.update and layout.bulk_update commands must persist to DB and
//   broadcast layout.updated before responding.
//
// These are implemented as integration tests in websocket_test.go using
// gorilla/websocket or nhooyr.io/websocket dialers. Activate once the
// WebSocket hub is wired.

func TestWebSocket_ContractDocumented(t *testing.T) {
	t.Log("WebSocket contract tests are in websocket_test.go – activate once hub is implemented")
}
