package service

import (
	"github.com/gin-gonic/gin"
	"github.com/mrspec7er/disdukcapil-api/middlewares"
)

func Routes(router *gin.Engine)  {
	routerGroup := router.Group("/api/v1/services")
	{
		routerGroup.PUT("/", middlewares.Authorize([]string{"ADMIN"}), UpsertApplicationServ)
		routerGroup.GET("/", middlewares.Authorize([]string{"ADMIN", "USER", "STAFF"}), GetMultipleApplicationServ)
		routerGroup.GET("/:id", middlewares.Authorize([]string{"ADMIN", "USER", "STAFF"}), GetServiceById)
		routerGroup.DELETE("/:id", middlewares.Authorize([]string{"ADMIN"}), DeleteServ)
		routerGroup.DELETE("/files/:id", middlewares.Authorize([]string{"ADMIN"}), DeleteFile)
	}	
}