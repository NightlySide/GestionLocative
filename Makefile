build: 
	@echo "-- Building backend"
	docker build -f docker/backend.dockerfile . -t gestion-locative-backend

	@echo "-- Building frontend"
	docker build -f docker/frontend.dockerfile . -t gestion-locative-frontend

run:
	@echo "-- Running Gestion Locative project"
	docker-compose -f docker/docker-compose.yml up

all: build run