package models

import (
	"time"

	"gorm.io/gorm"
)

type SubmissionService struct {
	ID uint `json:"id" gorm:"primaryKey" form:"id"`
	SubmissionCode string `json:"submissionCode" gorm:"uniqueIndex:idx_file_submission" form:"submissionCode"`
	ServiceID uint `json:"serviceId" gorm:"uniqueIndex:idx_file_submission" form:"serviceId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
	Submission *Submission `json:"submission" gorm:"foreignKey:SubmissionCode"`
	Service *ApplicationService `json:"service"`
	Responses *[]FileResponse `json:"responses"`
}