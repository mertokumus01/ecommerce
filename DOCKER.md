# Docker Setup Guide

## Prerequisites
- Docker Desktop 4.20+
- Docker Compose 2.20+
- 8GB+ RAM
- 20GB+ disk space

## Quick Start

### 1. Build Images
```bash
docker-compose build
```

### 2. Start Services
```bash
# First time (creates volumes, networks, containers)
docker-compose up -d

# Check services are running
docker-compose ps
```

### 3. Access Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **Swagger Docs**: http://localhost/api/swagger-ui.html
- **Health Check**: http://localhost/api/actuator/health

### 4. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f oracle
```

### 5. Stop Services
```bash
docker-compose down
```

---

## Service Details

### Oracle Database
- **Image**: gvenzl/oracle-xe:21-slim
- **Port**: 1521
- **Database**: XEPDB1
- **Username**: ECOMMERCEAPI
- **Password**: ecommerce123
- **Volume**: oracle_data (persistent)

### Backend (Spring Boot API)
- **Image**: Built from Dockerfile
- **Port**: 8080 (internal), 8080 (exposed)
- **Context Path**: /api
- **Health Check**: /actuator/health
- **Depends On**: oracle (healthy)

### Frontend (Angular + Nginx)
- **Image**: Built from Dockerfile  
- **Port**: 80 (HTTP), 443 (HTTPS - optional)
- **API Proxy**: /api → backend:8080/api
- **SPA Routing**: All requests → index.html
- **Depends On**: backend (healthy)

---

## Common Commands

### Database Operations
```bash
# Connect to Oracle SQL
docker exec -it ecommerce-oracle sqlplus sys/oracle123@XEPDB1 as sysdba

# View database logs
docker-compose logs oracle
```

### Backend Operations
```bash
# View backend logs
docker-compose logs -f backend

# Rebuild backend only
docker-compose build backend
docker-compose up -d backend

# Check health
curl http://localhost:8080/api/actuator/health
```

### Frontend Operations
```bash
# View frontend logs
docker-compose logs -f frontend

# Rebuild frontend (re-build Angular)
docker-compose build frontend
docker-compose up -d frontend

# Check health
curl http://localhost/health
```

### Clean Rebuild
```bash
# Remove everything and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## Environment Variables

Create `.env.docker` from `.env.example`:
```bash
cp .env.example .env.docker
# Edit .env.docker with your settings
```

Key variables:
- `SPRING_DATASOURCE_URL`: Oracle connection string
- `SPRING_DATASOURCE_USERNAME`: Oracle user
- `SPRING_DATASOURCE_PASSWORD`: Oracle password
- `SPRING_PROFILES_ACTIVE`: production (optimize for Docker)
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: validate (don't auto-migrate)

---

## Production Deployment

### 1. Setup Environment
```bash
# Copy and configure environment
cp .env.example .env.prod
# Edit .env.prod with production values
```

### 2. Use Production Compose
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 3. Setup Reverse Proxy (Optional - Nginx)
```bash
# See docker-compose.prod.yml for reverse proxy configuration
```

### 4. Enable HTTPS
- Use Let's Encrypt with Certbot
- Or use a reverse proxy (Traefik, Nginx)
- See docker-compose.prod.yml for SSL setup

### 5. Volumes & Backup
```bash
# Backup Oracle data
docker run --rm -v ecommerce_oracle_data:/data -v $(pwd):/backup ubuntu tar czf /backup/oracle-backup.tar.gz /data

# Restore from backup
docker run --rm -v ecommerce_oracle_data:/data -v $(pwd):/backup ubuntu tar xzf /backup/oracle-backup.tar.gz -C /
```

---

## Troubleshooting

### Containers Won't Start
```bash
# Check logs
docker-compose logs

# Check port conflicts
netstat -ano | findstr :8080  # Windows
netstat -tuln | grep 8080     # Linux
```

### Oracle Connection Failed
```bash
# Wait for Oracle to be ready (can take 2-3 minutes)
docker-compose logs oracle | grep "DATABASE IS READY"

# Restart Oracle only
docker-compose restart oracle
```

### Frontend Shows 502 Bad Gateway
```bash
# Check backend is healthy
curl http://localhost:8080/api/actuator/health

# Check frontend logs
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend
```

### Database Schema Not Initialized
```bash
# Ensure Oracle is ready first
docker-compose exec oracle sqlplus sys/oracle123@XEPDB1 as sysdba

# Check if ECOMMERCEAPI user exists
SELECT * FROM dba_users WHERE username='ECOMMERCEAPI';

# If not, run SQL scripts manually
```

---

## Performance Tuning

### Memory Limits
Edit `docker-compose.yml` to set memory limits:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
  oracle:
    deploy:
      resources:
        limits:
          memory: 2G
```

### Logging
- Backend logs: `/var/log/ecommerce/spring.log`
- Nginx logs: Docker logs
- Oracle logs: Docker logs

### Database Optimization
```bash
# Enable stats collection
docker exec ecommerce-oracle sqlplus -s sys/oracle123@XEPDB1 as sysdba << EOF
EXEC DBMS_STATS.GATHER_DATABASE_STATS;
EXIT;
EOF
```

---

## Cleanup
```bash
# Stop all services
docker-compose down

# Remove volumes (careful - deletes data!)
docker-compose down -v

# Remove unused images
docker image prune -a

# Remove unused networks
docker network prune
```

---

## Next Steps
1. Monitor containers: `docker stats`
2. Setup log aggregation: ELK, Splunk, DataDog
3. Setup CI/CD: GitHub Actions, GitLab CI
4. Consider Kubernetes for production
5. Setup backup strategy for Oracle data
