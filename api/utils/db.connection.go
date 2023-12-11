package utils

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	credentials := fmt.Sprintf("host=%s port=%s dbname=%s user=%s password=%s sslmode=disable TimeZone=%s", os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_NAME"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_TIMEZONE"))

	connection, err := gorm.Open(postgres.Open(credentials), &gorm.Config{})
	if err != nil {
		panic(err.Error())
	}

	DB = connection
}