package models

import (
	"time"

	"gorm.io/gorm"
)

type Submission struct {
	Code string `json:"code" gorm:"primaryKey;index,priority:1"`
	ApplicationID uint `json:"applicationId"`
	UserID uint `json:"userId"`
	Status string `json:"status" gorm:"type:varchar(32); index,priority:2"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"index,priority:2"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
	Application *Application `json:"application"`
	SubmissionForms *[]SubmissionForm `json:"submissionForms"`
	SubmissionServices *[]SubmissionService `json:"submissionServices"`
	User *User `json:"user"`
}