package models

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type FormField struct {
	ID uint `json:"id" gorm:"primaryKey"`
	Name string `json:"name" gorm:"type:varchar(128)"`
	Type string `json:"type" gorm:"type:varchar(128)"`
	Options pq.StringArray `json:"options" gorm:"type:text[]"`
	IsRequired bool `json:"isRequired"`
	Order int `json:"order" gorm:"type:int; index,priority:1"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
	ApplicationFormID uint `json:"applicationFormId"`
	ApplicationForm *ApplicationForm `json:"form"`
}