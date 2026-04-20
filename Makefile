.PHONY: help build start stop restart logs status health clean

help:
	@echo "E-Commerce Docker Commands"
	@echo "=========================="
	@echo ""
	@echo "make build       - Build Docker images"
	@echo "make start       - Start all services"
	@echo "make stop        - Stop all services"
	@echo "make restart     - Restart all services"
	@echo "make status      - Show service status"
	@echo "make logs        - Show logs"
	@echo "make logs.backend - Show backend logs"
	@echo "make logs.frontend - Show frontend logs"
	@echo "make logs.oracle - Show oracle logs"
	@echo "make health      - Check service health"
	@echo "make clean       - Remove all containers and volumes"

build:
	docker-compose build --progress=plain

start:
	docker-compose up -d
	sleep 5
	make status

stop:
	docker-compose down

restart: stop start

status:
	@docker-compose ps

logs:
	docker-compose logs -f

logs.backend:
	docker-compose logs -f backend

logs.frontend:
	docker-compose logs -f frontend

logs.oracle:
	docker-compose logs -f oracle

health:
	@echo "Checking services..."
	@curl -s http://localhost:8080/api/actuator/health | grep -o '"status":"[^"]*"'
	@echo "Backend health checked"
	@curl -s http://localhost/health | grep -o "healthy"
	@echo "Frontend health checked"

clean:
	@echo "Warning: This will delete all data!"
	docker-compose down -v

rebuild: clean build start

# Development helpers
dev.backend:
	cd backend && mvn spring-boot:run

dev.frontend:
	cd frontend && npm start

install:
	cd backend && mvn install -DskipTests
	cd frontend && npm install

test:
	cd backend && mvn test
	cd frontend && npm test

# Push to registry (customize with your registry)
push:
	docker-compose push

pull:
	docker-compose pull
