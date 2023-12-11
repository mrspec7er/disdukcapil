package user

import (
	"github.com/gin-gonic/gin"
	"github.com/mrspec7er/disdukcapil-api/middlewares"
)

func Routes(router *gin.Engine)  {
	routerGroup := router.Group("/api/v1/auth")
	{
		routerGroup.POST("/register", Register)
		routerGroup.POST("/login", Login)
		routerGroup.POST("/password-token", GeneratePasswordToken)
		routerGroup.PUT("/password", UpdatePassword)
		routerGroup.GET("/whoami", middlewares.Authorize([]string{"ADMIN", "USER", "STAFF"}), Whoami)
	}
}