package models

import "time"

type User struct {
	Id           string    `json:"id"`
	Username     string    `json:"username" validate:"required"`
	Fullname     string    `json:"fullname" validate:"required"`
	Email        string    `json:"email" validate:"required"`
	Password     string    `json:"password,omitempty" validate:"required"`
	CreationDate time.Time `json:"creation_date"`
	Siren        string    `json:"siren"`
}
