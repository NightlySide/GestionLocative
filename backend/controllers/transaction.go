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

func TransactionsList() echo.HandlerFunc {
	return func(c echo.Context) error {
		claims, err := GetClaimsFromContext(c)
		if err != nil {
			return err
		}

		var transactions []string
		db := database.DB
		err = db.
			Model(&models.Transaction{}).
			Select("id").
			Where("landlord_id = ?", claims.UserId).
			Scan(&transactions).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.JSON(http.StatusOK, transactions)
	}
}

func CreateTransaction() echo.HandlerFunc {
	return func(c echo.Context) error {
		t := new(models.Transaction)
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

func TransactionInfos() echo.HandlerFunc {
	return func(c echo.Context) error {
		// Transaction id from /protransactionperty/:id
		id := c.Param("id")

		var transaction models.Transaction
		db := database.DB
		db.Where("id = ?", id).First(&transaction)

		return c.JSON(http.StatusOK, transaction)
	}
}

func UpdateTransaction() echo.HandlerFunc {
	return func(c echo.Context) error {
		// Transaction id from /protransactionperty/:id
		id := c.Param("id")

		// try to bind body data
		t := new(models.Transaction)
		err := c.Bind(&t)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		// update instance in db
		db := database.DB
		var dbTransaction models.Transaction
		err = db.Model(&dbTransaction).Where("id = ?", id).Updates(&t).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		// retrieve updated instance
		db.Where("id = ?", id).First(&dbTransaction)

		return c.JSON(http.StatusOK, dbTransaction)
	}
}

func DeleteTransaction() echo.HandlerFunc {
	return func(c echo.Context) error {
		// Transaction id from /protransactionperty/:id
		id := c.Param("id")

		db := database.DB
		var exists bool
		db.Model(&models.Transaction{}).Select("count(*) > 0").Where("id = ?", id).Find(&exists)
		if !exists {
			return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Transaction with id %s does not exist", id))
		}

		err := db.Where("id = ?", id).Delete(&models.Transaction{}).Error
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.JSON(http.StatusOK, "Deleted successfully")
	}
}
