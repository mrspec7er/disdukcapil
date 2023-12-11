package application

import (
	"fmt"
	"os"

	"github.com/mrspec7er/disdukcapil-api/models"
	"github.com/mrspec7er/disdukcapil-api/utils"
)

// func CreateApplicationService(req models.Application) (*models.Application, int, error) {
// 	app := &models.Application{
// 		Name: req.Name,
// 		Thumbnail: req.Thumbnail,
// 		Outcomes: req.Outcomes,
// 		RequirementInfo: req.RequirementInfo,
// 	}
// 	err := utils.DB.Create(&app).Error
// 	if err != nil {
// 		return nil, 400, err
// 	}

// 	return app, 201, nil
// }

func UpsertApplicationService(req models.Application) (*models.Application, int, error) {
	app := &models.Application{
		ID: req.ID,
		Name: req.Name,
		Thumbnail: req.Thumbnail,
		Outcomes: req.Outcomes,
		RequirementInfo: req.RequirementInfo,
	}
	err := utils.DB.Save(&app).Error
	if err != nil {
		return nil, 400, err
	}

	return app, 201, nil
}

func UpdateThumbnailService(id uint, thumbnailUrl string) (*models.Application, int, error) {
	app := &models.Application{ID: id}

	err := utils.DB.First(&app).Error
	if err != nil {
		return nil, 400, err
	}

	if app.Thumbnail != "" {
		err := os.Remove("." + app.Thumbnail)
		if err != nil {
			fmt.Println(err)
		}
	}

	app.Thumbnail = thumbnailUrl

	err = utils.DB.Save(app).Error
	if err != nil {
		return nil, 400, err
	}

	return app, 201, nil
}

func GetMultipleApplicationService(page int, limit int) ([]*models.Application, *int64, int, error) {
	apps := []*models.Application{}
	var count int64

	err := utils.DB.Limit(limit).Offset((page - 1) * limit).Find(&apps).Offset(-1).Count(&count).Error
	if err != nil {
		return nil, nil, 400, err
	}

	return apps, &count, 200, nil
}

func GetApplicationService(id uint) (*models.Application, int, error) {
	app := &models.Application{ID: id}

	err := utils.DB.Preload("ApplicationForms.FormFields").Preload("ApplicationServices.ServiceFiles").First(&app).Error
	if err != nil {
		return nil, 400, err
	}

	return app, 200, nil
}

func DeleteApplicationService(id uint) (*models.Application, int, error) {

	app := &models.Application{ID: id}
	err := utils.DB.Delete(&app).Error
	if err != nil {
		return nil, 400, err
	}

	return app, 201, nil
}