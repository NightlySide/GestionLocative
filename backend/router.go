package main

import (
	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/nightlyside/gestion-locative/auth"
	"github.com/nightlyside/gestion-locative/controllers"
)

var jwtMiddleware = middleware.JWTWithConfig(middleware.JWTConfig{
	Claims:        &auth.Claims{},
	SigningKey:    []byte(auth.GetJWTSecret()),
	SigningMethod: jwt.SigningMethodHS512.Name,
	// Possible values:
	// - "header:<name>"
	// - "query:<name>"
	// - "param:<name>"
	// - "cookie:<name>"
	// - "form:<name>"
	TokenLookup:             "header:AccessToken", // "<source>:<name>"
	ErrorHandlerWithContext: auth.JWTErrorChecker,
})

func setupRouter(e *echo.Group) {
	setupAuthRoutes(e)
	setupAdminRoutes(e)
	setupAccountRoutes(e)
	setupPropertyRoutes(e)
	setupRoomRoutes(e)
	setupTenantRoutes(e)
	setupTransactionRoutes(e)
}

func setupAuthRoutes(e *echo.Group) {
	authGroup := e.Group("/auth")
	authGroup.POST("/login", controllers.Login)
	authGroup.POST("/register", controllers.Register)
	authGroup.GET("/healthcheck", controllers.HealthCheck)
	authGroup.GET("/refresh", controllers.RefreshToken)
}

func setupAdminRoutes(e *echo.Group) {
	// defining the admin router group
	adminGroup := e.Group("/admin")
	// use middleware for jwt
	adminGroup.Use(jwtMiddleware)
}

func setupAccountRoutes(e *echo.Group) {
	accountGroup := e.Group("/account")
	accountGroup.Use(jwtMiddleware)

	accountGroup.GET("/infos", controllers.AccountInfos)
}

func setupPropertyRoutes(e *echo.Group) {
	propertyGroup := e.Group("/property")
	propertyGroup.Use(jwtMiddleware)

	// list properties
	propertyGroup.GET("", controllers.PropertiesList)
	propertyGroup.GET("/", controllers.PropertiesList)

	// create property
	propertyGroup.POST("", controllers.CreateProperty)
	propertyGroup.POST("/", controllers.CreateProperty)

	// property infos
	propertyGroup.GET("/:id", controllers.PropertyInfos)

	// update property info
	propertyGroup.PUT("/:id", controllers.UpdateProperty)

	// delete property
	propertyGroup.DELETE("/:id", controllers.DeleteProperty)

	// get rooms
	propertyGroup.GET("/:id/rooms", controllers.GetPropertyRooms)

	// get tenants
	propertyGroup.GET("/:id/tenants", controllers.GetPropertyTenants)

	// images
	propertyGroup.POST("/:id/image", controllers.UploadImageBuilder("property"))
	propertyGroup.DELETE("/:id/image", controllers.DeleteImages("property"))
	propertyGroup.GET("/:id/image", controllers.GetImagesList("property"))
	propertyGroup.GET("/:id/image_archive", controllers.GetImagesZip("property"))
	propertyGroup.GET("/:id/image/:name", controllers.GetImageBlob("property"))
}

func setupRoomRoutes(e *echo.Group) {
	roomGroup := e.Group("/room")
	roomGroup.Use(jwtMiddleware)

	// list tenants
	roomGroup.GET("", controllers.RoomsList)
	roomGroup.GET("/", controllers.RoomsList)

	// create tenant
	roomGroup.POST("", controllers.CreateRoom)
	roomGroup.POST("/", controllers.CreateRoom)

	// tenant infos
	roomGroup.GET("/:id", controllers.RoomInfos)

	// update tenant info
	roomGroup.PUT("/:id", controllers.UpdateRoom)

	// delete tenant
	roomGroup.DELETE("/:id", controllers.DeleteRoom)

	// get tenants
	roomGroup.GET("/:id/tenants", controllers.GetRoomTenants)

	// images
	roomGroup.POST("/:id/image", controllers.UploadImageBuilder("room"))
	roomGroup.GET("/:id/image", controllers.GetImagesList("room"))
	roomGroup.GET("/:id/image/:name", controllers.GetImageBlob("room"))
}

func setupTenantRoutes(e *echo.Group) {
	tenantGroup := e.Group("/tenant")
	tenantGroup.Use(jwtMiddleware)

	// list tenants
	tenantGroup.GET("", controllers.TenantsList)
	tenantGroup.GET("/", controllers.TenantsList)

	// create tenant
	tenantGroup.POST("", controllers.CreateTenant)
	tenantGroup.POST("/", controllers.CreateTenant)

	// tenant infos
	tenantGroup.GET("/:id", controllers.TenantInfos)

	// update tenant info
	tenantGroup.PUT("/:id", controllers.UpdateTenant)

	// delete tenant
	tenantGroup.DELETE("/:id", controllers.DeleteTenant)

	// get transactions
	tenantGroup.GET("/:id/transactions", controllers.GetTenantTransactions)
}

func setupTransactionRoutes(e *echo.Group) {
	transactionGroup := e.Group("/transaction")
	transactionGroup.Use(jwtMiddleware)

	// list tenants
	transactionGroup.GET("", controllers.TransactionsList)
	transactionGroup.GET("/", controllers.TransactionsList)

	// create tenant
	transactionGroup.POST("", controllers.CreateTransaction)
	transactionGroup.POST("/", controllers.CreateTransaction)

	// tenant infos
	transactionGroup.GET("/:id", controllers.TransactionInfos)

	// update tenant info
	transactionGroup.PUT("/:id", controllers.UpdateTransaction)

	// delete tenant
	transactionGroup.DELETE("/:id", controllers.DeleteTransaction)
}
