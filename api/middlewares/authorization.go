package middlewares

import (
	"errors"
	"os"
	"slices"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/mrspec7er/disdukcapil-api/models"
	"github.com/mrspec7er/disdukcapil-api/utils"
)

func Authorize(roles []string) gin.HandlerFunc {
	return func (c *gin.Context)  {

		token, err := c.Cookie("Authorization");
		if err != nil {
			c.AbortWithStatusJSON(403, utils.ApiResponse{Message: err.Error()})
			return
		}
	
		payload, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
			_, ok := t.Method.(*jwt.SigningMethodHMAC)
			if !ok {
				return nil, errors.New("Failed to parse JWT token!")
			}
			return []byte(os.Getenv("AUTH_SECRET")), nil
		})
	
		if err != nil {
			c.AbortWithStatusJSON(403, utils.ApiResponse{Message: err.Error()})
			return
		}
	
		claims, ok := payload.Claims.(jwt.MapClaims)
		if ok && payload.Valid {
			user := models.User{}
	
			err := utils.DB.First(&user, claims["id"]).Error
			if err != nil {
				c.AbortWithStatusJSON(403, utils.ApiResponse{Message: err.Error()})
				return
			} 
	
			if !slices.Contains(roles, user.Role) || user.Status != "ACTIVE" {
				c.AbortWithStatusJSON(403, utils.ApiResponse{Message: "Unauthorize user!"})
				return
			} 
			c.Set("user", user)
		} else {
			c.AbortWithStatus(403)
			return
		}
	
		c.Next()
	}
}