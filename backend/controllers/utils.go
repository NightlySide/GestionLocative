package controllers

import (
	"net/http"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"github.com/nightlyside/gestion-locative/auth"
)

func GetClaimsFromContext(c echo.Context) (*auth.Claims, error) {
	// context given by the jwt middleware
	if c.Get("user") == nil {
		return nil, echo.NewHTTPError(http.StatusInternalServerError, "No context found")
	}

	u := c.Get("user").(*jwt.Token)
	claims := u.Claims.(*auth.Claims)

	return claims, nil
}
