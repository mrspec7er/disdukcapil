package application

import (
	"github.com/gin-gonic/gin"
	"github.com/mrspec7er/disdukcapil-api/middlewares"
)

func Routes(router *gin.Engine)  {
	routerGroup := router.Group("/api/v1/applications")
	{
		routerGroup.PUT("/", middlewares.Authorize([]string{"ADMIN"}), UpsertApplication)
		routerGroup.POST("/thumbnails", middlewares.Authorize([]string{"ADMIN"}), UpdateThumbnail)
		routerGroup.GET("/", GetMultipleApplication)
		routerGroup.GET("/:id", GetApplicationById)
		routerGroup.DELETE("/:id", middlewares.Authorize([]string{"ADMIN"}), DeleteApplication)
	}
}