package main

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)


func createDatabase() {
    dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s sslmode=disable TimeZone=%s", os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_TIMEZONE"))
    DB, _ := gorm.Open(postgres.Open(dsn), &gorm.Config{})

    createDatabaseCommand := fmt.Sprintf("CREATE DATABASE %s", os.Getenv("DB_NAME"))
    DB.Exec(createDatabaseCommand)

	fmt.Println("successfully created database: ", DB.Name())
}

func init()  {
	err := godotenv.Load()
	if err != nil {
		panic(err.Error())
	}
}
 
func main() {
    createDatabase()
}