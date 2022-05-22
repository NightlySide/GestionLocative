package database

import (
	"fmt"

	"github.com/nightlyside/gestion-locative/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

type ConnectConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	Database string
}

var DefaultConnectConfig = &ConnectConfig{
	Host:     "127.0.0.1",
	Port:     3306,
	Username: "root",
	Password: "",
	Database: "gestion-locative",
}

func ConnectDB(config *ConnectConfig) (*gorm.DB, error) {
	// connection url
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local", config.Username, config.Password, config.Host, config.Port, config.Database)

	// open the db
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// launch auto migration for new data
	err = AutoMigrate(db)
	if err != nil {
		return nil, err
	}

	DB = db
	return db, nil
}

func AutoMigrate(db *gorm.DB) error {
	// creation of a list of models to load
	var models_to_migrate []interface{}
	models_to_migrate = append(models_to_migrate, &models.User{}, &models.Property{}, &models.Room{}, &models.Tenant{}, &models.Transaction{})

	// load each model and return the errors
	for _, model := range models_to_migrate {
		err := db.AutoMigrate(model)
		if err != nil {
			return err
		}
	}

	return nil
}
