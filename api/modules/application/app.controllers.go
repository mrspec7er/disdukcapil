package application

import (
	"mime/multipart"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/mrspec7er/disdukcapil-api/models"
	"github.com/mrspec7er/disdukcapil-api/utils"
)

func UpsertApplication(c *gin.Context)  {
	req := models.Application{}

	err := c.Bind(&req)
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	if req.Name == "" || req.RequirementInfo == "" || len(req.Outcomes) == 0 {
		c.IndentedJSON(400, utils.ApiResponse{Message: "Please make sure all required form field in!"})
		return
	}

	result, status, err := UpsertApplicationService(req)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}

func UpdateThumbnail(c *gin.Context)  {
	req := struct {
		ApplicationID uint `form:"applicationId"`
		Thumbnail *multipart.FileHeader `form:"thumbnail" binding:"required"`
	}{}

	err := c.Bind(&req)
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	dst := "/assets/application-thumbnail/" + strconv.FormatUint(uint64(req.ApplicationID), 10) + "-" + req.Thumbnail.Filename

	result, status, err := UpdateThumbnailService(req.ApplicationID, dst)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	err = c.SaveUploadedFile(req.Thumbnail, "." + dst)
	if err != nil {
		c.IndentedJSON(500, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}

func GetMultipleApplication(c *gin.Context)  {
	pageQuery := c.Query("page")
	page, err := strconv.Atoi(pageQuery);
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}
	limitQuery := c.Query("limit")
	limit, err := strconv.Atoi(limitQuery)
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	result, count, status, err := GetMultipleApplicationService(page, limit)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result, Metadata: utils.Metadata{Page: page, Limit: limit, Count: *count}})
}

func GetApplicationById(c *gin.Context)  {
	param := c.Param("id")

	id, err := strconv.ParseUint(param, 10, 32);
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	result, status, err := GetApplicationService(uint(id))
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}

func DeleteApplication(c *gin.Context)  {
	param := c.Param("id")

	id, err := strconv.ParseUint(param, 10, 32);
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	result, status, err := DeleteApplicationService(uint(id))
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}