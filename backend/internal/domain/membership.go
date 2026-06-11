package domain

import "time"

type MembershipRole string

const (
	MembershipRoleOwner  MembershipRole = "OWNER"
	MembershipRoleEditor MembershipRole = "EDITOR"
	MembershipRoleViewer MembershipRole = "VIEWER"
)

type Membership struct {
	ID        ID             `json:"id"`
	ProjectID ID             `json:"projectId"`
	UserID    ID             `json:"userId"`
	Role      MembershipRole `json:"role"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
}
