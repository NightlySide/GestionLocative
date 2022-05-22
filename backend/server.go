package main

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/nightlyside/gestion-locative/database"
)

func main() {
	// load env vars
	godotenv.Load(".env")

	// connecting to db
	port, err := strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		fmt.Println(err.Error())
	}
	_, err = database.ConnectDB(&database.ConnectConfig{
		Host:     os.Getenv("DB_HOST"),
		Port:     port,
		Username: os.Getenv("DB_USERNAME"),
		Password: os.Getenv("DB_PASSWORD"),
		Database: os.Getenv("DB_DBNAME"),
	})
	if err != nil {
		log.Fatal(err.Error())
	}

	// creating webserver
	e := setupWebserver()
	setupRouter(e)

	// starting the server
	e.Logger.Fatal(e.Start(":1234"))
}

func setupWebserver() *echo.Echo {
	e := echo.New()

	// Logger middleware
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "[${time_rfc3339}] - [${method}] ${uri} (${status}) ${error}\n",
	}))

	// Recover middleware
	e.Use(middleware.Recover())

	// CORS
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.DELETE, echo.POST},
		AllowCredentials: true,
	}))

	return e
}
