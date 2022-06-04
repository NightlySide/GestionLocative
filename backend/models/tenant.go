package models

type Tenant struct {
	Id            string `json:"id"`
	RoomId        string `json:"room_id" validate:"required"`
	Fullname      string `json:"fullname" validate:"required"`
	Email         string `json:"email"`
	Tel           string `json:"tel"`
	Image         string `json:"image"`
	FormerAddress string `json:"former_address"`
	NextAddress   string `json:"next_address"`
	Comments      string `json:"comments"`
	EntryDate     string `json:"entry_date"`
	LeaveDate     string `json:"leave_date"`
	Guarantor     string `json:"guarantor"`
}
