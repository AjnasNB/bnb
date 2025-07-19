#!/usr/bin/env python3
"""
ChainSureAI Master Startup Script
Starts all services: Backend, Frontend, AI Service, and Blockchain
"""

import os
import sys
import subprocess
import time
import requests
import threading
import signal
from pathlib import Path

class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

class ServiceManager:
    def __init__(self):
        self.processes = {}
        self.services = {
            'backend': {
                'name': 'Backend (NestJS)',
                'port': 3001,
                'command': ['npm', 'run', 'start:dev'],
                'dir': 'backend',
                'health_url': 'http://localhost:3001/health',
                'icon': '🏗️'
            },
            'frontend': {
                'name': 'Frontend (Next.js)',
                'port': 3000,
                'command': ['npm', 'run', 'dev'],
                'dir': 'frontend', 
                'health_url': 'http://localhost:3000',
                'icon': '🌐'
            },
            'ai-service': {
                'name': 'AI Service (FastAPI)',
                'port': 8001,
                'command': ['python', '-m', 'uvicorn', 'main:app', '--reload', '--host', '0.0.0.0', '--port', '8001'],
                'dir': 'ai-service',
                'health_url': 'http://localhost:8001/health',
                'icon': '🤖'
            }
        }
        
    def print_banner(self):
        print(f"""
{Colors.BLUE}{'='*60}{Colors.END}
{Colors.BOLD}{Colors.CYAN}          🚀 ChainSureAI Platform Startup{Colors.END}
{Colors.BLUE}{'='*60}{Colors.END}

{Colors.PURPLE}🔗 Blockchain Insurance Platform with AI Processing{Colors.END}
{Colors.WHITE}📊 Backend + Frontend + AI Service + Blockchain{Colors.END}

""")

    def check_dependencies(self):
        """Check if required dependencies are available"""
        print(f"{Colors.YELLOW}🔍 Checking dependencies...{Colors.END}")
        
        dependencies = [
            ('node', 'node --version'),
            ('npm', 'npm --version'),
            ('python', 'python --version'),
            ('pip', 'pip --version')
        ]
        
        missing = []
        for name, cmd in dependencies:
            try:
                result = subprocess.run(cmd.split(), capture_output=True, text=True, shell=True)
                if result.returncode == 0:
                    version = result.stdout.strip().split('\n')[0]
                    print(f"  ✅ {name}: {version}")
                else:
                    print(f"  ❌ {name}: Command failed with return code {result.returncode}")
                    if result.stderr:
                        print(f"     Error: {result.stderr.strip()}")
                    missing.append(name)
            except FileNotFoundError as e:
                print(f"  ❌ {name}: File not found - {e}")
                missing.append(name)
            except Exception as e:
                print(f"  ❌ {name}: Unexpected error - {e}")
                missing.append(name)
        
        if missing:
            print(f"{Colors.RED}❌ Missing dependencies: {', '.join(missing)}{Colors.END}")
            return False
        
        return True

    def check_ports(self):
        """Check if required ports are available"""
        print(f"{Colors.YELLOW}🔌 Checking port availability...{Colors.END}")
        
        import socket
        for service_name, config in self.services.items():
            port = config['port']
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                result = sock.connect_ex(('localhost', port))
                if result == 0:
                    print(f"  ⚠️  Port {port} is already in use ({config['name']})")
                else:
                    print(f"  ✅ Port {port} available ({config['name']})")

    def install_dependencies(self):
        """Install dependencies for all services"""
        print(f"{Colors.YELLOW}📦 Installing dependencies...{Colors.END}")
        
        for service_name, config in self.services.items():
            service_dir = config['dir']
            if not os.path.exists(service_dir):
                print(f"  ❌ Directory {service_dir} not found")
                continue
                
            print(f"  📦 Installing {config['name']} dependencies...")
            
            if service_name == 'ai-service':
                # Python dependencies
                requirements_file = os.path.join(service_dir, 'requirements.txt')
                if os.path.exists(requirements_file):
                    result = subprocess.run([
                        sys.executable, '-m', 'pip', 'install', '-r', requirements_file
                    ], cwd=service_dir, capture_output=True, text=True)
                    if result.returncode == 0:
                        print(f"    ✅ Python dependencies installed")
                    else:
                        print(f"    ❌ Failed to install Python dependencies")
                        print(f"    Error: {result.stderr}")
            else:
                # Node.js dependencies
                package_json = os.path.join(service_dir, 'package.json')
                if os.path.exists(package_json):
                    result = subprocess.run(['npm', 'install'], cwd=service_dir, capture_output=True, text=True, shell=True)
                    if result.returncode == 0:
                        print(f"    ✅ Node.js dependencies installed")
                    else:
                        print(f"    ❌ Failed to install Node.js dependencies")
                        print(f"    Error: {result.stderr}")

    def start_service(self, service_name, config):
        """Start a single service"""
        try:
            print(f"  🚀 Starting {config['icon']} {config['name']}...")
            
            service_dir = config['dir']
            if not os.path.exists(service_dir):
                print(f"    ❌ Directory {service_dir} not found")
                return None
            
            # Start the process
            process = subprocess.Popen(
                config['command'],
                cwd=service_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                universal_newlines=True,
                shell=True
            )
            
            self.processes[service_name] = process
            
            # Wait a moment for startup
            time.sleep(3)
            
            # Check if process is still running
            if process.poll() is None:
                print(f"    ✅ {config['name']} started (PID: {process.pid})")
                return process
            else:
                stdout, stderr = process.communicate()
                print(f"    ❌ {config['name']} failed to start")
                if stderr:
                    print(f"    Error: {stderr}")
                return None
                
        except Exception as e:
            print(f"    ❌ Error starting {config['name']}: {e}")
            return None

    def check_service_health(self, service_name, config, timeout=30):
        """Check if service is healthy"""
        health_url = config.get('health_url')
        if not health_url:
            return True
            
        print(f"    🩺 Checking health for {config['name']}...")
        
        for attempt in range(timeout):
            try:
                if service_name == 'ai-service':
                    # AI service requires API key
                    headers = {'Authorization': 'Bearer chainsure_dev_key_2024'}
                    response = requests.get(health_url, headers=headers, timeout=5)
                else:
                    response = requests.get(health_url, timeout=5)
                    
                if response.status_code == 200:
                    print(f"    ✅ {config['name']} is healthy!")
                    return True
            except requests.exceptions.RequestException:
                if attempt < timeout - 1:
                    time.sleep(1)
                else:
                    print(f"    ⚠️  {config['name']} health check timeout")
                    return False
        
        return False

    def start_all_services(self):
        """Start all services"""
        print(f"{Colors.GREEN}🚀 Starting all services...{Colors.END}")
        
        # Start services in order (backend first, then others)
        start_order = ['backend', 'ai-service', 'frontend']
        
        for service_name in start_order:
            if service_name in self.services:
                config = self.services[service_name]
                process = self.start_service(service_name, config)
                
                if process:
                    # Wait a bit more for the service to fully start
                    time.sleep(5)
                    
                    # Check health
                    self.check_service_health(service_name, config)
                else:
                    print(f"    ❌ Failed to start {config['name']}")

    def display_status(self):
        """Display the status of all services"""
        print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
        print(f"{Colors.BOLD}{Colors.GREEN}🎉 ChainSureAI Platform Status{Colors.END}")
        print(f"{Colors.BLUE}{'='*60}{Colors.END}")
        
        for service_name, config in self.services.items():
            if service_name in self.processes and self.processes[service_name].poll() is None:
                status = f"{Colors.GREEN}🟢 Running{Colors.END}"
                port_info = f"Port {config['port']}"
            else:
                status = f"{Colors.RED}🔴 Stopped{Colors.END}"
                port_info = f"Port {config['port']} (Not running)"
                
            print(f"  {config['icon']} {config['name']:<20} {status} - {port_info}")
        
        print(f"\n{Colors.CYAN}📱 Access URLs:{Colors.END}")
        if 'frontend' in self.processes and self.processes['frontend'].poll() is None:
            print(f"  🌐 Frontend:     {Colors.BOLD}http://localhost:3000{Colors.END}")
        if 'backend' in self.processes and self.processes['backend'].poll() is None:
            print(f"  🏗️  Backend API:  {Colors.BOLD}http://localhost:3001{Colors.END}")
            print(f"  📚 API Docs:     {Colors.BOLD}http://localhost:3001/api/docs{Colors.END}")
        if 'ai-service' in self.processes and self.processes['ai-service'].poll() is None:
            print(f"  🤖 AI Service:   {Colors.BOLD}http://localhost:8001{Colors.END}")
            print(f"  📖 AI Docs:      {Colors.BOLD}http://localhost:8001/docs{Colors.END}")
        
        print(f"\n{Colors.YELLOW}🔑 API Keys:{Colors.END}")
        print(f"  Backend: No key required for development")
        print(f"  AI Service: chainsure_dev_key_2024")
        
        print(f"\n{Colors.PURPLE}💡 Next Steps:{Colors.END}")
        print(f"  1. Open http://localhost:3000 in your browser")
        print(f"  2. Connect your MetaMask wallet")
        print(f"  3. Switch to BSC Testnet")
        print(f"  4. Get test BNB from faucet")
        print(f"  5. Start creating policies and claims!")
        
        print(f"\n{Colors.RED}🛑 Press Ctrl+C to stop all services{Colors.END}")

    def stop_all_services(self):
        """Stop all running services"""
        print(f"\n{Colors.YELLOW}🛑 Stopping all services...{Colors.END}")
        
        for service_name, process in self.processes.items():
            if process and process.poll() is None:
                config = self.services[service_name]
                print(f"  🛑 Stopping {config['icon']} {config['name']}...")
                
                try:
                    process.terminate()
                    process.wait(timeout=5)
                    print(f"    ✅ {config['name']} stopped gracefully")
                except subprocess.TimeoutExpired:
                    print(f"    ⚠️  Force killing {config['name']}...")
                    process.kill()
                    process.wait()
                    print(f"    ✅ {config['name']} killed")
        
        print(f"{Colors.GREEN}✅ All services stopped{Colors.END}")

