package domain

import "testing"

func TestNodeCarriesGenericTypeAndProperties(t *testing.T) {
	content := "A generic node can still represent RPG data through presets."
	node := Node{
		ID:        ID("node-1"),
		ProjectID: ID("project-1"),
		TypeID:    ID("type-character"),
		Title:     "Bilbo Baggins",
		Content:   &content,
		Properties: JSONMap{
			"legacyType": "CHARACTER",
			"importance": "high",
		},
	}

	if node.ID != "node-1" || node.ProjectID != "project-1" || node.TypeID != "type-character" {
		t.Fatalf("unexpected node identity fields: %#v", node)
	}
	if node.Title != "Bilbo Baggins" || node.Content == nil || *node.Content != content {
		t.Fatalf("unexpected node content fields: %#v", node)
	}
	if node.Properties["legacyType"] != "CHARACTER" || node.Properties["importance"] != "high" {
		t.Fatalf("unexpected node properties: %#v", node.Properties)
	}
}
