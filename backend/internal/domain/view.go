package domain

import "time"

type ViewMode string

const (
	ViewModeGraph ViewMode = "graph"
)

type View struct {
	ID        ID        `json:"id"`
	ProjectID ID        `json:"projectId"`
	Name      string    `json:"name"`
	Mode      ViewMode  `json:"mode"`
	Filters   JSONMap   `json:"filters"`
	Settings  JSONMap   `json:"settings"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Layout struct {
	ID        ID        `json:"id"`
	ProjectID ID        `json:"projectId"`
	ViewID    ID        `json:"viewId"`
	NodeID    ID        `json:"nodeId"`
	X         float64   `json:"x"`
	Y         float64   `json:"y"`
	Locked    bool      `json:"locked"`
	UpdatedAt time.Time `json:"updatedAt"`
}
