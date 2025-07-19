#!/usr/bin/env python3
"""
ChainSureAI Service Startup Script
Starts the AI processing service with proper initialization
"""

import os
import sys
import subprocess
import time
import requests
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are available"""
    print("🔍 Checking dependencies...")
    
    dependencies = [
        ("python", "python --version"),
        ("tesseract", "tesseract --version"),
        ("pip", "pip --version")
    ]
    
    missing = []
    for name, cmd in dependencies:
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            if result.returncode == 0:
                print(f"  ✅ {name}: {result.stdout.strip().split()[0]}")
            else:
                missing.append(name)
        except Exception:
            missing.append(name)
    
    if missing:
        print(f"  ❌ Missing dependencies: {', '.join(missing)}")
        return False
    
    return True

def setup_environment():
    """Setup environment and directories"""
    print("🔧 Setting up environment...")
    
    # Create necessary directories
    directories = ["logs", "temp", "models"]
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"  📁 Created directory: {directory}")
    
    # Check if .env exists
    env_file = Path(".env")
    if not env_file.exists():
        env_example = Path(".env.example")
        if env_example.exists():
            subprocess.run(["cp", ".env.example", ".env"])
            print("  📝 Created .env from .env.example")
        else:
            print("  ⚠️  .env.example not found - using default configuration")
    
    return True

def install_requirements():
    """Install Python requirements"""
    print("📦 Installing Python requirements...")
    
    try:
        result = subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("  ✅ Requirements installed successfully")
            return True
        else:
            print(f"  ❌ Error installing requirements: {result.stderr}")
            return False
    except Exception as e:
        print(f"  ❌ Error installing requirements: {e}")
        return False

def start_service():
    """Start the AI service"""
    print("🚀 Starting ChainSureAI Service...")
    
    # Change to ai-service directory
    os.chdir("ai-service")
    
    # Start the service
    try:
        cmd = [
            sys.executable, "-m", "uvicorn", "main:app",
            "--host", "0.0.0.0",
            "--port", "8001",
            "--reload"
        ]
        
        print(f"  📡 Starting service with command: {' '.join(cmd)}")
        
        # Start the process
        process = subprocess.Popen(cmd)
        
        # Wait a moment for startup
        time.sleep(5)
        
        # Check if service is running
        try:
            response = requests.get("http://localhost:8001/health", timeout=10)
            if response.status_code == 200:
                print("  ✅ Service started successfully!")
                print(f"  🌐 Service available at: http://localhost:8001")
                print(f"  📖 API Documentation: http://localhost:8001/docs")
                return process
            else:
                print(f"  ❌ Service health check failed: {response.status_code}")
                return None
        except requests.exceptions.RequestException as e:
            print(f"  ⚠️  Service may still be starting: {e}")
            return process
            
    except Exception as e:
        print(f"  ❌ Error starting service: {e}")
        return None

def main():
    """Main startup function"""
    print("=" * 50)
    print("🤖 ChainSureAI Service Startup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("ai-service"):
        print("❌ ai-service directory not found!")
        print("Please run this script from the project root directory.")
        sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        print("\n❌ Missing dependencies. Please install them and try again.")
        print("\nFor Ubuntu/Debian:")
        print("  sudo apt-get install python3 python3-pip tesseract-ocr tesseract-ocr-eng")
        print("\nFor macOS:")
        print("  brew install python tesseract")
        sys.exit(1)
    
    # Setup environment
    if not setup_environment():
        print("❌ Failed to setup environment")
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        print("❌ Failed to install requirements")
        sys.exit(1)
    
    # Start service
    process = start_service()
    if process is None:
        print("❌ Failed to start service")
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("✅ ChainSureAI Service is running!")
    print("=" * 50)
    print("\nService Information:")
    print("  🌐 Health Check: http://localhost:8001/health")
    print("  📖 API Docs: http://localhost:8001/docs")
    print("  🔑 API Key: chainsure_dev_key_2024")
    print("\nTest the service:")
    print("  curl -H 'Authorization: Bearer chainsure_dev_key_2024' http://localhost:8001/health")
    print("\nPress Ctrl+C to stop the service")
    
    try:
        # Keep the service running
        process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Stopping ChainSureAI Service...")
        process.terminate()
        print("✅ Service stopped")

if __name__ == "__main__":
    main() 