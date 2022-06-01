package controllers

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/labstack/echo/v4"
)

func UploadImageBuilder(imgType string) echo.HandlerFunc {
	return func(c echo.Context) error {
		claims, err := GetClaimsFromContext(c)
		if err != nil {
			return err
		}

		form, err := c.MultipartForm()
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("could not retrieve multipart form data: %s", err.Error()))
		}

		objectId := c.Param("id")
		userId := claims.UserId
		files := form.File["files[]"]

		// check if upload data is correct
		if len(files) == 0 {
			return echo.NewHTTPError(http.StatusBadRequest, "no file found in upload data")
		}

		// create path for files
		userDataDir, err := createUserDataFolder(userId)
		if err != nil {
			return nil
		}

		// files added
		res := []string{}

		for _, file := range files {
			// Source
			src, err := file.Open()
			if err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("could not open file content: %s", err.Error()))
			}
			defer src.Close()

			// Destination
			filename := strings.Join([]string{imgType, objectId, file.Filename}, "_")
			dst, err := os.Create(path.Join(userDataDir, filename))
			if err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("could not create file on disk: %s", err.Error()))
			}

			// copy
			if _, err = io.Copy(dst, src); err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("could not write file on disk: %s", err.Error()))
			}
			res = append(res, file.Filename)
		}

		return c.JSON(http.StatusOK, res)
	}
}

func GetImagesList(imgType string) echo.HandlerFunc {
	return func(c echo.Context) error {
		claims, err := GetClaimsFromContext(c)
		if err != nil {
			return err
		}

		objectId := c.Param("id")
		userId := claims.UserId

		// create path for files
		userDataDir, err := createUserDataFolder(userId)
		if err != nil {
			return nil
		}

		// retrieve images
		res := []string{}
		files, err := ioutil.ReadDir(userDataDir)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("could not read user folder: %s", err.Error()))
		}
		for _, file := range files {
			data := strings.Split(file.Name(), "_")
			if data[0] == imgType && data[1] == objectId {
				filename := strings.Join(data[2:], "_")
				res = append(res, filename)
			}
		}

		return c.JSON(http.StatusOK, res)
	}
}

func GetImageBlob(imgType string) echo.HandlerFunc {
	return func(c echo.Context) error {
		claims, err := GetClaimsFromContext(c)
		if err != nil {
			return err
		}

		objectId := c.Param("id")
		fileName := c.Param("name")

		// create path for files
		userDataDir, err := createUserDataFolder(claims.UserId)
		if err != nil {
			return nil
		}

		pathName := strings.Join([]string{imgType, objectId, fileName}, "_")
		fullPath := path.Join(userDataDir, pathName)
		if _, err := os.Stat(fullPath); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("the file does not exist: %s", err.Error()))
		}

		data, err := ioutil.ReadFile(fullPath)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("cannot read file: %s", err.Error()))
		}

		return c.Blob(http.StatusOK, "image", data)
	}
}

func createUserDataFolder(userId string) (string, error) {
	exePath, err := os.Getwd()
	if err != nil {
		return "", echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("could not retrieve executable path: %s", err.Error()))
	}
	userDataDir := path.Join(exePath, "data", userId)
	err = os.MkdirAll(userDataDir, os.ModePerm)
	if err != nil {
		return "", echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("could not create user data folder: %s", err.Error()))
	}
	return userDataDir, nil
}
