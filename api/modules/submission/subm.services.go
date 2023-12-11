package submission

import (
	"errors"
	"math/rand"
	"strconv"
	"strings"
	"time"

	"github.com/mrspec7er/disdukcapil-api/models"
	"github.com/mrspec7er/disdukcapil-api/utils"
)

func UpsertSubmissionService(req models.Submission, user *models.User) (*models.Submission, int, error) {
	var submissionCode string

	if req.Code == "" {
		submissionCode = "BNGL-" + strconv.Itoa(int(time.Now().Unix()) + rand.Intn(1000000))
	}
	if req.Code != "" {
		submissionCode = req.Code
	}

	sub := &models.Submission{
		Code: submissionCode,
		ApplicationID: req.ApplicationID,
		User: user,
		Status: "CREATED",
	}
	err := utils.DB.Save(&sub).Error
	if err != nil {
		return nil, 400, err
	}

	return sub, 201, nil
}

func GetMultipleSubmissionService(page int, limit int, appId string, userName string) ([]*models.Submission, *int64, int, error) {
	subs := []*models.Submission{}
	var count int64

	query := utils.DB.Limit(limit).Offset((page - 1) * limit)

	if appId != "0" {
		query = query.Where("application_id = ?", appId)
	}

	if userName != "" {
		query = query.Joins("JOIN users ON users.id=user_id").Where("LOWER(name) LIKE ?", "%"+strings.ToLower(userName)+"%")
	}

	// err := utils.DB.Limit(limit).Offset((page - 1) * limit).Where("application_id = ? AND age >= ?", "jinzhu", "22").Preload("Application").Preload("User").Order("updated_at desc").Find(&subs).Offset(-1).Count(&count).Error
	err := query.Preload("User").Preload("Application").Order("updated_at desc").Find(&subs).Offset(-1).Count(&count).Error
	if err != nil {
		return nil, nil, 400, err
	}

	return subs, &count, 200, nil
}

func GetUserSubmissionService(page int, limit int, userId uint, status string) ([]*models.Submission, *int64, int, error) {
	subs := []*models.Submission{}
	var count int64

	query := utils.DB.Limit(limit).Offset((page - 1) * limit).Where("user_id = ?", userId)

	if status != "" {
		query = query.Where("status = ?", status)
	}

	err := query.Preload("Application").Order("updated_at desc").Preload("User").Find(&subs).Offset(-1).Count(&count).Error
	if err != nil {
		return nil, nil, 400, err
	}

	return subs, &count, 200, nil
}

func GetUserSubmissionDetailService(code string, userId uint) (*models.Submission, int, error) {
	subs := &models.Submission{Code: code, UserID: userId}
	err := utils.DB.Preload("Application").Preload("SubmissionForms.Form").Preload("SubmissionForms.Responses.FormField").Preload("SubmissionServices.Service").Preload("SubmissionServices.Responses.ServiceFile").Preload("User").First(&subs).Error
	if err != nil {
		return nil, 400, err
	}

	return subs, 200, nil
}

func UpdateSubmissionStatus(submissionCode string, status string) (int, error) {
	err := utils.DB.Model(&models.Submission{Code: submissionCode}).Update("status", status).Error
	if err != nil {
		return 400, err
	}

	return 201, nil
}

func DeleteSubmissionService(submissionCode string) (*models.Submission, int, error) {

	submission := &models.Submission{Code: submissionCode}
	err := utils.DB.Delete(&submission).Error
	if err != nil {
		return nil, 400, err
	}

	return submission, 201, nil
}

func SubmissionGuard(code string, userId uint) error {

	if code == "" {
		return nil
	}

	subs := &models.Submission{Code: code}

	err := utils.DB.First(&subs).Error
	if err != nil {
		return err
	}

	if subs.UserID != userId {
		return errors.New("User not allowed to update the submission!")
	}
	
	return nil
}