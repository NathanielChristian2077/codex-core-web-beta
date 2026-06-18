package domain

import "testing"

func TestEdgeCarriesTypedConnectionData(t *testing.T) {
	edge := Edge{
		ID:           ID("edge-1"),
		ProjectID:    ID("project-1"),
		SourceNodeID: ID("node-source"),
		TargetNodeID: ID("node-target"),
		TypeID:       ID("type-relationship"),
		Properties: JSONMap{
			"label":    "mentor",
			"directed": true,
		},
	}

	if edge.ID != "edge-1" || edge.ProjectID != "project-1" || edge.TypeID != "type-relationship" {
		t.Fatalf("unexpected edge identity fields: %#v", edge)
	}
	if edge.SourceNodeID != "node-source" || edge.TargetNodeID != "node-target" {
		t.Fatalf("unexpected edge endpoints: %#v", edge)
	}
	if edge.Properties["label"] != "mentor" || edge.Properties["directed"] != true {
		t.Fatalf("unexpected edge properties: %#v", edge.Properties)
	}
}
