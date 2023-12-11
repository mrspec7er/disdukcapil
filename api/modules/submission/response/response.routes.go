package response

import (
	"github.com/gin-gonic/gin"
	"github.com/mrspec7er/disdukcapil-api/middlewares"
)

func Routes(router *gin.Engine)  {
	routerGroup := router.Group("/api/v1/responses")
	{
		routerGroup.POST("/", middlewares.Authorize([]string{"ADMIN", "STAFF", "USER"}), InsertFormResponse)
		routerGroup.PUT("/", middlewares.Authorize([]string{"ADMIN", "STAFF", "USER"}), UpdateFormResponse)
		routerGroup.GET("/", middlewares.Authorize([]string{"ADMIN", "STAFF", "USER"}), GetMultipleFormResponse)
	}
}