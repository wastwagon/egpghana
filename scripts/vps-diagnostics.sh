#!/bin/bash

###############################################################################
# VPS Diagnostics Script for Coolify Deployment - EGP Ghana
# Run this on your Hostinger VPS to diagnose deployment issues
###############################################################################

echo "======================================================================"
echo "🔍 EGP GHANA - COOLIFY DEPLOYMENT DIAGNOSTICS"
echo "======================================================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print section headers
print_section() {
    echo ""
    echo -e "${BLUE}======================================================================"
    echo "📋 $1"
    echo -e "======================================================================${NC}"
    echo ""
}

# Function to print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

###############################################################################
# 1. SYSTEM INFORMATION
###############################################################################
print_section "1. SYSTEM INFORMATION"

echo "Hostname: $(hostname)"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo "Kernel: $(uname -r)"
echo "Uptime: $(uptime -p)"
echo ""

###############################################################################
# 2. DISK SPACE
###############################################################################
print_section "2. DISK SPACE USAGE"

df -h | grep -E "Filesystem|/$|/var|/home"
echo ""

# Check if disk is critically full
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    print_error "CRITICAL: Disk usage is at ${DISK_USAGE}%! This can cause deployment failures."
elif [ "$DISK_USAGE" -gt 80 ]; then
    print_warning "Disk usage is at ${DISK_USAGE}%. Consider cleaning up."
else
    print_success "Disk usage is healthy at ${DISK_USAGE}%"
fi

###############################################################################
# 3. MEMORY USAGE
###############################################################################
print_section "3. MEMORY USAGE"

free -h
echo ""

# Check memory usage
MEM_USAGE=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
if [ "$MEM_USAGE" -gt 90 ]; then
    print_error "CRITICAL: Memory usage is at ${MEM_USAGE}%!"
elif [ "$MEM_USAGE" -gt 80 ]; then
    print_warning "Memory usage is at ${MEM_USAGE}%"
else
    print_success "Memory usage is healthy at ${MEM_USAGE}%"
fi

###############################################################################
# 4. DOCKER STATUS
###############################################################################
print_section "4. DOCKER STATUS"

if command -v docker &> /dev/null; then
    print_success "Docker is installed"
    echo "Docker version: $(docker --version)"
    echo ""
    
    # Check if Docker daemon is running
    if docker info &> /dev/null; then
        print_success "Docker daemon is running"
    else
        print_error "Docker daemon is NOT running!"
        echo "Try: sudo systemctl start docker"
    fi
else
    print_error "Docker is NOT installed!"
fi

echo ""

###############################################################################
# 5. DOCKER CONTAINERS
###############################################################################
print_section "5. DOCKER CONTAINERS STATUS"

if docker info &> /dev/null; then
    echo "All containers:"
    docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    
    # Count running vs stopped containers
    RUNNING=$(docker ps -q | wc -l)
    STOPPED=$(docker ps -aq -f status=exited | wc -l)
    echo "Running containers: $RUNNING"
    echo "Stopped containers: $STOPPED"
    echo ""
    
    # Check for EGP-related containers
    echo "EGP-related containers:"
    docker ps -a | grep -i "egp\|coolify" || echo "No EGP or Coolify containers found"
else
    print_error "Cannot check containers - Docker is not running"
fi

echo ""

###############################################################################
# 6. COOLIFY-SPECIFIC CHECKS
###############################################################################
print_section "6. COOLIFY STATUS"

# Check if Coolify is running
COOLIFY_RUNNING=$(docker ps | grep -i coolify | wc -l)
if [ "$COOLIFY_RUNNING" -gt 0 ]; then
    print_success "Coolify containers are running ($COOLIFY_RUNNING containers)"
    echo ""
    docker ps --filter "name=coolify" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
    print_error "No Coolify containers are running!"
    echo "Check if Coolify is installed: ls -la /data/coolify"
fi

echo ""

###############################################################################
# 7. NETWORK CONNECTIVITY
###############################################################################
print_section "7. NETWORK CONNECTIVITY"

# Check if port 80 and 443 are listening
echo "Checking critical ports:"
if netstat -tuln 2>/dev/null | grep -q ":80 "; then
    print_success "Port 80 (HTTP) is listening"
else
    print_error "Port 80 (HTTP) is NOT listening"
fi

if netstat -tuln 2>/dev/null | grep -q ":443 "; then
    print_success "Port 443 (HTTPS) is listening"
else
    print_error "Port 443 (HTTPS) is NOT listening"
fi

echo ""

# Test external connectivity
echo "Testing external connectivity:"
if ping -c 1 8.8.8.8 &> /dev/null; then
    print_success "Internet connectivity is working"
else
    print_error "No internet connectivity!"
fi

if ping -c 1 github.com &> /dev/null; then
    print_success "Can reach GitHub"
else
    print_error "Cannot reach GitHub!"
fi

echo ""

###############################################################################
# 8. EGP APPLICATION CONTAINERS
###############################################################################
print_section "8. EGP APPLICATION DETAILS"

# Find EGP containers
EGP_CONTAINERS=$(docker ps -a --filter "name=egp" --format "{{.Names}}")

