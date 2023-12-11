package modules

import (
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/mrspec7er/disdukcapil-api/modules/application"
	"github.com/mrspec7er/disdukcapil-api/modules/application/form"
	"github.com/mrspec7er/disdukcapil-api/modules/application/service"
	"github.com/mrspec7er/disdukcapil-api/modules/submission"
	"github.com/mrspec7er/disdukcapil-api/modules/submission/file"
	"github.com/mrspec7er/disdukcapil-api/modules/submission/response"
	"github.com/mrspec7er/disdukcapil-api/modules/user"
)

func Router() {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("FRONTEND_URL")},
		AllowMethods:     []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
		AllowHeaders:     []string{"Content-Type", "Access-Control-Allow-Headers", "X-Requested-With", "Access-Control-Request-Method", "Access-Control-Request-Headers"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
		AllowWildcard: true,
		AllowFiles: true,
	}))
	router.GET("/", func(c *gin.Context) {
		c.IndentedJSON(200, gin.H{"message": "Hello There!"})
	})
	router.Static("/assets", "./assets")

	user.Routes(router)
	application.Routes(router)
	form.Routes(router)
	service.Routes(router)
	submission.Routes(router)
	response.Routes(router)
	file.Routes(router)

	err := router.Run(os.Getenv("PORT"))

	if err != nil {
		panic(err.Error())
	}
}