package models

import (
	"time"

	"gorm.io/gorm"
)

type ApplicationForm struct {
	ID uint `json:"id" gorm:"primaryKey"`
	Name string `json:"name" gorm:"type:varchar(128)"`
	RequiredFieldCount int `json:"requiredFieldCount" gorm:"type:int"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
	ApplicationID uint `json:"applicationId"`
	Application *Application `json:"application"`
	FormFields *[]FormField `json:"fields"`
}