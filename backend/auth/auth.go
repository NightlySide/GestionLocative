package auth

import (
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"github.com/nightlyside/gestion-locative/models"
)

const (
	AccessTokenCookieName  = "access-token"
	RefreshTokenCookieName = "refresh-token"
	jwtSecretKey           = "somesecret"
	jwtRefreshSecretKey    = "some-refresh-secret"
)

func GetJWTSecret() string {
	return jwtSecretKey
}

func GetRefresbJWTSecret() string {
	return jwtRefreshSecretKey
}

// Create a struct that will be encoded to a JWT.
// We add jwt.StandardClaims as an embedded type, to provide fields like expiry time.
type Claims struct {
	UserId   string `json:"user_id"`
	UserName string `json:"username"`
	Fullname string `json:"fullname"`
	jwt.StandardClaims
}

func GenerateAccessToken(user *models.User) (string, time.Time, error) {
	expirationTime := time.Now().Add(1 * time.Hour)
	return GenerateToken(user, expirationTime, []byte(GetJWTSecret()))
}

func GenerateRefreshToken(user *models.User) (string, time.Time, error) {
	expirationTime := time.Now().Add(24 * time.Hour)

	return GenerateToken(user, expirationTime, []byte(GetRefresbJWTSecret()))
}

func GenerateToken(user *models.User, expirationTime time.Time, secret []byte) (string, time.Time, error) {
	claims := &Claims{
		UserName: user.Username,
		UserId:   user.Id,
		Fullname: user.Fullname,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS512, claims)
	tokenString, err := token.SignedString(secret)
	if err != nil {
		return "", time.Now(), err
	}

	return tokenString, expirationTime, nil
}

func JWTErrorChecker(err error, c echo.Context) error {
	return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
	//return c.Redirect(http.StatusMovedPermanently, c.Echo().Reverse("userSignInForm"))
}
