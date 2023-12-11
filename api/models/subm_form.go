package models

import (
	"time"

	"gorm.io/gorm"
)

type SubmissionForm struct {
	ID uint `json:"id" gorm:"primaryKey"`
	SubmissionCode string `json:"submissionCode" gorm:"uniqueIndex:idx_form_submission"`
	FormID uint `json:"formId" gorm:"uniqueIndex:idx_form_submission"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
	Submission *Submission `json:"submission" gorm:"foreignKey:SubmissionCode"`
	Form *ApplicationForm `json:"form"`
	Responses *[]FormResponse `json:"responses"`
}