package response

import (
	"errors"

	"github.com/mrspec7er/disdukcapil-api/models"
	"github.com/mrspec7er/disdukcapil-api/modules/application/form"
	"github.com/mrspec7er/disdukcapil-api/utils"
	"gorm.io/gorm"
)

func InsertFormResponseService(req models.SubmissionForm) (*models.SubmissionForm, int, error) {
	subForm := &models.SubmissionForm{SubmissionCode: req.SubmissionCode, FormID: req.FormID, Responses: req.Responses}

	utils.DB.Where(&models.SubmissionForm{SubmissionCode: req.SubmissionCode, FormID: req.FormID}).First(&subForm)
	
	if subForm.ID != 0 {
		utils.DB.Unscoped().Model(subForm).Association("Responses").Unscoped().Clear()
		utils.DB.Unscoped().Delete(subForm)
	}

	submissionEntries := &models.SubmissionForm{SubmissionCode: req.SubmissionCode, FormID: req.FormID, Responses: req.Responses}

	insert := utils.DB.Session(&gorm.Session{FullSaveAssociations: true}).Create(&submissionEntries)
	if insert.Error != nil {
		return nil, 400, insert.Error
	}
	return submissionEntries, 201, nil
}

func UpdateFormResponseService(req models.SubmissionForm) (*models.SubmissionForm, int, error) {
	subForm := &models.SubmissionForm{
		ID: req.ID,
		SubmissionCode: req.SubmissionCode,
		FormID: req.FormID,
		Responses: req.Responses,
	}
	err := utils.DB.Session(&gorm.Session{FullSaveAssociations: true}).Model(&subForm).Updates(&models.SubmissionForm{Responses: req.Responses}).Error
	// err := utils.DB.Session(&gorm.Session{FullSaveAssociations: true}).Save(&subForm).Error
	if err != nil {
		return nil, 400, err
	}

	return subForm, 201, nil
}

func GetMultipleFormResponseService(code string) ([]*models.SubmissionForm, int, error) {
	subForms := []*models.SubmissionForm{}

	err := utils.DB.Where(&models.SubmissionForm{SubmissionCode: code}).Preload("Responses.FormField").Preload("Form").Find(&subForms).Error
	if err != nil {
		return nil, 400, err
	}

	return subForms, 201, nil
}

func RequiredFormGuard(formResponse []models.FormResponse, formId uint) (int, error) {
	form, status, err := form.GetFormService(formId)
	if err != nil {
		return status, err
	}

	if form.RequiredFieldCount > len(formResponse) {
		return 400, errors.New("Make sure all required form fields flled in!")
	}

	
	for _, field := range *form.FormFields {
		if field.IsRequired {
			isFieldHasResponse := false
			for _, response := range formResponse {
				if response.FormFieldID == field.ID && response.Value != "" {
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