package domain

import "time"

type Project struct {
	ID          ID        `json:"id"`
	OwnerID     ID        `json:"ownerId"`
	Name        string    `json:"name"`
	Description *string   `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
