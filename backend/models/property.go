package models

type Property struct {
	Id         string  `json:"id"`
	LandlordId string  `json:"landlord_id" validate:"required"`
	Address    string  `json:"address" validate:"required"`
	LotNumber  string  `json:"lot_number"`
	Floor      string  `json:"floor"`
	Image      string  `json:"image"`
	Type       string  `json:"type" validate:"required"`
	Surface    float32 `json:"surface"`
}
