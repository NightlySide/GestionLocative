package models

import "time"

type Tenant struct {
	Id            string    `json:"id"`
	RoomId        string    `json:"room_id" validate:"required"`
	Fullname      string    `json:"fullname" validate:"required"`
	FormerAddress string    `json:"former_address"`
	NextAddress   string    `json:"next_address"`
	Comments      string    `json:"comments"`
	EntryDate     time.Time `json:"entry_date"`
	LeaveDate     time.Time `json:"leave_date"`
	Guarantor     string    `json:"guarantor"`
	Email         string    `json:"email"`
	Tel           string    `json:"tel"`
}
