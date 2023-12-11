package main

import (
	"fmt"

	"github.com/joho/godotenv"
	"github.com/mrspec7er/disdukcapil-api/models"
	"github.com/mrspec7er/disdukcapil-api/utils"
)

func init()  {
	err := godotenv.Load()
	if err != nil {
		panic(err.Error())
	}

	utils.InitDB()
}


func main()  {
	dbCon := utils.DB
	dbCon.AutoMigrate(
		&models.User{}, 
		&models.Application{}, 
		&models.ApplicationForm{},
		&models.FormField{}, 
		&models.ApplicationService{}, 
		&models.ServiceFile{}, 
		&models.Submission{}, 
		&models.SubmissionForm{}, 
		&models.FormResponse{}, 
		&models.SubmissionService{},
		&models.FileResponse{},
	)
	
	fmt.Println("Successfully migrating model to: ", dbCon.Name())
}