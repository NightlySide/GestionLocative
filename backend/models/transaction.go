package models

import "time"

type Transaction struct {
	Id          string    `json:"id"`
	Amount      float32   `json:"amount" validate:"required"`
	TenantId    string    `json:"tenant_id" validate:"required"`
	LandlordId  string    `json:"landlord_id" validate:"required"`
	Description string    `json:"description"`
	Type        string    `json:"type" validate:"required"`
	Date        time.Time `json:"date"`
}
