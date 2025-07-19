# 🚀 Individual Service Commands

## Prerequisites
- Node.js v22.11.0+ installed
- Python 3.11.0+ installed  
- npm 11.3.0+ installed
- All dependencies installed

## 📱 Frontend (Next.js)
```bash
cd frontend
npm run dev
```
**Access:** http://localhost:3000

## 🏗️ Backend (NestJS)
```bash
cd backend
npm run start:dev
```
**Access:** 
- API: http://localhost:3001
- Docs: http://localhost:3001/api/docs

## 🤖 AI Service (FastAPI)
```bash
cd ai-service
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```
**Access:**
- API: http://localhost:8001
- Docs: http://localhost:8001/docs
- **API Key:** `chainsure_dev_key_2024`

## 🔗 Blockchain Development
```bash
cd blockchain
npx hardhat node                    # Start local blockchain
npx hardhat run scripts/deploy.js  # Deploy contracts
npx hardhat test                    # Run tests
```

## 🛠️ Dependency Installation

### Frontend Dependencies
```bash
cd frontend
npm install
```

### Backend Dependencies  
```bash
cd backend
npm install
```

### AI Service Dependencies
```bash
cd ai-service
pip install -r requirements.txt
```

### Blockchain Dependencies
```bash
cd blockchain  
npm install
```

## 🔧 Build Commands

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Build
```bash
cd backend
npm run build
```

## ⚡ Quick Start All Services

### Option 1: Master Script (Fixed)
```bash
python start-all.py
```

### Option 2: Manual (3 terminals)
**Terminal 1 - Frontend:**
```bash
cd frontend && npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend && npm run start:dev
```

**Terminal 3 - AI Service:**
```bash
cd ai-service && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

## 🎯 Testing Commands

### Backend Tests
```bash
cd backend
npm run test
```

### Blockchain Tests
```bash
cd blockchain
npx hardhat test
```

## 📊 Service Status Check
```bash
# Check if services are running
netstat -an | findstr ":3000"  # Frontend
netstat -an | findstr ":3001"  # Backend  
netstat -an | findstr ":8001"  # AI Service
```

## 🔑 API Keys & Authentication

- **Backend:** No key required for development
- **AI Service:** `chainsure_dev_key_2024`
- **MetaMask:** BSC Testnet (Chain ID: 97)

## 📱 Web3 Setup

1. Install MetaMask
2. Add BSC Testnet network
3. Get test BNB from faucet
4. Connect wallet on frontend

---
**🎉 All services fixed and ready to run!** 