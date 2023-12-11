package file

import (
	"errors"
	"fmt"
	"os"

	"github.com/mrspec7er/disdukcapil-api/models"
	"github.com/mrspec7er/disdukcapil-api/modules/application/service"
	"github.com/mrspec7er/disdukcapil-api/modules/submission"
	"github.com/mrspec7er/disdukcapil-api/utils"
	"gorm.io/gorm"
)

func InsertFormResponseService(req InsertSubmissionType, fileUrl string) (*models.SubmissionService, int, error) {
	subServ := &models.SubmissionService{SubmissionCode: req.SubmissionCode, ServiceID: req.ServiceFormId}

	utils.DB.Where(&models.SubmissionService{SubmissionCode: req.SubmissionCode, ServiceID: req.ServiceFormId}).First(&subServ)
	
	if subServ.ID != 0 {
		fileRes := &models.FileResponse{}
		utils.DB.Where(&models.FileResponse{ServiceFileID: req.ServiceFieldId, SubmissionServiceID: subServ.ID}).First(&fileRes)
		if fileRes.ID != 0 {
			if fileRes.Value != "" {
				err := os.Remove("." + fileRes.Value)
				if err != nil {
					fmt.Println(err)
				}
			}

			fileRes.Value = fileUrl
			err := utils.DB.Session(&gorm.Session{FullSaveAssociations: true}).Save(&fileRes).Error
			if err != nil {
				return nil, 400, err
			}

			return subServ, 201, nil
		}

		err := utils.DB.Create(&models.FileResponse{SubmissionService: subServ, ServiceFileID: req.ServiceFieldId, Value: fileUrl}).Error
		if err != nil {
			return nil, 400, err
		}
		return subServ, 201, nil
	}

	submissionFileEntries := &models.SubmissionService{SubmissionCode: req.SubmissionCode, ServiceID: req.ServiceFormId, Responses: &[]models.FileResponse{{ServiceFileID: req.ServiceFieldId, Value: fileUrl}}}

	insert := utils.DB.Session(&gorm.Session{FullSaveAssociations: true}).Create(&submissionFileEntries)
	if insert.Error != nil {
		return nil, 400, insert.Error
	}
	return submissionFileEntries, 201, nil
}

func SubmitFileResponseService(submissionCode string, serviceFromId uint) (int, error) {
	submissionServices := []*models.SubmissionService{}

	err := utils.DB.Where(&models.SubmissionService{SubmissionCode: submissionCode}).Find(&submissionServices).Error
	if err != nil {
		return 500, err
	}

	for _, subServ := range submissionServices {
		fmt.Println("SUBMISSION_SERVICE", subServ.SubmissionCode, subServ.ServiceID)
		if subServ.ServiceID != serviceFromId {
			err := utils.DB.Delete(&subServ).Error
			if err != nil {
				return 500, err
			}
		}
	}

	status, err := submission.UpdateSubmissionStatus(submissionCode, "SUBMITTED")
	if err != nil {
		return status, err
	}

	return 201, nil
}

func RequiredFileGuard(submissionCode string, serviceId uint) (int, error) {
	fileForm, status, err := service.GetServService(serviceId)
	if err != nil {
		return status, err
	}

	fileResponse := &models.SubmissionService{}

	err = utils.DB.Where(&models.SubmissionService{SubmissionCode: submissionCode, ServiceID: serviceId}).Preload("Responses").First(&fileResponse).Error
	if err != nil {
		return 400, err
	}

	fmt.Println("FILE_FORM", fileForm)
	fmt.Println("FILE_FORM", fileResponse)



	if fileForm.RequiredFieldCount > len(*fileResponse.Responses) {
		return 400, errors.New("Make sure all required form fields flled in!")
	}
	
	for _, field := range *fileForm.ServiceFiles {
		if field.IsRequired {
			isFieldHasResponse := false
			for _, response := range *fileResponse.Responses {
				if response.ServiceFileID == field.ID && response.Value != "" {
					isFieldHasResponse = true
				}
			}

			if !isFieldHasResponse {
				return 400, errors.New(field.Name + " is required!")
			}
		}
	}

	return 200, nil
}