package domain

import "time"

type UserRole string

const (
	UserRoleOwner  UserRole = "OWNER"
	UserRoleMember UserRole = "MEMBER"
)

type User struct {
	ID           ID        `json:"id"`
	Name         *string   `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}