def signal_handler(signum, frame, manager):
    """Handle Ctrl+C gracefully"""
    manager.stop_all_services()
    sys.exit(0)

def main():
    """Main startup function"""
    manager = ServiceManager()
    
    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, lambda s, f: signal_handler(s, f, manager))
    
    manager.print_banner()
    
    # Check if we're in the right directory
    required_dirs = ['backend', 'frontend', 'ai-service']
    missing_dirs = [d for d in required_dirs if not os.path.exists(d)]
    
    if missing_dirs:
        print(f"{Colors.RED}❌ Missing directories: {', '.join(missing_dirs)}{Colors.END}")
        print("Please run this script from the project root directory.")
        sys.exit(1)
    
    # Check dependencies
    if not manager.check_dependencies():
        print(f"\n{Colors.RED}❌ Missing dependencies. Please install them and try again.{Colors.END}")
        print(f"\n{Colors.YELLOW}Installation instructions:{Colors.END}")
        print("Ubuntu/Debian: sudo apt-get install nodejs npm python3 python3-pip")
        print("macOS: brew install node python")
        print("Windows: Download from nodejs.org and python.org")
        sys.exit(1)
    
    # Check ports
    manager.check_ports()
    
    # Install dependencies
    manager.install_dependencies()
    
    # Start all services
    manager.start_all_services()
    
    # Display status
    manager.display_status()
    
    try:
        # Keep the script running
        while True:
            time.sleep(1)
            # Check if any service died
            for service_name, process in manager.processes.items():
                if process and process.poll() is not None:
                    config = manager.services[service_name]
                    print(f"\n{Colors.RED}❌ {config['name']} has stopped unexpectedly!{Colors.END}")
    
    except KeyboardInterrupt:
        manager.stop_all_services()

if __name__ == "__main__":
    main() 