#!/bin/bash
# Digital Health Competency Framework Startup Script (WSL/Linux)
# Version: 1.0.0

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN} Digital Health Competency Framework${NC}"
echo -e "${CYAN} Starting Application...${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}ERROR: Node.js is not installed${NC}"
    echo -e "${YELLOW}Please install Node.js: sudo apt update && sudo apt install nodejs npm${NC}"
    exit 1
fi

echo -e "${GREEN}Node.js version: $(node --version)${NC}"
echo -e "${GREEN}npm version: $(npm --version)${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check and install backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd backend
    npm install
    cd ..
fi

# Check and install frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd frontend
    npm install
    cd ..
fi

echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN} Starting Servers...${NC}"
echo -e "${CYAN}============================================${NC}"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        echo -e "${GREEN}Backend server stopped${NC}"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        echo -e "${GREEN}Frontend server stopped${NC}"
    fi
    echo -e "${GREEN}All servers stopped. Goodbye!${NC}"
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT SIGTERM

# Start backend server in background
echo -e "${BLUE}Starting backend server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend is still running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}ERROR: Backend server failed to start${NC}"
    exit 1
fi

echo -e "${GREEN}Backend server started (PID: $BACKEND_PID)${NC}"

# Start frontend server in background
echo -e "${BLUE}Starting frontend server...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 3

# Check if frontend is still running
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}ERROR: Frontend server failed to start${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

echo -e "${GREEN}Frontend server started (PID: $FRONTEND_PID)${NC}"

echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${GREEN} Application Started Successfully!${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""
echo -e "${BLUE}Backend Server:${NC} http://localhost:3001"
echo -e "${BLUE}Frontend App:${NC}   http://localhost:3000"
echo ""
echo -e "${YELLOW}Both servers are running in the background.${NC}"
echo -e "${YELLOW}Open http://localhost:3000 in your Windows browser.${NC}"
echo ""
echo -e "${GREEN}Press Ctrl+C to stop both servers${NC}"
echo ""

# Keep script running and wait for user interrupt
while true; do
    # Check if processes are still running every 5 seconds
    if ! kill -0 $BACKEND_PID 2>/dev/null || ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}One of the servers has stopped unexpectedly${NC}"
        cleanup
    fi
    sleep 5
done