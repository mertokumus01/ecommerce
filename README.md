# 🛒 E-Commerce Application - Full Stack

A modern, production-ready e-commerce platform featuring a robust Spring Boot backend, Angular 21 frontend, and Oracle database, fully containerized with Docker.

[![Java](https://img.shields.io/badge/Java-21-orange?logo=java)](https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-green?logo=spring-boot)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)](https://angular.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](https://www.docker.com/)
[![Oracle](https://img.shields.io/badge/Oracle-21c-red?logo=oracle)](https://www.oracle.com/database/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Development](#development)

## 🎯 Overview

This project is a complete e-commerce solution designed for scalability and production deployment:

- **Backend**: Spring Boot 4.0.5 REST API with JWT authentication
- **Frontend**: Angular 21 with modern Signals architecture and Nginx
- **Database**: Oracle 21c XE with Hibernate ORM auto-schema management
- **DevOps**: Full Docker containerization for cross-platform deployment

The entire stack runs in Docker containers, so no local installation of Java, Oracle, or Node.js is required!

## ✨ Features

### 🔧 Backend Features
- ✅ RESTful APIs with Spring Boot Web
- ✅ JWT-based authentication & authorization
- ✅ Role-based access control (Admin, User, Guest)
- ✅ Product catalog with category filtering
- ✅ Shopping cart & checkout system
- ✅ Order management & tracking
- ✅ User reviews and ratings
- ✅ Swagger/OpenAPI documentation
- ✅ Health checks & actuator endpoints
- ✅ Automatic database schema migration
- ✅ Request validation with Bean Validation
- ✅ Global exception handling

### 🎨 Frontend Features
- ✅ Responsive Angular 21 application
- ✅ Modern Signals-based state management
- ✅ Bootstrap 5 responsive design
- ✅ Product browsing with advanced filtering
- ✅ Shopping cart management
- ✅ Secure user authentication
- ✅ Admin dashboard panel
- ✅ Order history tracking
- ✅ User profile management
- ✅ Gzip compression for performance
- ✅ Standalone components architecture

### 🐳 DevOps Features
- ✅ Fully containerized with Docker
- ✅ Docker Compose multi-service orchestration
- ✅ Multi-stage optimized builds
- ✅ Health checks on all services
- ✅ Volume persistence for Oracle data
- ✅ Network isolation with bridge driver
- ✅ Automatic service restart on failure

## 🛠 Tech Stack

### Backend Stack
```
Java 21 (LTS)
Spring Boot 4.0.5
Spring Security 7.0.4 (JWT)
Spring Data JPA 4.0.4
Hibernate ORM 7.2.7
Oracle JDBC 23.26.1
Maven 3.9.12
Tomcat Embedded 11.0.20
Lombok 1.18.30
Swagger/OpenAPI 2.0.4
```

### Frontend Stack
```
Angular 21
TypeScript 5.x
Bootstrap 5.3
RxJS 7.8
Nginx 1.25-Alpine
Node.js 20-Alpine
```

### Infrastructure
```
Docker
Docker Compose 2.20+
Oracle 21c XE
```

## 📁 Project Structure

```
ecommerce/
├── backend/                              # Spring Boot API
│   ├── src/main/java/com/ecommerce/
│   │   ├── api/controller/              # REST Controllers
│   │   ├── service/                     # Business Logic
│   │   ├── repository/                  # Data Access
│   │   ├── entity/                      # JPA Entities
│   │   ├── dto/                         # Data Transfer Objects
│   │   ├── exception/                   # Custom Exceptions
│   │   └── EcommerceApiApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-production.properties
│   ├── pom.xml
│   ├── Dockerfile
│   └── mvnw
│
├── frontend/                            # Angular Application
│   ├── src/app/
│   │   ├── features/
│   │   │   ├── auth/                   # Login/Register
│   │   │   ├── products/               # Product listing
│   │   │   ├── cart/                   # Shopping cart
│   │   │   ├── checkout/               # Order checkout
│   │   │   ├── orders/                 # Order history
│   │   │   ├── admin/                  # Admin panel
│   │   │   └── home/                   # Home page
│   │   ├── core/
│   │   │   ├── guards/                 # Route guards
│   │   │   ├── interceptors/           # HTTP interceptors
│   │   │   ├── exceptions/             # Exception handling
│   │   │   └── services/               # Core services
│   │   ├── shared/                     # Shared components
│   │   ├── layout/                     # Layout components
│   │   └── app.ts
│   ├── src/environments/
│   ├── package.json
│   ├── angular.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .gitignore
│
├── docker/
│   └── oracle-init/                    # Oracle initialization
│       └── 01-init-user.sql
│
├── docs/
│   ├── API_ENDPOINTS.md                # API documentation
│   ├── DATABASE_SCHEMA.md              # DB schema
│   └── DEPLOYMENT.md                   # Deployment guide
│
├── scripts/
│   └── seed-db.ps1                     # Database seeding
│
├── docker-compose.yml                  # Docker Compose config
├── .gitignore
└── README.md
```

## 📋 Prerequisites

### For Docker Deployment (Recommended) ⭐
```
✓ Docker Desktop 20.10+
✓ Docker Compose 2.20+
```

That's it! No Java, Oracle, or Node.js needed!

### For Local Development
```
✓ Java 21 JDK
✓ Maven 3.9.12+
✓ Node.js 20+
✓ Angular CLI 17+
✓ Oracle 21c XE (optional)
```

## 🚀 Quick Start

### Option 1: Docker (Recommended - 2 commands!)

```powershell
cd C:\Users\okumu\OneDrive\Desktop\ecommerce

# Start everything!
docker-compose up -d

# Wait 30 seconds for services to start...
# Then open your browser!
```

**Access immediately:**
- 🌐 Frontend: http://localhost
- 🔌 API: http://localhost:8080/api
- 📚 Swagger: http://localhost:8080/api/swagger-ui.html
- 💚 Health: http://localhost:8080/api/actuator/health

### Option 2: Local Development

```powershell
# Terminal 1: Backend
cd backend
mvn clean install
mvn spring-boot:run
# Backend runs on http://localhost:8080

# Terminal 2: Frontend
cd frontend
npm install
ng serve --open
# Frontend runs on http://localhost:4200
```

## 🐳 Docker Deployment

### Start All Services

```powershell
# Build and start (fresh build)
docker-compose up -d --build

# Just start (uses existing images)
docker-compose up -d

# View all containers
docker-compose ps

# View live logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f ecommerce-api
```

### Service Dashboard

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Frontend | 80 | http://localhost | ✅ Nginx + Angular |
| Backend | 8080 | http://localhost:8080/api | ✅ Spring Boot |
| Database | 1521 | localhost:1521/XEPDB1 | ✅ Oracle 21c |

### Database Connection

```
Type: Oracle
Host: localhost
Port: 1521
Database: XEPDB1
Username: ECOMMERCEAPI
Password: ecommerce123
```

### Stop Services

```powershell
# Stop all services (keeps data)
docker-compose stop

# Remove containers (keeps data)
docker-compose down

# Remove everything (delete data!)
docker-compose down -v

# Remove specific service
docker-compose stop ecommerce-api
docker-compose rm ecommerce-api
```

### Useful Commands

```powershell
# Restart specific service
docker-compose restart ecommerce-api

# Execute command in container
docker exec -it ecommerce-api bash

# View container logs
docker logs ecommerce-api -f

# Check container resource usage
docker stats

# Remove unused Docker resources
docker system prune
```

## 📚 API Documentation

### Swagger UI
**URL**: http://localhost:8080/api/swagger-ui.html

Interactive API documentation with try-it-out feature!

### Health & Monitoring

```
GET  /api/actuator/health          # Service health
GET  /api/actuator/info            # Application info
GET  /api/actuator/metrics         # Application metrics
```

### Core API Endpoints

```
# 🔐 Authentication
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # User login
POST   /api/auth/refresh           # Refresh JWT token

# 📦 Products
GET    /api/products               # List all products
GET    /api/products/{id}          # Get product by ID
GET    /api/products/category/{id} # Get by category
POST   /api/products               # Create (Admin)
PUT    /api/products/{id}          # Update (Admin)
DELETE /api/products/{id}          # Delete (Admin)

# 📂 Categories
GET    /api/categories             # List all categories
POST   /api/categories             # Create (Admin)
PUT    /api/categories/{id}        # Update (Admin)
DELETE /api/categories/{id}        # Delete (Admin)

# 🛒 Shopping Cart
GET    /api/cart                   # Get cart
POST   /api/cart/items             # Add to cart
PUT    /api/cart/items/{id}        # Update item
DELETE /api/cart/items/{id}        # Remove item
DELETE /api/cart                   # Clear cart

# 📋 Orders
GET    /api/orders                 # List user orders
POST   /api/orders                 # Create order
GET    /api/orders/{id}            # Get order details
PUT    /api/orders/{id}            # Update status (Admin)

# 👤 Users (Admin)
GET    /api/users                  # List all users
GET    /api/users/{id}             # Get user details
PUT    /api/users/{id}             # Update user (Admin)
DELETE /api/users/{id}             # Delete user (Admin)

# ⭐ Reviews
GET    /api/reviews                # List reviews
POST   /api/reviews                # Create review
PUT    /api/reviews/{id}           # Update review
DELETE /api/reviews/{id}           # Delete review
```

See [API_ENDPOINTS.md](docs/API_ENDPOINTS.md) for complete details.

## ⚙️ Configuration

### Environment Variables

Create a `.env` file (optional):

```env
# Database
SPRING_DATASOURCE_USERNAME=ECOMMERCEAPI
SPRING_DATASOURCE_PASSWORD=ecommerce123

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-min-256-bits

# Application
SPRING_JPA_HIBERNATE_DDL_AUTO=create
SPRING_PROFILES_ACTIVE=production
```

### Backend Configuration

**application-production.properties**
```properties
spring.application.name=ecommerce-api
server.port=8080
server.servlet.context-path=/api

spring.datasource.url=jdbc:oracle:thin:@//oracle:1521/XEPDB1
spring.datasource.username=ECOMMERCEAPI
spring.datasource.password=ecommerce123

spring.jpa.hibernate.ddl-auto=create
spring.jpa.database-platform=org.hibernate.dialect.OracleDialect
```

### Frontend Configuration

**environment.prod.ts**
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://localhost/api'
};
```

## 👨‍💻 Development

### Backend Development

```powershell
cd backend

# Install dependencies
mvn clean install

# Run application
mvn spring-boot:run

# Build JAR
mvn clean package

# Run tests
mvn test

# Format code
mvn spotless:apply
```

### Frontend Development

```powershell
cd frontend

# Install dependencies
npm install

# Start dev server (auto-reload)
ng serve

# Build for production
ng build --configuration production

# Run tests
ng test

# Lint code
ng lint

# Format code
npm run format
```

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Role-based authorization (RBAC)
- ✅ CORS properly configured
- ✅ Password hashing with BCrypt
- ✅ SQL injection prevention via JPA
- ✅ CSRF protection enabled
- ✅ Request validation
- ✅ Global exception handling
- ✅ HTTPS ready (configure in production)

## 📝 Database Schema

View [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for:
- Entity-relationship diagram
- Table definitions
- Constraints and indexes
- Sample data structure

## 🚢 Production Deployment

View [DEPLOYMENT.md](docs/DEPLOYMENT.md) for:
- Server setup (Linux/Windows)
- Docker Compose scaling
- SSL/TLS configuration
- Backup & recovery
- Monitoring setup
- Performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/awesome-feature`
3. Commit changes: `git commit -m 'Add awesome feature'`
4. Push branch: `git push origin feature/awesome-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with:
- Spring Boot ecosystem
- Angular framework
- Docker containerization
- Oracle database
- Open-source community

## 📞 Support & Questions

- 📖 Check [documentation](docs/)
- 💬 Open an [issue](../../issues)
- 📧 Contact development team
- 🗂️ Review [Swagger API](http://localhost:8080/api/swagger-ui.html)

## 📚 Learning Resources

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Angular Docs](https://angular.io/docs)
- [Docker Docs](https://docs.docker.com/)
- [JWT.io](https://jwt.io/)
- [Oracle Docs](https://docs.oracle.com/en/database/)

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: April 2026

Made with ❤️ for modern e-commerce solutions
- Spring Boot
- Java
- Maven

**Frontend:**
- Angular
- TypeScript
- CSS/Bootstrap

## 📝 Lisans

MIT
