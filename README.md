# ChainSure - Community-Governed Mutual Insurance Platform

A revolutionary blockchain-native insurance platform built on Binance Smart Chain with AI-powered claims processing and transparent governance.

📄 **Whitepaper**  
[👉 View the document here](https://chainsure-ai.tiiny.site/)


## 🚀 Features

- **Blockchain-Native Insurance**: Smart contracts for policy creation and claims processing  
- **AI-Powered Analysis**: Advanced fraud detection and document processing  
- **Community Governance**: Decentralized decision-making for claims approval  
- **NFT Policies**: Unique policy tokens with metadata  
- **Real-time Analytics**: Comprehensive dashboard with insights  
- **Multi-Chain Support**: Built on BSC with cross-chain capabilities  

## 🏗️ Architecture

The platform consists of three main services:

1. **Frontend** (Next.js) - User interface and Web3 integration  
2. **Backend** (NestJS) - API gateway and business logic  
3. **AI Service** (FastAPI) - Document analysis and fraud detection  

## 📋 Prerequisites

- Node.js 18+ and npm  
- Python 3.9+  
- Git  
- MetaMask or compatible Web3 wallet  
- BSC Testnet BNB for gas fees  

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chainsure
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### AI Service Dependencies
```bash
cd ../ai-service
pip install -r requirements.txt
```

### 3. Environment Configuration

#### Backend Environment (`backend/.env`)
```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=
AI_SERVICE_URL=
AI_SERVICE_API_KEY=chainsure_backend_key_2024
BLOCKCHAIN_PRIVATE_KEY=your_private_key_here
DATABASE_PATH=db/chainsure.db
JWT_SECRET=your_jwt_secret_here
```

#### AI Service Environment (`ai-service/.env`)
```env
API_KEY=chainsure_dev_key_2024
LOG_LEVEL=INFO
GOOGLE_API_KEY=your_google_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

#### Frontend Environment (`frontend/.env.local`)
```env
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_AI_SERVICE_URL=
NEXT_PUBLIC_CHAIN_ID=97
NEXT_PUBLIC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
```

## 🚀 Quick Start

### Option 1: Automated Startup (Recommended)

```bash
# Windows PowerShell
.\start-services.ps1

# Linux/Mac
chmod +x start-services.sh
./start-services.sh
```

### Option 2: Manual Startup

#### Start AI Service
```bash
cd ai-service
python -m uvicorn main:app --host 0.0.0.0 --port 8001
```

#### Start Backend
```bash
cd backend
npm run start:dev
```

#### Start Frontend
```bash
cd frontend
npm run dev
```

## 📱 Usage

### 1. Connect Wallet
- Open the frontend in your browser  
- Connect your MetaMask wallet  
- Switch to BSC Testnet  

### 2. Create Policy
- Navigate to **Policies** section  
- Choose policy type (Health, Vehicle, etc.)  
- Set coverage amount and duration  
- Confirm transaction  

### 3. Submit Claim
- Go to **Claims** section  
- Upload supporting documents  
- AI will analyze and provide fraud score  
- Community voting determines approval  

### 4. Participate in Governance
- Vote on pending claims  
- Create and vote on proposals  
- Earn rewards for participation  

## 🔧 Development

### Backend
```bash
cd backend
npm run start:dev
npm run build
npm run test
```

### Frontend
```bash
cd frontend
npm run dev
npm run build
npm run lint
```

### AI Service
```bash
cd ai-service
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

## 🧪 Testing

### Backend
```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend
```bash
cd frontend
npm run test
```

### AI Service
```bash
cd ai-service
python -m pytest tests/
```

## 🔒 Security

- All API endpoints are protected with JWT authentication  
- Rate limiting is enabled on all endpoints  
- CORS is configured for secure cross-origin requests  
- Input validation and sanitization on all endpoints  

## 🐳 Docker Deployment

### Build Images
```bash
# Backend
cd backend
docker build -t chainsure-backend .

# AI Service
cd ../ai-service
docker build -t chainsure-ai-service .

# Frontend
cd ../frontend
docker build -t chainsure-frontend .
```

### Run with Docker Compose
```bash
docker-compose up -d
```

## 📈 Monitoring

### Health Checks
- Backend: `/api/v1/health`  
- AI Service: `/health`  
- Frontend: Built-in Next.js health check  

### Logs
- Backend logs: `backend/logs/`  
- AI Service logs: `ai-service/logs/`  
- Frontend logs: Console output  

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch  
3. Make your changes  
4. Add tests  
5. Submit a pull request  

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Check the documentation in the `docs/` directory  
- Create an issue for bugs or feature requests  

---

**Note**: This is a development version. For production deployment, ensure proper security configurations and environment variables.
