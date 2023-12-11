package utils

type Metadata struct {
	Page int `json:"page"`
	Limit int `json:"limit"`
	Count int64 `json:"count"`
}
type ApiResponse struct {
	Message string      `json:"message,omitempty"`
    Data    interface{} `json:"data"`
	Metadata	Metadata `json:"metadata"`
}