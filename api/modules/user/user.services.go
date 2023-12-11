package user

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/mrspec7er/disdukcapil-api/models"
	"github.com/mrspec7er/disdukcapil-api/utils"
	"golang.org/x/crypto/bcrypt"
)

func CreateUserService(req models.User) (*models.User, int, error) {

	user := &models.User{
		Name: req.Name,
		Email: req.Email,
		Nik: req.Nik,
		Phone: req.Phone,
		PlaceOfBirth: req.PlaceOfBirth,
		DateOfBirth: req.DateOfBirth,
		Role: "USER",
		Status: "INACTIVE",
	}
	err := utils.DB.Create(&user).Error
	if err != nil {
		return nil, 400, err
	}

	user.Password = "ENCRYPTED"

	return user, 201, err
}

func LoginService(email string, password string) (*string, *models.User, int, error)  {
	user := &models.User{}

	err := utils.DB.First(&user, "email = ?", email).Error
	if err != nil {
		return nil, nil, 400, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, nil, 400, err
	}

	token, err := generateTokenService(user.ID, 24, os.Getenv("AUTH_SECRET"))
	if err != nil {
		return nil, nil, 500, err
	}

	return token, user, 200, nil
}

func GeneratePasswordTokenServices(email string) (int, error) {
	user := &models.User{}

	err := utils.DB.First(&user, "email = ?", email).Error
	if err != nil {
		return  400, err
	}

	token, err := generateTokenService(user.ID, 1, os.Getenv("PASS_SECRET"))
	if err != nil {
		return  500, err
	}

	// Essential: send token to user email
	stringToken, _ := json.Marshal(*token)
	fmt.Println("TOKEN", stringToken)
	fmt.Println(*token)
	
	return 200, nil	
}

func UpdatePasswordService(token string, password string) (int, error) {

	payload, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		_, ok := t.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, errors.New("Failed to parse JWT token!") 
		}

		return []byte(os.Getenv("PASS_SECRET")), nil
	})
	if err != nil {
		return 400, err
	}

	claims, ok := payload.Claims.(jwt.MapClaims)

	if ok && payload.Valid {

		encryptedPass, err := bcrypt.GenerateFromPassword([]byte(password), 11)
		if err != nil {
			return  400, err
		}

		err = utils.DB.Model(&models.User{}).Where("id = ?", claims["id"]).Updates(models.User{Password: string(encryptedPass), Status: "ACTIVE"}).Error
	}

	return 201, nil
}

func generateTokenService(id uint, duration int, secret string) (*string, error)  {

	payload := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": id,
		"exp": time.Now().Add(time.Hour * time.Duration(duration)).Unix(),
	})

	token, err := payload.SignedString([]byte(secret))
	if err != nil {
		return nil, err
	}

	return &token, nil
}

