package models

import (
	"time"

	"gorm.io/gorm"
)

type ServiceFile struct {
	ID uint `json:"id" gorm:"primaryKey"`
	Name string `json:"name" gorm:"type:varchar(128)"`
	IsRequired bool `json:"isRequired"`
	Order int `json:"order" gorm:"type:int; index,priority:1"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
	ApplicationServiceID uint `json:"applicationServiceId"`
	ApplicationService *ApplicationService `json:"service"`
}