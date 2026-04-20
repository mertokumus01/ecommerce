#!/bin/bash
# Docker Helper Scripts for eCommerce Application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check Docker installation
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    log_info "Docker and Docker Compose are installed"
}

# Build Docker images
build() {
    log_info "Building Docker images..."
    docker-compose build --progress=plain $@
    log_info "Build complete"
}

# Start services
start() {
    log_info "Starting services..."
    docker-compose up -d
    log_info "Services started"
    sleep 5
    status
}

# Stop services
stop() {
    log_info "Stopping services..."
    docker-compose down $@
    log_info "Services stopped"
}

# Show service status
status() {
    log_info "Service status:"
    docker-compose ps
}

# View logs
logs() {
    log_info "Showing logs (Ctrl+C to exit)..."
    docker-compose logs -f $@
}

# Restart services
restart() {
    stop
    start
}

# Clean up (remove volumes)
clean() {
    log_warn "This will delete all data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        log_info "Cleanup complete"
    else
        log_info "Cleanup cancelled"
    fi
}

# Health check
health() {
    log_info "Checking service health..."
    
    # Check Backend
    if curl -s http://localhost:8080/api/actuator/health | grep -q '"status":"UP"'; then
        log_info "Backend: ${GREEN}UP${NC}"
    else
        log_error "Backend: DOWN"
    fi
    
    # Check Frontend
    if curl -s http://localhost/health | grep -q "healthy"; then
        log_info "Frontend: ${GREEN}UP${NC}"
    else
        log_error "Frontend: DOWN"
    fi
    
    # Check Oracle
    if docker exec ecommerce-oracle sqlplus -s sys/oracle123@XEPDB1 as sysdba <<< "SELECT 1 FROM DUAL;" &>/dev/null; then
        log_info "Database: ${GREEN}UP${NC}"
    else
        log_error "Database: DOWN"
    fi
}

# Show usage
usage() {
    cat << EOF
Usage: $0 <command> [options]

Commands:
    check       - Check Docker installation
    build       - Build Docker images
    start       - Start all services
    stop        - Stop all services
    restart     - Restart all services
    status      - Show service status
    logs        - Show logs (use -f <service> for specific)
    health      - Check service health
    clean       - Remove all containers and volumes
    help        - Show this help message

Examples:
    $0 check
    $0 build
    $0 start
    $0 logs -f backend
    $0 stop
    $0 clean

EOF
}

# Main
main() {
    case "${1:-help}" in
        check)
            check_docker
            ;;
        build)
            check_docker
            build "${@:2}"
            ;;
        start)
            check_docker
            start
            ;;
        stop)
            stop "${@:2}"
            ;;
        restart)
            restart
            ;;
        status)
            status
            ;;
        logs)
            logs "${@:2}"
            ;;
        health)
            health
            ;;
        clean)
            clean
            ;;
        help)
            usage
            ;;
        *)
            log_error "Unknown command: $1"
            usage
            exit 1
            ;;
    esac
}

main "$@"
