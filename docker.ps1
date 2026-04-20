# Docker Helper Script for Windows
# Usage: .\docker.ps1 <command>

param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Options
)

# Color functions
function Write-Info {
    Write-Host "[INFO] $args" -ForegroundColor Green
}

function Write-Warn {
    Write-Host "[WARN] $args" -ForegroundColor Yellow
}

function Write-Error {
    Write-Host "[ERROR] $args" -ForegroundColor Red
}

# Check Docker installation
function Check-Docker {
    try {
        $docker = docker --version
        $compose = docker-compose --version
        Write-Info "Docker: $docker"
        Write-Info "Docker Compose: $compose"
    }
    catch {
        Write-Error "Docker or Docker Compose not installed"
        exit 1
    }
}

# Build images
function Build-Images {
    Write-Info "Building Docker images..."
    & docker-compose build --progress=plain @Options
    Write-Info "Build complete"
}

# Start services
function Start-Services {
    Write-Info "Starting services..."
    & docker-compose up -d
    Write-Info "Services started"
    Start-Sleep -Seconds 5
    Show-Status
}

# Stop services
function Stop-Services {
    Write-Info "Stopping services..."
    & docker-compose down @Options
    Write-Info "Services stopped"
}

# Show status
function Show-Status {
    Write-Info "Service status:"
    & docker-compose ps
}

# View logs
function Show-Logs {
    Write-Info "Showing logs (Ctrl+C to exit)..."
    & docker-compose logs -f @Options
}

# Restart services
function Restart-Services {
    Stop-Services
    Start-Services
}

# Health check
function Check-Health {
    Write-Info "Checking service health..."
    
    # Backend
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/actuator/health" -UseBasicParsing
        if ($response.Content -like '*"status":"UP"*') {
            Write-Info "Backend: UP"
        } else {
            Write-Error "Backend: DOWN"
        }
    }
    catch {
        Write-Error "Backend: DOWN"
    }
    
    # Frontend
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing
        if ($response.Content -like '*healthy*') {
            Write-Info "Frontend: UP"
        } else {
            Write-Error "Frontend: DOWN"
        }
    }
    catch {
        Write-Error "Frontend: DOWN"
    }
}

# Clean up
function Clean-Containers {
    Write-Warn "This will delete all containers and data!"
    $response = Read-Host "Are you sure? (y/n)"
    
    if ($response -eq 'y' -or $response -eq 'Y') {
        & docker-compose down -v
        Write-Info "Cleanup complete"
    } else {
        Write-Info "Cleanup cancelled"
    }
}

# Usage
function Show-Usage {
    @"
Docker Helper Script for eCommerce

Usage: .\docker.ps1 <command>

Commands:
    check       - Check Docker installation
    build       - Build Docker images
    start       - Start all services
    stop        - Stop all services
    restart     - Restart all services
    status      - Show service status
    logs        - Show logs
    health      - Check service health
    clean       - Remove all containers and data
    help        - Show this help message

Examples:
    .\docker.ps1 check
    .\docker.ps1 build
    .\docker.ps1 start
    .\docker.ps1 logs -f backend
    .\docker.ps1 stop
    .\docker.ps1 health

"@ | Write-Host
}

# Main
switch ($Command.ToLower()) {
    "check"   { Check-Docker }
    "build"   { Check-Docker; Build-Images }
    "start"   { Check-Docker; Start-Services }
    "stop"    { Stop-Services }
    "restart" { Restart-Services }
    "status"  { Show-Status }
    "logs"    { Show-Logs @Options }
    "health"  { Check-Health }
    "clean"   { Clean-Containers }
    "help"    { Show-Usage }
    default   { Write-Error "Unknown command: $Command"; Show-Usage; exit 1 }
}
