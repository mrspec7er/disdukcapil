package file

import (
	"github.com/gin-gonic/gin"
	"github.com/mrspec7er/disdukcapil-api/middlewares"
)

func Routes(router *gin.Engine)  {
	routerGroup := router.Group("/api/v1/file-responses")
	{
		routerGroup.PUT("/", middlewares.Authorize([]string{"ADMIN", "STAFF", "USER"}), UpsertSubmissionFile)
		routerGroup.POST("/", middlewares.Authorize([]string{"ADMIN", "STAFF", "USER"}), SubmitFileResponse)
	}
}