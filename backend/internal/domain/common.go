package domain

import "encoding/json"

type ID string

type JSONMap map[string]any

func EmptyJSONMap() JSONMap {
	return JSONMap{}
}

func RawJSON(value any) (json.RawMessage, error) {
	if value == nil {
		return json.RawMessage(`{}`), nil
	}
	return json.Marshal(value)
}
