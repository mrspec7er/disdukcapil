package form

import (
	"github.com/mrspec7er/disdukcapil-api/models"
	"github.com/mrspec7er/disdukcapil-api/utils"
	"gorm.io/gorm"
)

// func CreateFormService(req models.ApplicationForm) (*models.ApplicationForm, int, error) {
// 	var requiredFieldCount int

// 	for _, field := range *req.FormFields {
// 		if field.IsRequired {
// 			requiredFieldCount++
// 		}
// 	}

// 	form := &models.ApplicationForm{
// 		ApplicationID: req.ApplicationID,
// 		Name: req.Name,
// 		FormFields: req.FormFields,
// 		RequiredFieldCount: requiredFieldCount,
// 	}
// 	err := utils.DB.Create(&form).Error
// 	if err != nil {
// 		return nil, 400, err
// 	}

// 	return form, 201, nil
// }

func UpsertFormService(req models.ApplicationForm) (*models.ApplicationForm, int, error) {
	var requiredFieldCount int

	for _, field := range *req.FormFields {
		if field.IsRequired {
			requiredFieldCount++
		}
	}

	form := &models.ApplicationForm{
		ID: req.ID,
		ApplicationID: req.ApplicationID,
		Name: req.Name,
		FormFields: req.FormFields,
		RequiredFieldCount: requiredFieldCount,
	}

	err := utils.DB.Session(&gorm.Session{FullSaveAssociations: true}).Save(&form).Error
	if err != nil {
		return nil, 400, err
	}

	return form, 201, nil
}

func GetMultipleFormService() ([]*models.ApplicationForm, int, error) {
	forms := []*models.ApplicationForm{}

	err := utils.DB.Preload("FormFields").Find(&forms).Error
	if err != nil {
		return nil, 400, err
	}

	return forms, 201, nil
}

func GetFormService(id uint) (*models.ApplicationForm, int, error) {
	form := &models.ApplicationForm{ID: id}

	err := utils.DB.Preload("FormFields").First(&form).Error
	if err != nil {
		return nil, 400, err
	}

	return form, 201, nil
}

func DeleteFormService(id uint) (*models.ApplicationForm, int, error) {

	form := &models.ApplicationForm{ID: id}
	err := utils.DB.Delete(&form).Error
	if err != nil {
		return nil, 400, err
	}

	return form, 201, nil
}

func DeleteFieldService(id uint) (*models.FormField, int, error) {

	field := &models.FormField{ID: id}
	err := utils.DB.Delete(&field).Error
	if err != nil {
		return nil, 400, err
	}

	return field, 201, nil
}