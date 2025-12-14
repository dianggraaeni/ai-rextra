#!/bin/bash

# Script untuk menjalankan aplikasi dengan Docker

echo "🚀 Memulai containerisasi aplikasi AI-REXTRA..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker belum berjalan. Mohon jalankan Docker terlebih dahulu."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose tidak tersedia. Mohon install Docker Compose."
    exit 1
fi

echo "✅ Docker dan Docker Compose tersedia"

# Build and run the application
echo "🔨 Building Docker image..."
docker-compose build

if [ $? -eq 0 ]; then
    echo "✅ Docker image berhasil dibuild"
    echo "🚀 Menjalankan aplikasi..."
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        echo "✅ Aplikasi berhasil dijalankan!"
        #!/bin/bash

# AI-REXTRA Docker Deployment Script
echo "🚀 Starting AI-REXTRA Career Guidance System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed."
    exit 1
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down

# Build and start the application
print_status "Building and starting AI-REXTRA..."
if docker-compose up -d --build; then
    print_success "Application is starting up..."
    
    # Wait for the application to be ready
    print_status "Waiting for application to be ready..."
    sleep 10
    
    # Check if container is healthy
    if docker-compose ps | grep -q "Up (healthy)"; then
        print_success "✅ AI-REXTRA is running successfully!"
        print_success "🌐 Access the application at: http://localhost:5001"
        echo ""
        echo "📊 Container Status:"
        docker-compose ps
        echo ""
        echo "📝 Useful Commands:"
        echo "  - View logs: docker-compose logs -f"
        echo "  - Stop app:  docker-compose down"
        echo "  - Restart:   docker-compose restart"
        echo ""
    else
        print_warning "Application started but health check pending..."
        print_status "Check logs with: docker-compose logs -f"
    fi
else
    print_error "Failed to start the application"
    print_status "Check logs with: docker-compose logs"
    exit 1
fi
        echo ""
        echo "📋 Perintah berguna:"
        echo "  - Melihat logs: docker-compose logs -f"
        echo "  - Menghentikan: docker-compose down"
        echo "  - Restart: docker-compose restart"
        echo ""
        docker-compose ps
    else
        echo "❌ Gagal menjalankan aplikasi"
        docker-compose logs
        exit 1
    fi
else
    echo "❌ Gagal building Docker image"
    exit 1
fi
