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

func main() {
	user := &models.User{
		Name: "Admin User",
		Email: "admin@email.com",
		Password: "$2a$11$ERvcC3s/EgdKj4Q6TM39G.ex5lpWj9EvAnkunTuscDwTR2c8Ha1xK",
		Nik: "51020212345670",
		Phone: "081945795745",
		PlaceOfBirth: "Denpasar",
		DateOfBirth: "27-08-27",
		Role: "ADMIN",
		Status: "ACTIVE",
	}
	err := utils.DB.Create(&user).Error
	if err != nil {
		fmt.Println(err.Error())
	}

	fmt.Println("Successfully seed admin user!")
}