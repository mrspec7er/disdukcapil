package service

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/mrspec7er/disdukcapil-api/models"
	"github.com/mrspec7er/disdukcapil-api/utils"
)

func UpsertApplicationServ(c *gin.Context)  {
	req := models.ApplicationService{}

	err := c.Bind(&req)
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	if req.Name == "" || len(*req.ServiceFiles) == 0 || req.StepsInfo == "" {
		c.IndentedJSON(400, utils.ApiResponse{Message: "Service required at least one file!"})
		return
	}

	result, status, err := UpsertServService(req)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}

func GetMultipleApplicationServ(c *gin.Context)  {
	result, status, err := GetMultipleServService()
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}

func GetServiceById(c *gin.Context)  {
	param := c.Param("id")

	id, err := strconv.ParseUint(param, 10, 32);
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	result, status, err := GetServService(uint(id))
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}

func DeleteServ(c *gin.Context)  {
	param := c.Param("id")

	id, err := strconv.ParseUint(param, 10, 32);
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	result, status, err := DeleteServService(uint(id))
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}

func DeleteFile(c *gin.Context)  {
	param := c.Param("id")

	id, err := strconv.ParseUint(param, 10, 32);
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	result, status, err := DeleteFileService(uint(id))
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}