package auth

import "time"

type TokenClaims struct {
	UserID string
	Email  string
	Issued time.Time
	Expiry time.Time
}
