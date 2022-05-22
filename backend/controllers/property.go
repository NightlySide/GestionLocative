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

func PropertiesList() echo.HandlerFunc {
	return func(c echo.Context) error {
		claims, err := GetClaimsFromContext(c)
		if err != nil {
			return err
		}

		properties := []string{}
		db := database.DB
		err = db.
			Model(&models.Property{}).
			Select("id").
			Where("landlord_id = ?", claims.UserId).
			Scan(&properties).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.JSON(http.StatusOK, properties)
	}
}

func CreateProperty() echo.HandlerFunc {
	return func(c echo.Context) error {
		p := new(models.Property)
		valid := validator.New()

		claims, err := GetClaimsFromContext(c)
		if err != nil {
			return err
		}

		// bind and validate data
		err = c.Bind(p)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		// once the binding is done, update the struct with complementary
		// data
		p.Id = uuid.NewString()
		p.LandlordId = claims.UserId

		err = valid.Struct(p)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		db := database.DB
		db.Create(&p)

		return c.JSON(http.StatusCreated, &p)
	}
}

type PropertyFull struct {
	models.Property
	Rooms   []string `json:"rooms"`
	Tenants []string `json:"tenants"`
}

func PropertyInfos() echo.HandlerFunc {
	return func(c echo.Context) error {
		// Property id from /property/:id
		id := c.Param("id")

		claims, err := GetClaimsFromContext(c)
		if err != nil {
			return err
		}

		var property models.Property
		db := database.DB
		db.Where("id = ?", id).First(&property)

		// get complementary data
		tenants := []string{}
		err = db.Model(&models.Tenant{}).
			Select("tenants.id").
			Joins("join rooms on tenants.room_id = rooms.id").
			Joins("join properties on properties.id = rooms.property_id").
			Where("properties.id = ? AND properties.landlord_id = ?", id, claims.UserId).
			Scan(&tenants).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}
		rooms := []string{}
		err = db.Model(&models.Room{}).
			Select("rooms.id").
			Joins("join properties on properties.id = rooms.property_id").
			Where("properties.id = ? AND properties.landlord_id = ?", id, claims.UserId).
			Scan(&rooms).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		pFull := &PropertyFull{
			Property: property,
			Rooms:    rooms,
			Tenants:  tenants,
		}

		return c.JSON(http.StatusOK, pFull)
	}
}

func UpdateProperty() echo.HandlerFunc {
	return func(c echo.Context) error {
		// Property id from /property/:id
		id := c.Param("id")

		// try to bind body data
		p := new(models.Property)
		err := c.Bind(&p)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		// update instance in db
		db := database.DB
		var dbProperty models.Property
		err = db.Model(&dbProperty).Where("id = ?", id).Updates(&p).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		// retrieve updated instance
		db.Where("id = ?", id).First(&dbProperty)

		return c.JSON(http.StatusOK, dbProperty)
	}
}

func DeleteProperty() echo.HandlerFunc {
	return func(c echo.Context) error {
		// Property id from /property/:id
		id := c.Param("id")

		db := database.DB
		var exists bool
		db.Model(&models.Property{}).Select("count(*) > 0").Where("id = ?", id).Find(&exists)
		if !exists {
			return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Property with id %s does not exist", id))
		}

		err := db.Where("id = ?", id).Delete(&models.Property{}).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.JSON(http.StatusOK, "Deleted successfully")
	}
}

func GetPropertyRooms() echo.HandlerFunc {
	return func(c echo.Context) error {
		id := c.Param("id")

		claims, err := GetClaimsFromContext(c)
		if err != nil {
			return err
		}

		db := database.DB
		var rooms []string
		err = db.Model(&models.Room{}).
			Select("rooms.id").
			Joins("join properties on properties.id = rooms.property_id").
			Where("properties.id = ? AND properties.landlord_id = ?", id, claims.UserId).
			Scan(&rooms).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.JSON(http.StatusOK, rooms)
	}
}

func GetPropertyTenants() echo.HandlerFunc {
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
			Joins("join rooms on tenants.room_id = rooms.id").
			Joins("join properties on properties.id = rooms.property_id").
			Where("properties.id = ? AND properties.landlord_id = ?", id, claims.UserId).
			Scan(&tenants).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.JSON(http.StatusOK, tenants)
	}
}
