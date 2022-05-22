package models

type Room struct {
	Id         string  `json:"id"`
	PropertyId string  `json:"property_id" validate:"required"`
	Image      string  `json:"image"`
	Rent       float32 `json:"rent"`
	Charges    float32 `json:"charges"`
	Caution    float32 `json:"caution"`
	Surface    float32 `json:"surface"`
}
