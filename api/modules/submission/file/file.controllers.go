package file

import (
	"mime/multipart"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/mrspec7er/disdukcapil-api/modules/submission"
	"github.com/mrspec7er/disdukcapil-api/utils"
)

type InsertSubmissionType struct {
	SubmissionCode string `form:"submissionCode"`
	ServiceFormId uint `form:"serviceFormId"`;
	ServiceFieldId uint `form:"serviceFieldId"`
	Value *multipart.FileHeader `form:"value" binding:"required"`
}

type SubmitSubmissionType struct {
	SubmissionCode string `form:"submissionCode"`
	ServiceFormId uint `form:"serviceFormId"`;
}

func UpsertSubmissionFile(c *gin.Context)  {
	req := InsertSubmissionType{}

	err := c.Bind(&req)
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	user := utils.GetUserFromContext(c) 

	err = submission.SubmissionGuard(req.SubmissionCode, user.ID)
	if err != nil {
		c.IndentedJSON(401, utils.ApiResponse{Message: err.Error()})
		return
	}
	
	dst := "/assets/submissions/" + req.SubmissionCode + "-" + strconv.FormatUint(uint64(req.ServiceFormId), 10) + "-" + strconv.FormatUint(uint64(req.ServiceFieldId), 10) + "-" + req.Value.Filename

	err = c.SaveUploadedFile(req.Value, "." + dst)
	if err == nil {
		result, status, err := InsertFormResponseService(req, dst)

		if err != nil {
			c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
			return
		}

		c.IndentedJSON(201, utils.ApiResponse{Data: result})
		return
	}

	c.IndentedJSON(500, utils.ApiResponse{Message: err.Error()})
	return
}

func SubmitFileResponse(c *gin.Context)  {
	req := SubmitSubmissionType{}

	err := c.Bind(&req)
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	user := utils.GetUserFromContext(c) 

	err = submission.SubmissionGuard(req.SubmissionCode, user.ID)
	if err != nil {
		c.IndentedJSON(401, utils.ApiResponse{Message: err.Error()})
		return
	}

	status, err := RequiredFileGuard(*&req.SubmissionCode, req.ServiceFormId)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	status, err = SubmitFileResponseService(req.SubmissionCode, req.ServiceFormId)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: gin.H{"message": "Application Successfully Submitted!", "req": req}})
	return	
}