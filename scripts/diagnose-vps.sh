#!/bin/bash

# VPS Diagnostic Script for Coolify Deployment
# This script checks common issues that cause "no available server" errors

echo "=========================================="
echo "VPS Diagnostic Script for Coolify"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo ""
    echo "=========================================="
    echo "$1"
    echo "=========================================="
}

# Function to check command existence
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        return 1
    fi
}

# 1. System Information
print_header "1. SYSTEM INFORMATION"
echo "Hostname: $(hostname)"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo "Kernel: $(uname -r)"
echo "Uptime: $(uptime -p)"
echo ""

# 2. Resource Usage
print_header "2. RESOURCE USAGE"
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print "  CPU Usage: " 100 - $1"%"}'
echo ""
echo "Memory Usage:"
free -h
echo ""
echo "Disk Usage:"
df -h | grep -E '^/dev/'
echo ""

# 3. Docker Status
print_header "3. DOCKER STATUS"
if check_command docker; then
    echo ""
    echo "Docker Version:"
    docker --version
    echo ""
    echo "Docker Service Status:"
    systemctl status docker --no-pager | head -n 10
    echo ""
    echo "Running Containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "All Containers (including stopped):"
    docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "Docker Networks:"
    docker network ls
    echo ""
    echo "Docker Volumes:"
    docker volume ls
else
    echo -e "${RED}Docker is not installed or not accessible${NC}"
fi
echo ""

# 4. Coolify Status
print_header "4. COOLIFY STATUS"
if docker ps | grep -q coolify; then
    echo -e "${GREEN}✓${NC} Coolify containers are running"
    echo ""
    echo "Coolify Containers:"
    docker ps --filter "name=coolify" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "Coolify Logs (last 50 lines):"
    docker logs --tail 50 $(docker ps -q --filter "name=coolify" | head -n 1) 2>&1
else
    echo -e "${RED}✗${NC} No Coolify containers found running"
    echo ""
    echo "Checking for stopped Coolify containers:"
    docker ps -a --filter "name=coolify" --format "table {{.Names}}\t{{.Status}}"
fi
echo ""

# 5. Network & Port Status
print_header "5. NETWORK & PORT STATUS"
echo "Listening Ports:"
if command -v netstat &> /dev/null; then
    netstat -tlnp | grep -E ':(80|443|3000|8000|8080|5432|6379)'
elif command -v ss &> /dev/null; then
    ss -tlnp | grep -E ':(80|443|3000|8000|8080|5432|6379)'
else
    echo -e "${YELLOW}Neither netstat nor ss available${NC}"
fi
echo ""

echo "Firewall Status:"
if command -v ufw &> /dev/null; then
    echo "UFW Status:"
    ufw status
elif command -v firewall-cmd &> /dev/null; then
    echo "Firewalld Status:"
    firewall-cmd --state
    firewall-cmd --list-all
else
    echo -e "${YELLOW}No common firewall tool found${NC}"
fi
echo ""

# 6. DNS & Connectivity
print_header "6. DNS & CONNECTIVITY"
echo "Testing DNS Resolution:"
if nslookup egpghana.org &> /dev/null; then
    echo -e "${GREEN}✓${NC} egpghana.org resolves"
    nslookup egpghana.org | grep -A2 "Name:"
else
    echo -e "${RED}✗${NC} egpghana.org does not resolve"
fi
echo ""

echo "Public IP Address:"
curl -s ifconfig.me || echo "Unable to fetch public IP"
echo ""
echo ""

echo "Testing outbound connectivity:"
if ping -c 2 8.8.8.8 &> /dev/null; then
    echo -e "${GREEN}✓${NC} Internet connectivity OK"
else
    echo -e "${RED}✗${NC} No internet connectivity"
fi
echo ""

# 7. Application-specific checks
print_header "7. APPLICATION CONTAINERS"
echo "Looking for your application containers:"
docker ps -a | grep -E '(egp|postgres|redis|nginx|caddy)' || echo "No application containers found"
echo ""

# 8. Nginx/Reverse Proxy Status
print_header "8. REVERSE PROXY STATUS"
if docker ps | grep -E '(nginx|caddy|traefik)'; then
    echo -e "${GREEN}✓${NC} Reverse proxy container found"
    PROXY=$(docker ps --format '{{.Names}}' | grep -E '(nginx|caddy|traefik)' | head -n 1)
    echo ""
    echo "Proxy Container Logs (last 30 lines):"
    docker logs --tail 30 $PROXY 2>&1
else
    echo -e "${YELLOW}No reverse proxy container found${NC}"
fi
echo ""

# 9. Database Status
print_header "9. DATABASE STATUS"
if docker ps | grep -q postgres; then
    echo -e "${GREEN}✓${NC} PostgreSQL container is running"
    POSTGRES=$(docker ps --format '{{.Names}}' | grep postgres | head -n 1)
    echo "Container: $POSTGRES"
    docker exec $POSTGRES pg_isready 2>&1 || echo "Unable to check PostgreSQL status"
else
    echo -e "${YELLOW}No PostgreSQL container found running${NC}"
fi
echo ""

# 10. Environment & Configuration
print_header "10. ENVIRONMENT CHECK"
echo "Checking for common Coolify directories:"
for dir in /data/coolify /var/lib/docker/volumes; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $dir exists"
        ls -lh $dir 2>&1 | head -n 10
    else
        echo -e "${YELLOW}$dir not found${NC}"
    fi
done
echo ""

# 11. Recent System Logs
print_header "11. RECENT SYSTEM LOGS"
echo "Recent Docker errors:"
journalctl -u docker --no-pager -n 20 --since "1 hour ago" 2>&1 | grep -i error || echo "No recent Docker errors found"
echo ""

# 12. Summary & Recommendations
print_header "12. SUMMARY & RECOMMENDATIONS"
echo ""

# Check critical services
ISSUES=0

if ! systemctl is-active --quiet docker; then
    echo -e "${RED}⚠${NC} Docker service is not running. Start it with: sudo systemctl start docker"
    ((ISSUES++))
fi

if ! docker ps | grep -q coolify; then
    echo -e "${RED}⚠${NC} Coolify is not running. Check Coolify installation."
    ((ISSUES++))
fi

if ! docker ps | grep -qE '(nginx|caddy|traefik)'; then
    echo -e "${YELLOW}⚠${NC} No reverse proxy detected. Your application may not be accessible."
    ((ISSUES++))
fi

DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    echo -e "${RED}⚠${NC} Disk usage is critical (${DISK_USAGE}%). Free up space."
    ((ISSUES++))
fi

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✓${NC} No critical issues detected. Check application logs for specific errors."
else
    echo -e "${YELLOW}Found $ISSUES potential issue(s) above.${NC}"
fi

echo ""
echo "=========================================="
echo "Diagnostic Complete!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "1. Review the output above for any RED or YELLOW warnings"
echo "2. Check Coolify dashboard at http://YOUR_SERVER_IP:8000"
echo "3. Verify DNS records point to your VPS IP"
echo "4. Check application logs: docker logs <container_name>"
echo ""
