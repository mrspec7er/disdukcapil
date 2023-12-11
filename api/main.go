package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/mrspec7er/disdukcapil-api/modules"
	"github.com/mrspec7er/disdukcapil-api/utils"
)

func init()  {
	err := godotenv.Load()
	if err != nil {
		panic(err.Error())
	}
	gin.SetMode(os.Getenv("GIN_MODE"))
}

func main()  {
	utils.InitDB()
	modules.Router()
}