package models

import (
	"time"

	"gorm.io/gorm"
)

type ApplicationService struct {
	ID uint `json:"id" gorm:"primaryKey"`
	Name string `json:"name" gorm:"type:varchar(128)"`
	RequiredFieldCount int `json:"requiredFieldCount" gorm:"type:int"`
	StepsInfo string `json:"stepsInfo" gorm:"type:text"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
	ApplicationID uint `json:"applicationId"`
	Application *Application `json:"application"`
	ServiceFiles *[]ServiceFile `json:"files"`
}