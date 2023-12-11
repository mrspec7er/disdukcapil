package form

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"github.com/mrspec7er/disdukcapil-api/models"
	"github.com/mrspec7er/disdukcapil-api/utils"
)

func UpsertApplicationForm(c *gin.Context)  {
	req := models.ApplicationForm{}

	err := c.Bind(&req)
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	if req.Name == "" || len(*req.FormFields) == 0 || req.ApplicationID == 0 {
		c.IndentedJSON(400, utils.ApiResponse{Message: "Please make sure all required field filled in!"})
		return
	}

	for i, field := range *req.FormFields {
		if field.Type == "SELECT" && len(field.Options) == 0 {
			c.IndentedJSON(400, utils.ApiResponse{Message: "Form with type select require at least one options!"})
			return
		}
		if field.Type != "SELECT" && len(field.Options) > 0 {
			(*req.FormFields)[i].Options = pq.StringArray{}
			fmt.Println(field)
		}
	}

	result, status, err := UpsertFormService(req)
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}

func GetMultipleApplicationForm(c *gin.Context)  {
	result, status, err := GetMultipleFormService()
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}

func GetFormById(c *gin.Context)  {
	param := c.Param("id")

	id, err := strconv.ParseUint(param, 10, 32);
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	result, status, err := GetFormService(uint(id))
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}

func DeleteForm(c *gin.Context)  {
	param := c.Param("id")

	id, err := strconv.ParseUint(param, 10, 32);
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	result, status, err := DeleteFormService(uint(id))
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}

func DeleteField(c *gin.Context)  {
	param := c.Param("id")

	id, err := strconv.ParseUint(param, 10, 32);
	if err != nil {
		c.IndentedJSON(400, utils.ApiResponse{Message: err.Error()})
		return
	}

	result, status, err := DeleteFieldService(uint(id))
	if err != nil {
		c.IndentedJSON(status, utils.ApiResponse{Message: err.Error()})
		return
	}

	c.IndentedJSON(201, utils.ApiResponse{Data: result})
}