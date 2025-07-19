# ChainSureAI - Complete Setup Guide

🚀 **Complete blockchain-based insurance platform with AI-powered claim processing**

## 🏗️ Architecture Overview

```
ChainSureAI Platform
├── Frontend (Next.js + Web3)     - Port 3000
├── Backend (NestJS + MongoDB)    - Port 3001
├── AI Service (FastAPI)          - Port 8001
└── Blockchain (Hardhat + BSC)    - Local/Testnet
```

## 📋 Prerequisites

### System Requirements
- **Node.js** 18+ and npm
- **Python** 3.9+ and pip
- **MongoDB** (local or Atlas)
- **Git**

### For AI Service (Optional but Recommended)
- **Tesseract OCR**
- **OpenCV** dependencies

### Installation Commands

#### Ubuntu/Debian
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Python & AI dependencies
sudo apt-get install -y python3 python3-pip tesseract-ocr tesseract-ocr-eng
sudo apt-get install -y libgl1-mesa-glx libglib2.0-0 libsm6 libxext6 libxrender-dev

# MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update && sudo apt-get install -y mongodb-org
```

#### macOS
```bash
# Using Homebrew
brew install node python mongodb-community tesseract

# Start MongoDB
brew services start mongodb-community
```

#### Windows
1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Install Python from [python.org](https://python.org/)
3. Install MongoDB from [mongodb.com](https://www.mongodb.com/)
4. Install Tesseract from [GitHub releases](https://github.com/UB-Mannheim/tesseract/wiki)

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd bnb

# Make startup scripts executable (Linux/Mac)
chmod +x start-*.py
chmod +x start-all.sh
```

### 2. Install Dependencies
```bash
# Backend
cd backend && npm install && cd ..

# Frontend  
cd frontend && npm install && cd ..

# AI Service
cd ai-service && pip install -r requirements.txt && cd ..

# Blockchain
cd blockchain && npm install && cd ..
```

### 3. Environment Setup
```bash
# Copy environment files
cp backend/.env.example backend/.env
cp ai-service/.env.example ai-service/.env

# Edit configuration as needed
nano backend/.env
nano ai-service/.env
```

### 4. Start All Services
```bash
# Option 1: Individual services
python start-backend.py    # Terminal 1
python start-frontend.py   # Terminal 2  
python start-ai-service.py # Terminal 3

# Option 2: All at once (Linux/Mac)
./start-all.sh

# Option 3: Docker (if available)
docker-compose up -d
```

## 🔧 Detailed Configuration

### Backend Configuration (`backend/.env`)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/chainsure
DATABASE_URL=mongodb://localhost:27017/chainsure

# Server
PORT=3001
NODE_ENV=development

# JWT & Security  
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Blockchain
RPC_URL_BSC=https://bsc-dataseed.binance.org/
RPC_URL_BSC_TESTNET=https://data-seed-prebsc-1-s1.binance.org:8545/
PRIVATE_KEY=your-deployment-private-key
CONTRACT_ADDRESS_INSURANCE=0x...
CONTRACT_ADDRESS_TOKEN=0x...

# AI Service
AI_SERVICE_URL=http://localhost:8001
AI_SERVICE_API_KEY=chainsure_dev_key_2024

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=50MB
```

### AI Service Configuration (`ai-service/.env`)
```env
# Service
PORT=8001
LOG_LEVEL=INFO

# API Keys
BACKEND_API_KEY=chainsure_dev_key_2024
ADMIN_API_KEY=chainsure_admin_key_2024
TEST_API_KEY=chainsure_test_key_2024

# Processing
USE_GPU=false
TESSERACT_PATH=/usr/bin/tesseract
MAX_FILE_SIZE_MB=50
PROCESSING_TIMEOUT_SECONDS=300
```

### Frontend Configuration (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8001
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-walletconnect-id
```

## 📱 Service URLs

Once running, access the services at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Backend Docs**: http://localhost:3001/api/docs
- **AI Service**: http://localhost:8001
- **AI Service Docs**: http://localhost:8001/docs

## 🧪 Testing the Platform

### 1. Health Checks
```bash
# Backend
curl http://localhost:3001/health

# AI Service  
curl -H "Authorization: Bearer chainsure_dev_key_2024" http://localhost:8001/health

# Frontend
curl http://localhost:3000
```

### 2. API Testing
```bash
# Test claim analysis
curl -X POST http://localhost:8001/analyze-claim \
  -H "Authorization: Bearer chainsure_dev_key_2024" \
  -H "Content-Type: application/json" \
  -d '{
    "claimId": "test_001",
    "claimType": "health", 
    "requestedAmount": 1500,
    "description": "Emergency medical treatment"
  }'
```

### 3. Web3 Testing
1. Open http://localhost:3000
2. Connect MetaMask wallet
3. Switch to BSC Testnet
4. Get test BNB from faucet
5. Test policy creation and claims

