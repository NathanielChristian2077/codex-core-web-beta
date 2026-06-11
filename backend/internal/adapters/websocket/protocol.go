package websocket

import "encoding/json"

type ClientCommand struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

type ServerEvent struct {
	Type    string `json:"type"`
	Payload any    `json:"payload"`
}
