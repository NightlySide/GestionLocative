package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/go-playground/validator"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/nightlyside/gestion-locative/auth"
	"github.com/nightlyside/gestion-locative/database"
	"github.com/nightlyside/gestion-locative/models"
	"golang.org/x/crypto/bcrypt"
)

type LoginData struct {
	Name     string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type LoginResponse struct {
	AccessToken  string `json:"access-token"`
	RefreshToken string `json:"refresh-token"`
}

func Login(c echo.Context) error {
	u := new(LoginData)
	valid := validator.New()
	db := database.DB

	// validate data
	err := c.Bind(u)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	err = valid.Struct(u)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	// checks if user existzs
	var exists bool
	err = db.Model(&models.User{}).Select("count(*) > 0").Where("username = ?", u.Name).Find(&exists).Error
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	if !exists {
		return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("User '%s' don't exist", u.Name))
	}
	var dbUser models.User
	db.First(&dbUser, "username = ?", u.Name)
	err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(u.Password))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Wrong login/password combination")
	}

	// generate token
	tkn, _, err := auth.GenerateAccessToken(&dbUser)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	reftkn, refreshExp, err := auth.GenerateRefreshToken(&dbUser)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	// set has-tokens and refresh-token in the user cookies
	hasTokensCookie := new(http.Cookie)
	hasTokensCookie.Name = "has-tokens"
	hasTokensCookie.Value = "true"
	hasTokensCookie.Expires = refreshExp
	hasTokensCookie.Path = "/"
	hasTokensCookie.Secure = true
	hasTokensCookie.SameSite = http.SameSiteStrictMode
	c.SetCookie(hasTokensCookie)

	refreshTokenCookie := new(http.Cookie)
	refreshTokenCookie.Name = "refresh-token"
	refreshTokenCookie.Value = reftkn
	refreshTokenCookie.Expires = refreshExp
	refreshTokenCookie.Path = "/"
	refreshTokenCookie.HttpOnly = true
	refreshTokenCookie.Secure = true
	refreshTokenCookie.SameSite = http.SameSiteStrictMode
	c.SetCookie((refreshTokenCookie))

	return c.JSON(http.StatusOK, &LoginResponse{
		AccessToken:  tkn,
		RefreshToken: reftkn,
	})
}

func Register(c echo.Context) error {
	u := new(models.User)
	valid := validator.New()

	// validate data
	err := c.Bind(u)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	err = valid.Struct(u)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	db := database.DB
	// check if user with name exists
	var exists bool
	err = db.Model(&models.User{}).
		Select("count(*) > 0").
		Where("username = ?", u.Username).
		Find(&exists).
		Error
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	if exists {
		return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("User '%s' already exists", u.Username))
	}

	err = db.Model(&models.User{}).
		Select("count(*) > 0").
		Where("email = ?", u.Email).
		Find(&exists).
		Error
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	if exists {
		return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Email address '%s' is already in use", u.Email))
	}

	// else create the user
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), 8)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	u.Password = string(hashedPassword)
	u.Id = uuid.NewString()
	u.CreationDate = time.Now()

	db.Create(&u)

	return c.JSON(http.StatusCreated, &u)
}

type HealthCheckResult struct {
	IsTokenValid bool   `json:"is_token_valid"`
	Reason       string `json:"reason,omitempty"`
}

func NewHealthCheckResult(isValid bool, reason string) *HealthCheckResult {
	return &HealthCheckResult{IsTokenValid: isValid, Reason: reason}
}

// HealthCheck checks whether a user is logged in
func HealthCheck(c echo.Context) error {
	accessToken := c.Request().Header.Get("AccessToken")
	if accessToken == "" {
		return c.JSON(http.StatusOK, NewHealthCheckResult(false, "Not logged in"))
	}

	tkn, err := jwt.ParseWithClaims(accessToken, &auth.Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(auth.GetJWTSecret()), nil
	})
	if err != nil {
		return c.JSON(http.StatusOK, NewHealthCheckResult(false, "Cannot parse JWT token (structure may have changed)"))
	}

	if !tkn.Valid {
		return c.JSON(http.StatusOK, NewHealthCheckResult(false, "Token is not valid"))
	}

	return c.JSON(http.StatusOK, NewHealthCheckResult(true, "Logged In"))
}

type RefreshTokenResp struct {
	AccessToken string `json:"access-token"`
}

func RefreshToken(c echo.Context) error {
	rc, err := c.Cookie("refresh-token")
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "No refresh-token in cookie")
	}

	tkn, err := jwt.ParseWithClaims(rc.Value, &auth.Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(auth.GetRefresbJWTSecret()), nil
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("Cannot parse token: %s", rc.Value))
	}

	if !tkn.Valid {
		return echo.NewHTTPError(http.StatusBadRequest, "Token invalid")
	}

	claims := tkn.Claims.(*auth.Claims)
	db := database.DB
	var user models.User
	err = db.Where("id = ?", claims.UserId).First(&user).Error
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "User not found")
	}

	accessToken, _, err := auth.GenerateAccessToken(&user)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, RefreshTokenResp{AccessToken: accessToken})
}