if [ -z "$EGP_CONTAINERS" ]; then
    print_warning "No containers with 'egp' in the name found"
    echo "Searching for containers by image or label..."
    docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
else
    for container in $EGP_CONTAINERS; do
        echo "Container: $container"
        echo "Status: $(docker inspect --format='{{.State.Status}}' $container)"
        echo "Health: $(docker inspect --format='{{.State.Health.Status}}' $container 2>/dev/null || echo 'No healthcheck')"
        echo "Restart Count: $(docker inspect --format='{{.RestartCount}}' $container)"
        echo ""
    done
fi

echo ""

###############################################################################
# 9. RECENT CONTAINER LOGS
###############################################################################
print_section "9. RECENT CONTAINER LOGS (Last 50 lines)"

# Get logs from all EGP containers
if [ -n "$EGP_CONTAINERS" ]; then
    for container in $EGP_CONTAINERS; do
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Logs from: $container"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        docker logs --tail 50 $container 2>&1
        echo ""
    done
else
    print_warning "No EGP containers found to show logs"
    echo ""
    echo "Showing Coolify proxy logs instead:"
    COOLIFY_PROXY=$(docker ps --filter "name=coolify-proxy" --format "{{.Names}}" | head -1)
    if [ -n "$COOLIFY_PROXY" ]; then
        docker logs --tail 50 $COOLIFY_PROXY 2>&1
    fi
fi

echo ""

###############################################################################
# 10. DATABASE CONNECTIVITY
###############################################################################
print_section "10. DATABASE CONTAINERS"

# Find PostgreSQL containers
POSTGRES_CONTAINERS=$(docker ps -a --filter "name=postgres" --format "{{.Names}}")
if [ -n "$POSTGRES_CONTAINERS" ]; then
    for container in $POSTGRES_CONTAINERS; do
        echo "PostgreSQL Container: $container"
        echo "Status: $(docker inspect --format='{{.State.Status}}' $container)"
        echo "Health: $(docker inspect --format='{{.State.Health.Status}}' $container 2>/dev/null || echo 'No healthcheck')"
        echo ""
    done
else
    print_warning "No PostgreSQL containers found"
fi

# Find Redis containers
REDIS_CONTAINERS=$(docker ps -a --filter "name=redis" --format "{{.Names}}")
if [ -n "$REDIS_CONTAINERS" ]; then
    for container in $REDIS_CONTAINERS; do
        echo "Redis Container: $container"
        echo "Status: $(docker inspect --format='{{.State.Status}}' $container)"
        echo ""
    done
else
    print_warning "No Redis containers found"
fi

echo ""

###############################################################################
# 11. DOCKER VOLUMES
###############################################################################
print_section "11. DOCKER VOLUMES"

docker volume ls
echo ""

# Check for EGP-related volumes
echo "EGP-related volumes:"
docker volume ls | grep -i egp || echo "No EGP volumes found"

echo ""

###############################################################################
# 12. DOCKER NETWORKS
###############################################################################
print_section "12. DOCKER NETWORKS"

docker network ls
echo ""

###############################################################################
# 13. SYSTEM RESOURCES
###############################################################################
print_section "13. SYSTEM RESOURCE LIMITS"

echo "Docker resource usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

echo ""

###############################################################################
# 14. FIREWALL STATUS
###############################################################################
print_section "14. FIREWALL STATUS"

if command -v ufw &> /dev/null; then
    echo "UFW Status:"
    sudo ufw status verbose 2>/dev/null || echo "Cannot check UFW status (requires sudo)"
elif command -v firewall-cmd &> /dev/null; then
    echo "Firewalld Status:"
    sudo firewall-cmd --list-all 2>/dev/null || echo "Cannot check firewall status (requires sudo)"
else
    echo "No common firewall detected (ufw/firewalld)"
fi

echo ""

###############################################################################
# 15. COOLIFY LOGS
###############################################################################
print_section "15. COOLIFY SYSTEM LOGS (Last 100 lines)"

COOLIFY_CONTAINER=$(docker ps --filter "name=coolify" --format "{{.Names}}" | grep -v proxy | head -1)
if [ -n "$COOLIFY_CONTAINER" ]; then
    docker logs --tail 100 $COOLIFY_CONTAINER 2>&1
else
    print_warning "Coolify main container not found"
fi

echo ""

###############################################################################
# SUMMARY
###############################################################################
print_section "DIAGNOSTIC SUMMARY"

echo "✅ Diagnostics complete!"
echo ""
echo "Key things to check:"
echo "  1. Are all containers running? (Section 5)"
echo "  2. Check container logs for errors (Section 9)"
echo "  3. Is the database accessible? (Section 10)"
echo "  4. Are ports 80/443 listening? (Section 7)"
echo "  5. Check disk space (Section 2)"
echo ""
echo "Next steps:"
echo "  - Review the logs above for ERROR or FAILED messages"
echo "  - Check Coolify dashboard at https://your-vps-ip:8000"
echo "  - Run: docker logs -f <container-name> for live logs"
echo ""
echo "======================================================================"
