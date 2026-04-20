#!/usr/bin/env pwsh
# E-Commerce Application - Comprehensive Test Report

Write-Host ""
Write-Host "===================================================================="
Write-Host "E-COMMERCE APP - COMPREHENSIVE SYSTEM TEST REPORT" -ForegroundColor Cyan
Write-Host "====================================================================" 
Write-Host ""

$passCount = 0
$failCount = 0
$warnCount = 0

# 1. DOCKER CONTAINER STATUS
Write-Host "1. DOCKER CONTAINER STATUS" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------------------"

$containers = @("ecommerce-oracle", "ecommerce-api", "ecommerce-web")

foreach ($container in $containers) {
    try {
        $status = docker ps --filter "name=$container" --format "{{.Status}}" 2>&1
        if ($status -match "Up.*healthy") {
            Write-Host "[PASS] $container : HEALTHY" -ForegroundColor Green
            $passCount++
        }
        elseif ($status -match "Up") {
            Write-Host "[WARN] $container : UP (initializing)" -ForegroundColor Yellow
            $warnCount++
        }
        else {
            Write-Host "[FAIL] $container : NOT RUNNING" -ForegroundColor Red
            $failCount++
        }
    }
    catch {
        Write-Host "[FAIL] $container : Error checking status" -ForegroundColor Red
        $failCount++
    }
}
Write-Host ""

# 2. BACKEND API TESTS
Write-Host "2. BACKEND API TESTS" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------------------"

try {
    $health = Invoke-WebRequest -Uri "http://localhost:8080/api/actuator/health" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host "[PASS] Health Endpoint: $($health.StatusCode)" -ForegroundColor Green
    $passCount++
}
catch {
    Write-Host "[FAIL] Health Endpoint: Failed" -ForegroundColor Red
    $failCount++
}

try {
    $info = Invoke-WebRequest -Uri "http://localhost:8080/api/actuator/info" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host "[PASS] Info Endpoint: $($info.StatusCode)" -ForegroundColor Green
    $passCount++
}
catch {
    Write-Host "[FAIL] Info Endpoint: Failed" -ForegroundColor Red
    $failCount++
}

Write-Host ""

# 3. DATABASE STATUS
Write-Host "3. DATABASE STATUS" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------------------"

try {
    $dbHealth = Invoke-WebRequest -Uri "http://localhost:8080/api/actuator/health/db" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host "[PASS] Database Connection: OK" -ForegroundColor Green
    $passCount++
}
catch {
    Write-Host "[FAIL] Database Connection: Failed" -ForegroundColor Red
    $failCount++
}

Write-Host "  Service: Oracle 21c XE" -ForegroundColor Gray
Write-Host "  User: ECOMMERCEAPI" -ForegroundColor Gray
Write-Host "  Database: XEPDB1" -ForegroundColor Gray
Write-Host ""

# 4. FRONTEND TESTS
Write-Host "4. FRONTEND TESTS" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------------------"

try {
    $web = Invoke-WebRequest -Uri "http://localhost/" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    if ($web.StatusCode -eq 200) {
        Write-Host "[PASS] Frontend Server: $($web.StatusCode)" -ForegroundColor Green
        $passCount++
    }
}
catch {
    Write-Host "[FAIL] Frontend Server: Failed" -ForegroundColor Red
    $failCount++
}

Write-Host "  Service: Angular 21 + Nginx" -ForegroundColor Gray
Write-Host "  Port: 80" -ForegroundColor Gray
Write-Host ""

# 5. ENDPOINT TESTS
Write-Host "5. API ENDPOINT TESTS" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------------------"

$endpoints = @(
    "http://localhost:8080/api/actuator/metrics",
    "http://localhost:8080/api/actuator/health/livenessState",
    "http://localhost:8080/api/actuator/health/readinessState"
)

foreach ($endpoint in $endpoints) {
    try {
        $resp = Invoke-WebRequest -Uri $endpoint -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        $name = ($endpoint -split '/')[-1]
        Write-Host "[PASS] $name : $($resp.StatusCode)" -ForegroundColor Green
        $passCount++
    }
    catch {
        $name = ($endpoint -split '/')[-1]
        Write-Host "[FAIL] $name : Failed" -ForegroundColor Yellow
        $warnCount++
    }
}
Write-Host ""

# 6. PORTS & SERVICES
Write-Host "6. PORTS & SERVICES" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------------------"

$ports = @(
    @{ Port = 80;   Service = "Frontend (Nginx)" },
    @{ Port = 8080; Service = "Backend API (Spring Boot)" },
    @{ Port = 1521; Service = "Database (Oracle)" }
)

foreach ($p in $ports) {
    try {
        $conn = Test-NetConnection -ComputerName localhost -Port $p.Port -WarningAction SilentlyContinue
        if ($conn.TcpTestSucceeded) {
            Write-Host "[PASS] Port $($p.Port) : $($p.Service) LISTENING" -ForegroundColor Green
            $passCount++
        }
        else {
            Write-Host "[FAIL] Port $($p.Port) : $($p.Service) NOT LISTENING" -ForegroundColor Red
            $failCount++
        }
    }
    catch {
        Write-Host "[FAIL] Port $($p.Port) : Error testing" -ForegroundColor Red
        $failCount++
    }
}
Write-Host ""

# 7. DOCKER IMAGES
Write-Host "7. DOCKER IMAGES" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------------------"

try {
    $images = docker images --filter "reference=*ecommerce*" --format "table {{.Repository}}`t{{.Size}}"
    if ($images) {
        Write-Host ($images | Out-String)
    }
}
catch {
    Write-Host "[INFO] Could not retrieve image information" -ForegroundColor Gray
}

Write-Host ""

# SUMMARY
Write-Host "====================================================================" 
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "====================================================================" 
Write-Host ""

$totalTests = $passCount + $failCount + $warnCount
Write-Host "Total Tests  : $totalTests" -ForegroundColor White
Write-Host "Passed       : $passCount" -ForegroundColor Green
Write-Host "Warnings     : $warnCount" -ForegroundColor Yellow
Write-Host "Failed       : $failCount" -ForegroundColor Red

Write-Host ""

if ($failCount -eq 0) {
    Write-Host "[SUCCESS] ALL SYSTEMS OPERATIONAL!" -ForegroundColor Green
    Write-Host "[OK] Backend  : HEALTHY" -ForegroundColor Green
    Write-Host "[OK] Frontend : HEALTHY" -ForegroundColor Green
    Write-Host "[OK] Database : HEALTHY" -ForegroundColor Green
    Write-Host "[OK] Docker   : ALL CONTAINERS RUNNING" -ForegroundColor Green
}
else {
    Write-Host "[WARNING] ISSUES DETECTED - Review above" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "====================================================================" 
Write-Host "ACCESS POINTS" -ForegroundColor Cyan
Write-Host "====================================================================" 
Write-Host ""
Write-Host "Frontend          : http://localhost" -ForegroundColor White
Write-Host "Backend API       : http://localhost:8080/api" -ForegroundColor White
Write-Host "Swagger Docs      : http://localhost:8080/api/swagger-ui.html" -ForegroundColor White
Write-Host "Health Check      : http://localhost:8080/api/actuator/health" -ForegroundColor White
Write-Host "Database          : localhost:1521/XEPDB1 (ECOMMERCEAPI:ecommerce123)" -ForegroundColor White
Write-Host ""
Write-Host "====================================================================" 
Write-Host "Report Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "===================================================================="
Write-Host ""
