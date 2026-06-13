package domain

import "time"

type EdgeType struct {
	ID          ID                `json:"id"`
	ProjectID   ID                `json:"projectId"`
	Name        string            `json:"name"`
	Slug        string            `json:"slug"`
	Description *string           `json:"description"`
	Directed    bool              `json:"directed"`
	Color       *string           `json:"color"`
	StrokeStyle *string           `json:"strokeStyle"`
	Fields      []FieldDefinition `json:"fields"`
	CreatedAt   time.Time         `json:"createdAt"`
	UpdatedAt   time.Time         `json:"updatedAt"`
}
