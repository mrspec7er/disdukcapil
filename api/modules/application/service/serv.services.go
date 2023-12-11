package service

import (
	"github.com/mrspec7er/disdukcapil-api/models"
	"github.com/mrspec7er/disdukcapil-api/utils"
	"gorm.io/gorm"
)

func UpsertServService(req models.ApplicationService) (*models.ApplicationService, int, error) {
	var requiredFileCount int

	for _, file := range *req.ServiceFiles {
		if file.IsRequired {
			requiredFileCount++
		}
	}

	service := &models.ApplicationService{
		ID: req.ID,
		ApplicationID: req.ApplicationID,
		Name: req.Name,
		StepsInfo: req.StepsInfo,
		ServiceFiles: req.ServiceFiles,
		RequiredFieldCount: requiredFileCount,
	}

	err := utils.DB.Session(&gorm.Session{FullSaveAssociations: true}).Save(&service).Error
	if err != nil {
		return nil, 400, err
	}

	return service, 201, nil
}

func GetMultipleServService() ([]*models.ApplicationService, int, error) {
	services := []*models.ApplicationService{}

	err := utils.DB.Preload("ServiceFiles").Find(&services).Error
	if err != nil {
		return nil, 400, err
	}

	return services, 201, nil
}

func GetServService(id uint) (*models.ApplicationService, int, error) {
	service := &models.ApplicationService{ID: id}

	err := utils.DB.Preload("ServiceFiles").First(&service).Error
	if err != nil {
		return nil, 400, err
	}

	return service, 201, nil
}

func DeleteServService(id uint) (*models.ApplicationService, int, error) {

	service := &models.ApplicationService{ID: id}
	err := utils.DB.Delete(&service).Error
	if err != nil {
		return nil, 400, err
	}

	return service, 201, nil
}

func DeleteFileService(id uint) (*models.ServiceFile, int, error) {

	file := &models.ServiceFile{ID: id}
	err := utils.DB.Delete(&file).Error
	if err != nil {
		return nil, 400, err
	}

	return file, 201, nil
}