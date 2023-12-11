package models

import (
	"time"

	"gorm.io/gorm"
)

type FormResponse struct {
	ID uint `json:"id" gorm:"primaryKey"`
	SubmissionFormID uint `json:"submissionFormId" gorm:"uniqueIndex:idx_form_response"`
	FormFieldID uint `json:"formFieldId" gorm:"uniqueIndex:idx_form_response"`
	Value string `json:"value" gorm:"type:text"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
	SubmissionForm *SubmissionForm `json:"submissionForm"`
	FormField *FormField `json:"formField"`
}