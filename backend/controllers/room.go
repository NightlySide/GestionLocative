package controllers

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/nightlyside/gestion-locative/database"
	"github.com/nightlyside/gestion-locative/models"
)

func RoomsList() echo.HandlerFunc {
	return func(c echo.Context) error {
		claims, err := GetClaimsFromContext(c)
		if err != nil {
			return err
		}

		db := database.DB

		var rooms []string
		err = db.
			Model(&models.Room{}).
			Select("rooms.id").
			Joins("join properties on properties.id = rooms.property_id").
			Where("properties.landlord_id = ?", claims.UserId).Scan(&rooms).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.JSON(http.StatusOK, rooms)
	}
}

func CreateRoom() echo.HandlerFunc {
	return func(c echo.Context) error {
		r := new(models.Room)
		valid := validator.New()

		// validate data
		err := c.Bind(r)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}
		err = valid.Struct(r)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		r.Id = uuid.NewString()

		db := database.DB
		db.Create(&r)

		return c.JSON(http.StatusCreated, &r)
	}
}

func RoomInfos() echo.HandlerFunc {
	return func(c echo.Context) error {
		// Room id from /room/:id
		id := c.Param("id")

		var room models.Room
		db := database.DB
		db.Where("id = ?", id).First(&room)

		return c.JSON(http.StatusOK, room)
	}
}

func UpdateRoom() echo.HandlerFunc {
	return func(c echo.Context) error {
		// Room id from /room/:id
		id := c.Param("id")

		// try to bind body data
		r := new(models.Room)
		err := c.Bind(&r)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		// update instance in db
		db := database.DB
		var dbRoom models.Room
		err = db.Model(&dbRoom).Where("id = ?", id).Updates(&r).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		// retrieve updated instance
		db.Where("id = ?", id).First(&dbRoom)

		return c.JSON(http.StatusOK, dbRoom)
	}
}

func DeleteRoom() echo.HandlerFunc {
	return func(c echo.Context) error {
		// Room id from /room/:id
		id := c.Param("id")

		db := database.DB
		var exists bool
		db.Model(&models.Room{}).Select("count(*) > 0").Where("id = ?", id).Find(&exists)
		if !exists {
			return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Room with id %s does not exist", id))
		}

		err := db.Where("id = ?", id).Delete(&models.Room{}).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.JSON(http.StatusOK, "Deleted successfully")
	}
}

func GetRoomTenants() echo.HandlerFunc {
	return func(c echo.Context) error {
		id := c.Param("id")

		claims, err := GetClaimsFromContext(c)
		if err != nil {
			return err
		}

		db := database.DB
		var tenants []string
		err = db.Model(&models.Tenant{}).
			Select("tenants.id").
			Joins("join rooms on rooms.id = tenants.room_id").
			Joins("join properties on properties.id = rooms.property_id").
			Where("rooms.id = ? AND properties.landlord_id = ?", id, claims.UserId).
			Scan(&tenants).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.JSON(http.StatusOK, tenants)
	}
}