## 🔗 Blockchain Setup

### 1. Network Configuration
Add BSC networks to MetaMask:

**BSC Mainnet**
- Network Name: Binance Smart Chain
- RPC URL: https://bsc-dataseed.binance.org/
- Chain ID: 56
- Symbol: BNB
- Explorer: https://bscscan.com

**BSC Testnet**  
- Network Name: BSC Testnet
- RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
- Chain ID: 97
- Symbol: BNB
- Explorer: https://testnet.bscscan.com

### 2. Deploy Contracts
```bash
cd blockchain

# Compile contracts
npx hardhat compile

# Deploy to testnet
npx hardhat run scripts/deploy.js --network bscTestnet

# Verify contracts
npx hardhat verify --network bscTestnet <contract-address>
```

### 3. Get Test Tokens
- Visit BSC Testnet Faucet: https://testnet.binance.org/faucet-smart
- Enter your wallet address
- Receive test BNB

## 📊 Features Overview

### Core Features
- ✅ **Wallet Integration**: MetaMask, WalletConnect
- ✅ **Smart Contracts**: ERC721 policies, claims processing
- ✅ **AI Processing**: OCR, fraud detection, image analysis
- ✅ **Multi-Insurance**: Health, Vehicle, Travel, Agricultural
- ✅ **Admin Dashboard**: Policy management, analytics
- ✅ **Real-time Updates**: WebSocket notifications

### Insurance Types
1. **Health Insurance**: Medical claims with AI validation
2. **Vehicle Insurance**: Damage assessment with computer vision
3. **Travel Insurance**: Real-time claim processing
4. **Agricultural Insurance**: IoT and satellite data integration

### AI Capabilities
- **Document OCR**: Extract text from PDFs/images
- **Fraud Detection**: ML-based risk assessment  
- **Image Analysis**: Authenticity verification
- **Damage Assessment**: Automated cost estimation

## 🛠️ Development

### Adding New Features
1. **Backend**: Add endpoints in `backend/src/`
2. **Frontend**: Create components in `frontend/app/`
3. **AI Service**: Extend services in `ai-service/services/`
4. **Blockchain**: Update contracts in `blockchain/contracts/`

### Testing
```bash
# Backend tests
cd backend && npm test

# Frontend tests  
cd frontend && npm test

# AI Service tests
cd ai-service && python -m pytest

# Blockchain tests
cd blockchain && npx hardhat test
```

### Building for Production
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build

# AI Service (Docker)
cd ai-service && docker build -t chainsure-ai .
```

## 🚨 Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

**2. AI Service Dependencies Missing**
```bash
# Install system dependencies
sudo apt-get install tesseract-ocr tesseract-ocr-eng
pip install -r ai-service/requirements.txt
```

**3. Blockchain Connection Issues**
- Check RPC URLs in environment
- Ensure wallet has test BNB
- Verify network configuration

**4. Port Conflicts**
```bash
# Find process using port
lsof -i :3000  # or :3001, :8001

# Kill process
kill -9 <PID>
```

### Performance Optimization
- Enable AI service GPU acceleration
- Use MongoDB indices for large datasets
- Implement Redis for caching
- Use CDN for frontend assets

## 📝 API Documentation

### Backend API
- **Swagger**: http://localhost:3001/api/docs
- **Endpoints**: Authentication, policies, claims, users

### AI Service API
- **Swagger**: http://localhost:8001/docs  
- **Endpoints**: Document processing, fraud detection, image analysis

## 🔐 Security

### Production Checklist
- [ ] Change default API keys and secrets
- [ ] Enable HTTPS with SSL certificates  
- [ ] Set up rate limiting and DDoS protection
- [ ] Configure firewall rules
- [ ] Enable MongoDB authentication
- [ ] Set up monitoring and alerting
- [ ] Regular security audits

### Environment Security
```bash
# Secure environment files
chmod 600 backend/.env ai-service/.env

# Generate secure secrets
openssl rand -hex 32  # For JWT_SECRET
```

## 📈 Monitoring & Analytics

### Health Monitoring
- Backend: `/health` endpoint
- AI Service: `/health` endpoint  
- Database: Connection status
- Blockchain: Network status

### Analytics
- User engagement metrics
- Claim processing statistics
- AI model performance
- Financial analytics

## 🤝 Support

### Getting Help
1. Check this documentation
2. Review service logs in `logs/` directories
3. Test API endpoints with provided examples
4. Check blockchain explorer for transaction status

### Development Team
- **Architecture**: Full-stack blockchain insurance platform
- **Technologies**: Next.js, NestJS, FastAPI, Solidity, AI/ML
- **Focus**: Decentralized insurance with AI automation

---

🎉 **Congratulations!** You now have a complete blockchain insurance platform with AI-powered claim processing running locally.

For production deployment, follow the security checklist and consider using cloud services like AWS, Azure, or Google Cloud for scalability. 