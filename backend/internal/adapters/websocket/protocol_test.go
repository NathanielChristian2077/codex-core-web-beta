package websocket

import (
	"encoding/json"
	"testing"
)

func TestClientCommandKeepsPayloadAsRawJSON(t *testing.T) {
	message := []byte(`{"type":"createNode","payload":{"title":"Bilbo","properties":{"level":1}}}`)

	var command ClientCommand
	if err := json.Unmarshal(message, &command); err != nil {
		t.Fatalf("json.Unmarshal() returned an unexpected error: %v", err)
	}

	if command.Type != "createNode" {
		t.Fatalf("unexpected command type: %q", command.Type)
	}

	var payload struct {
		Title      string         `json:"title"`
		Properties map[string]int `json:"properties"`
	}
	if err := json.Unmarshal(command.Payload, &payload); err != nil {
		t.Fatalf("payload json.Unmarshal() returned an unexpected error: %v", err)
	}
	if payload.Title != "Bilbo" || payload.Properties["level"] != 1 {
		t.Fatalf("unexpected command payload: %#v", payload)
	}
}

func TestServerEventMarshalsPayload(t *testing.T) {
	event := ServerEvent{
		Type: "node.created",
		Payload: map[string]any{
			"id":    "node-1",
			"title": "Bilbo",
		},
	}

	encoded, err := json.Marshal(event)
	if err != nil {
		t.Fatalf("json.Marshal() returned an unexpected error: %v", err)
	}

	var decoded struct {
		Type    string         `json:"type"`
		Payload map[string]any `json:"payload"`
	}
	if err := json.Unmarshal(encoded, &decoded); err != nil {
		t.Fatalf("json.Unmarshal() returned an unexpected error: %v", err)
	}
	if decoded.Type != "node.created" {
		t.Fatalf("unexpected event type: %q", decoded.Type)
	}
	if decoded.Payload["id"] != "node-1" || decoded.Payload["title"] != "Bilbo" {
		t.Fatalf("unexpected event payload: %#v", decoded.Payload)
	}
}
