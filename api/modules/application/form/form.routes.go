package form

import (
	"github.com/gin-gonic/gin"
	"github.com/mrspec7er/disdukcapil-api/middlewares"
)

func Routes(router *gin.Engine)  {
	routerGroup := router.Group("/api/v1/forms")
	{
		routerGroup.PUT("/", middlewares.Authorize([]string{"ADMIN"}), UpsertApplicationForm)
		routerGroup.GET("/", middlewares.Authorize([]string{"ADMIN", "USER", "STAFF"}), GetMultipleApplicationForm)
		routerGroup.GET("/:id", middlewares.Authorize([]string{"ADMIN", "USER", "STAFF"}), GetFormById)
		routerGroup.DELETE("/:id", middlewares.Authorize([]string{"ADMIN"}), DeleteForm)
		routerGroup.DELETE("/fields/:id", middlewares.Authorize([]string{"ADMIN"}), DeleteField)
	}
}