#!/bin/bash
# Quick setup verification script

echo "🔍 AuthPhoto Setup Verification"
echo "================================"
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    echo "✓ Node.js $(node --version)"
else
    echo "✗ Node.js not found"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    echo "✓ npm $(npm --version)"
else
    echo "✗ npm not found"
    exit 1
fi

echo ""

# Check backend dependencies
echo "📦 Checking backend dependencies..."
cd backend
if [ -d "node_modules" ]; then
    echo "✓ Backend dependencies installed"
else
    echo "⚠ Backend dependencies not installed. Run: cd backend && npm install"
fi

# Check backend build
if [ -d "dist" ]; then
    echo "✓ Backend built"
else
    echo "⚠ Backend not built. Run: cd backend && npm run build"
fi

cd ..

echo ""

# Check frontend dependencies
echo "📦 Checking frontend dependencies..."
cd frontend
if [ -d "node_modules" ]; then
    echo "✓ Frontend dependencies installed"
else
    echo "⚠ Frontend dependencies not installed. Run: cd frontend && npm install"
fi

# Check frontend certificates
if [ -f ".cert/cert.pem" ] && [ -f ".cert/key.pem" ]; then
    echo "✓ HTTPS certificates exist"
    # Check certificate validity
    if openssl x509 -checkend 86400 -noout -in .cert/cert.pem &> /dev/null; then
        echo "✓ Certificate is valid"
    else
        echo "⚠ Certificate expired or invalid"
    fi
    # Show certificate IPs
    echo "  Certificate includes:"
    openssl x509 -in .cert/cert.pem -text -noout | grep -A 1 "Subject Alternative" | grep -o "IP Address:[^,]*" | sed 's/IP Address:/    - /'
else
    echo "⚠ HTTPS certificates not found. Run: cd frontend && ./generate-cert.sh"
fi

cd ..

echo ""

# Check if services are running
echo "🚀 Checking running services..."

# Check backend
if lsof -i :3000 &> /dev/null; then
    echo "✓ Backend running on port 3000"
    # Test health endpoint
    if curl -s -f http://localhost:3000/api/v1/health > /dev/null 2>&1; then
        echo "  ✓ Health check passed"
    else
        echo "  ⚠ Health check failed"
    fi
else
    echo "⚠ Backend not running on port 3000"
    echo "  Start with: cd backend && npm run start:dev"
fi

# Check frontend
if lsof -i :5173 &> /dev/null; then
    echo "✓ Frontend running on port 5173"
else
    echo "⚠ Frontend not running on port 5173"
    echo "  Start with: cd frontend && npm run dev"
fi

echo ""

# Get local IP
echo "🌐 Network Information"
echo "Local IP addresses:"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print "  - " $2}'
else
    # Linux
    hostname -I | tr ' ' '\n' | grep -v "^$" | awk '{print "  - " $1}'
fi

echo ""
echo "📱 Access URLs:"
echo "  Desktop (HTTPS): https://localhost:5173"
echo "  Desktop (HTTP):  http://localhost:5173"
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
if [ ! -z "$LOCAL_IP" ]; then
    echo "  Mobile (HTTPS):  https://$LOCAL_IP:5173"
fi

echo ""
echo "================================"
echo "✨ Verification complete!"
echo ""
echo "Next steps:"
echo "1. If backend is not running: cd backend && npm run start:dev"
echo "2. If frontend is not running: cd frontend && npm run dev"
echo "3. Access via HTTPS to enable camera on mobile devices"
echo "4. Accept self-signed certificate warning in browser"
echo ""
echo "See TROUBLESHOOTING.md for common issues"
