package domain

import "time"

type NodeType struct {
	ID          ID                `json:"id"`
	ProjectID   ID                `json:"projectId"`
	Name        string            `json:"name"`
	Slug        string            `json:"slug"`
	Description *string           `json:"description"`
	Color       *string           `json:"color"`
	Icon        *string           `json:"icon"`
	Fields      []FieldDefinition `json:"fields"`
	CreatedAt   time.Time         `json:"createdAt"`
	UpdatedAt   time.Time         `json:"updatedAt"`
}
