package domain

import "time"

type Edge struct {
	ID           ID        `json:"id"`
	ProjectID    ID        `json:"projectId"`
	SourceNodeID ID        `json:"sourceNodeId"`
	TargetNodeID ID        `json:"targetNodeId"`
	TypeID       ID        `json:"typeId"`
	Properties   JSONMap   `json:"properties"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}
