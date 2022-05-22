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

func TenantsList() echo.HandlerFunc {
	return func(c echo.Context) error {
		claims, err := GetClaimsFromContext(c)
		if err != nil {
			return err
		}

		var tenants []string
		db := database.DB
		err = db.
			Model(&models.Tenant{}).
			Select("tenants.id").
			Joins("join rooms on rooms.id = tenants.room_id").
			Joins("join properties on properties.id = rooms.property_id").
			Where("properties.landlord_id = ?", claims.UserId).Scan(&tenants).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.JSON(http.StatusOK, tenants)
	}
}

func CreateTenant() echo.HandlerFunc {
	return func(c echo.Context) error {
		t := new(models.Tenant)
		valid := validator.New()

		// validate data
		err := c.Bind(t)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}
		err = valid.Struct(t)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		t.Id = uuid.NewString()

		db := database.DB
		db.Create(&t)

		return c.JSON(http.StatusCreated, &t)
	}
}

func TenantInfos() echo.HandlerFunc {
	return func(c echo.Context) error {
		// Tenant id from /tenant/:id
		id := c.Param("id")

		var tenant models.Tenant
		db := database.DB
		db.Where("id = ?", id).First(&tenant)

		return c.JSON(http.StatusOK, tenant)
	}
}

func UpdateTenant() echo.HandlerFunc {
	return func(c echo.Context) error {
		// Tenant id from /tenant/:id
		id := c.Param("id")

		// try to bind body data
		t := new(models.Tenant)
		err := c.Bind(&t)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		// update instance in db
		db := database.DB
		var dbTenant models.Tenant
		err = db.Model(&dbTenant).Where("id = ?", id).Updates(&t).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		// retrieve updated instance
		db.Where("id = ?", id).First(&dbTenant)

		return c.JSON(http.StatusOK, dbTenant)
	}
}

func DeleteTenant() echo.HandlerFunc {
	return func(c echo.Context) error {
		// Tenant id from /tenant/:id
		id := c.Param("id")

		db := database.DB
		var exists bool
		db.Model(&models.Tenant{}).Select("count(*) > 0").Where("id = ?", id).Find(&exists)
		if !exists {
			return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Tenant with id %s does not exist", id))
		}

		err := db.Where("id = ?", id).Delete(&models.Tenant{}).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.JSON(http.StatusOK, "Deleted successfully")
	}
}

func GetTenantTransactions() echo.HandlerFunc {
	return func(c echo.Context) error {
		id := c.Param("id")

		claims, err := GetClaimsFromContext(c)
		if err != nil {
			return err
		}

		db := database.DB
		var transactions []string
		err = db.Model(&models.Transaction{}).
			Select("transactions.id").
			Joins("join tenants on tenants.id = transactions.tenant_id").
			Where("tenants.id = ? AND transactions.landlord_id = ?", id, claims.UserId).
			Scan(&transactions).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.JSON(http.StatusOK, transactions)
	}
}
