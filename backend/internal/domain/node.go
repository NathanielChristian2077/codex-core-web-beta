package domain

import "time"

type Node struct {
	ID         ID        `json:"id"`
	ProjectID  ID        `json:"projectId"`
	TypeID     ID        `json:"typeId"`
	Title      string    `json:"title"`
	Content    *string   `json:"content"`
	Properties JSONMap   `json:"properties"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}
