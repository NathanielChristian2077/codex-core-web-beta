package auth

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"
)

var (
	ErrInvalidToken = errors.New("invalid token")
	ErrExpiredToken = errors.New("expired token")
)

type TokenClaims struct {
	UserID string    `json:"sub"`
	Email  string    `json:"email"`
	Issued time.Time `json:"iat"`
	Expiry time.Time `json:"exp"`
}

type TokenService struct {
	secret []byte
	ttl    time.Duration
}

func NewTokenService(secret string, ttl time.Duration) *TokenService {
	return &TokenService{secret: []byte(secret), ttl: ttl}
}

func (s *TokenService) Issue(userID string, email string) (string, TokenClaims, error) {
	now := time.Now().UTC()
	claims := TokenClaims{
		UserID: userID,
		Email:  email,
		Issued: now,
		Expiry: now.Add(s.ttl),
	}

	payload, err := json.Marshal(claims)
	if err != nil {
		return "", TokenClaims{}, fmt.Errorf("marshal token claims: %w", err)
	}

	encodedPayload := base64.RawURLEncoding.EncodeToString(payload)
	signature := s.sign(encodedPayload)

	return encodedPayload + "." + signature, claims, nil
}

func (s *TokenService) Verify(token string) (TokenClaims, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 2 {
		return TokenClaims{}, ErrInvalidToken
	}

	payload := parts[0]
	signature := parts[1]
	expected := s.sign(payload)

	if !hmac.Equal([]byte(signature), []byte(expected)) {
		return TokenClaims{}, ErrInvalidToken
	}

	decoded, err := base64.RawURLEncoding.DecodeString(payload)
	if err != nil {
		return TokenClaims{}, ErrInvalidToken
	}

	var claims TokenClaims
	if err := json.Unmarshal(decoded, &claims); err != nil {
		return TokenClaims{}, ErrInvalidToken
	}

	if time.Now().UTC().After(claims.Expiry) {
		return TokenClaims{}, ErrExpiredToken
	}

	return claims, nil
}

func (s *TokenService) sign(payload string) string {
	mac := hmac.New(sha256.New, s.secret)
	_, _ = mac.Write([]byte(payload))
	return base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
}

func GenerateSecureToken(size int) (string, error) {
	bytes := make([]byte, size)
	if _, err := rand.Read(bytes); err != nil {
		return "", fmt.Errorf("generate secure token: %w", err)
	}
	return base64.RawURLEncoding.EncodeToString(bytes), nil
}
