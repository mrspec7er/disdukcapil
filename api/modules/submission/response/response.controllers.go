package response

import (
	"github.com/gin-gonic/gin"
	"github.com/mrspec7er/disdukcapil-api/models"
	"github.com/mrspec7er/disdukcapil-api/modules/submission"
	"github.com/mrspec7er/disdukcapil-api/utils"
)

func InsertFormResponse(c *gin.Context)  {
	req := models.SubmissionForm{}

	err := c.Bind(&req)
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	userPayload, userStatus := c.Get("user")
	if !userStatus {
		c.IndentedJSON(400, utils.ApiResponse{Message: "Failed to authorize user!"})
		return
	}

	user := userPayload.(models.User); 

	err = submission.SubmissionGuard(req.SubmissionCode, user.ID)
	if err != nil {
		c.IndentedJSON(401, utils.ApiResponse{Message: err.Error()})
		return
	}

	status, err := RequiredFormGuard(*req.Responses, req.FormID)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	result, status, err := InsertFormResponseService(req)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})

}

func UpdateFormResponse(c *gin.Context)  {
	req := models.SubmissionForm{}

	err := c.Bind(&req)
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}
	
	if req.SubmissionCode == "" || req.ID == 0 {
		c.IndentedJSON(400, utils.ApiResponse{Message: "Submission code and ID required!"})
		return
	}

	userPayload, userStatus := c.Get("user")
	if !userStatus {
		c.IndentedJSON(400, utils.ApiResponse{Message: "Failed to authorize user!"})
		return
	}

	user := userPayload.(models.User); 

	err = submission.SubmissionGuard(req.SubmissionCode, user.ID)
	if err != nil {
		c.IndentedJSON(401, utils.ApiResponse{Message: err.Error()})
		return
	}

	status, err := RequiredFormGuard(*req.Responses, req.FormID)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	result, status, err := UpdateFormResponseService(req)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})

}

func GetMultipleFormResponse(c *gin.Context)  {
	submissionCode := c.Query("submissionCode")

	result, status, err := GetMultipleFormResponseService(submissionCode)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}
