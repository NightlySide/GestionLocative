package controllers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/nightlyside/gestion-locative/database"
	"github.com/nightlyside/gestion-locative/models"
)

func AccountInfos() echo.HandlerFunc {
	return func(c echo.Context) error {
		claims, err := GetClaimsFromContext(c)
		if err != nil {
			return err
		}

		var user models.User
		db := database.DB
		db.First(&user, claims.Id)

		// remove password from response
		user.Password = ""

		return c.JSON(http.StatusOK, user)
	}
}
