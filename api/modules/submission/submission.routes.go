package submission

import (
	"github.com/gin-gonic/gin"
	"github.com/mrspec7er/disdukcapil-api/middlewares"
)

func Routes(router *gin.Engine)  {
	routerGroup := router.Group("/api/v1/submissions")
	{
		routerGroup.PUT("/", middlewares.Authorize([]string{"USER"}), UpsertSubmission)
		routerGroup.GET("/", middlewares.Authorize([]string{"ADMIN", "STAFF"}), GetMultipleSubmission)
		routerGroup.GET("/user", middlewares.Authorize([]string{"USER", "ADMIN", "STAFF"}), GetUserSubmission)
		routerGroup.GET("/user/:code", middlewares.Authorize([]string{"USER", "ADMIN", "STAFF"}), GetUserSubmissionDetail)
		routerGroup.DELETE("/user/:code", middlewares.Authorize([]string{"USER"}), DeleteSubmission)
	}
}