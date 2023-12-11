package models

import (
	"time"

	"gorm.io/gorm"
)

type FileResponse struct {
	ID uint `json:"id" gorm:"primaryKey"`
	SubmissionServiceID uint `json:"submissionServiceId" form:"submissionServiceId" gorm:"uniqueIndex:idx_file_response"`
	ServiceFileID uint `json:"serviceFileId" form:"serviceFileId" gorm:"uniqueIndex:idx_file_response"`
	Value string `json:"value" gorm:"type:text" form:"value"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
	SubmissionService *SubmissionService `json:"submissionService"`
	ServiceFile *ServiceFile `json:"serviceFile"`
}