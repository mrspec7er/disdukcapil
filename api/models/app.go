package models

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Application struct {
	ID uint `json:"id" gorm:"primaryKey"`
	Name string `json:"name" form:"name" gorm:"index,priority:2; type:varchar(128)"`
	Thumbnail string `json:"thumbnail" form:"thumbnail" gorm:"type:text"`
	Outcomes pq.StringArray `json:"outcomes" form:"outcomes" gorm:"type:text[]"`
	RequirementInfo string `json:"requirementInfo" form:"requirementInfo" gorm:"type:text"`
	CreatedAt time.Time `json:"createdAt" gorm:"index,priority:1"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
	ApplicationForms *[]ApplicationForm `json:"forms"`
	ApplicationServices *[]ApplicationService `json:"services"`
}