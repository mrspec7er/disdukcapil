package user

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/mrspec7er/disdukcapil-api/models"
	"github.com/mrspec7er/disdukcapil-api/utils"
)

func Register(c *gin.Context) {
	req := models.User{}

	err := c.BindJSON(&req)
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	result, status, err := CreateUserService(req)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}

func Login(c *gin.Context) {
	req := struct {
		Email string `json:"email"`
		Password string `json:"password"`
	}{}

	err := c.BindJSON(&req)
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	result, user, status, err := LoginService(req.Email, req.Password)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", *result, int(time.Hour * 24), "/", os.Getenv("DOMAIN"), false, true)

	c.IndentedJSON(200, utils.ApiResponse{Data: user})	
}

func Whoami(c *gin.Context)  {
	user, status := c.Get("user")
	if !status {
		c.IndentedJSON(400, utils.ApiResponse{Message: "Failed to authorize user!"})
		return
	}

	c.IndentedJSON(200, utils.ApiResponse{Data: user})
}

func GeneratePasswordToken(c *gin.Context) {
	req := struct {
		Email string `json:"email"`
	}{}

	err := c.BindJSON(&req)
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	status, err := GeneratePasswordTokenServices(req.Email)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(200, utils.ApiResponse{Data: gin.H{"message": "Update password URL already sent to your email!"}})
}

func UpdatePassword(c *gin.Context) {
	req := struct {
		Token string `json:"token"`
		Password string `json:"password"`
	}{}
	
	err := c.BindJSON(&req)
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}
	
	token := strings.Split(req.Token, " ")[1]

	status, err := UpdatePasswordService(token, req.Password)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: gin.H{"message": "Update password succeed!"}})
}

