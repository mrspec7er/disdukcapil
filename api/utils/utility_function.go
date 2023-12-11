package utils

import (
	"github.com/gin-gonic/gin"
	"github.com/mrspec7er/disdukcapil-api/models"
)

func GetUserFromContext(c *gin.Context) *models.User {
	userPayload, userStatus := c.Get("user")
	if !userStatus {
		c.IndentedJSON(400, ApiResponse{Message: "Failed to authorize user!"})
		return nil
	}

	user := userPayload.(models.User); 

	return &user
}