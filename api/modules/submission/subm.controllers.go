package submission

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/mrspec7er/disdukcapil-api/models"
	"github.com/mrspec7er/disdukcapil-api/utils"
)

func UpsertSubmission(c *gin.Context)  {
	req := models.Submission{}

	err := c.Bind(&req)
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	user := utils.GetUserFromContext(c) 

	err = SubmissionGuard(req.Code, user.ID)
	if err != nil {
		c.IndentedJSON(401, utils.ApiResponse{Message: err.Error()})
		return
	}

	result, status, err := UpsertSubmissionService(req, user)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}

func GetMultipleSubmission(c *gin.Context)  {
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

	appId := c.Query("appId")
	userName := c.Query("userName")

	result, count, status, err := GetMultipleSubmissionService(page, limit, appId, userName)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result, Metadata: utils.Metadata{Page: page, Limit: limit, Count: *count}})
}

func GetUserSubmission(c *gin.Context)  {
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

	submissionStatus := c.Query("status")

	user := utils.GetUserFromContext(c)

	result, count, status, err := GetUserSubmissionService(page, limit, user.ID, submissionStatus)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result, Metadata: utils.Metadata{Page: page, Limit: limit, Count: *count}})
}

func GetUserSubmissionDetail(c *gin.Context)  {

	code := c.Param("code")
	user := utils.GetUserFromContext(c)

	result, status, err := GetUserSubmissionDetailService(code, user.ID)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}

func DeleteSubmission(c *gin.Context)  {
	submissionCode := c.Param("code")

	result, status, err := DeleteSubmissionService(submissionCode)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}
