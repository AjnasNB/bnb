from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
from dotenv import load_dotenv
from loguru import logger
import asyncio

# Load environment variables
load_dotenv()

# Import our services
from services.ocr_service import OCRService
from services.fraud_detection_service import FraudDetectionService
from services.image_analysis_service import ImageAnalysisService
from services.document_validator import DocumentValidator
from models.analysis_models import (
    ClaimAnalysisRequest,
    ClaimAnalysisResponse,
    DocumentProcessingRequest,
    DocumentProcessingResponse,
    HealthAnalysisRequest,
    VehicleAnalysisRequest
)
from utils.auth import verify_api_key
from utils.logger import setup_logger

# Setup logging
setup_logger()

# Initialize FastAPI app
app = FastAPI(
    title="ChainSureAI - AI Processing Service",
    description="AI-powered document processing, OCR, and fraud detection for insurance claims",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize services
ocr_service = OCRService()
fraud_service = FraudDetectionService()
image_service = ImageAnalysisService()
doc_validator = DocumentValidator()

@app.on_event("startup")
async def startup_event():
    """Initialize AI models on startup"""
    logger.info("🚀 Starting ChainSureAI AI Service...")
    
    # Initialize all services
    await ocr_service.initialize()
    await fraud_service.initialize()
    await image_service.initialize()
    
    logger.info("✅ AI Service initialized successfully!")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("🛑 Shutting down AI Service...")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "ChainSureAI AI Processing Service",
        "status": "healthy",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "analyze_claim": "/analyze-claim",
            "process_document": "/process-document",
            "analyze_image": "/analyze-image"
        }
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "ocr": ocr_service.is_ready(),
            "fraud_detection": fraud_service.is_ready(),
            "image_analysis": image_service.is_ready(),
            "document_validator": doc_validator.is_ready()
        },
        "models_loaded": {
            "tesseract": ocr_service.tesseract_ready,
            "easyocr": ocr_service.easyocr_ready,
            "fraud_model": fraud_service.model_ready,
            "image_model": image_service.model_ready
        }
    }

@app.post("/analyze-claim", response_model=ClaimAnalysisResponse)
async def analyze_claim(
    request: ClaimAnalysisRequest,
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """
    Complete claim analysis including document processing, fraud detection, and amount estimation
    """
    try:
        # Verify API key
        await verify_api_key(credentials.credentials)
        
        logger.info(f"🔍 Analyzing claim {request.claimId} of type {request.claimType}")
        
        # Initialize analysis results
        analysis_results = {
            "claimId": request.claimId,
            "claimType": request.claimType,
            "fraudScore": 0.0,
            "authenticityScore": 1.0,
            "estimatedAmount": 0,
            "confidence": 0.0,
            "detectedIssues": [],
            "ocrResults": {},
            "imageAnalysis": {},
            "documentValidation": {},
            "recommendation": "review"
        }
        
        # Process documents if provided
        if request.documents:
            logger.info(f"📄 Processing {len(request.documents)} documents")
            doc_results = await process_documents_batch(request.documents)
            analysis_results["ocrResults"] = doc_results
            
            # Extract text for fraud analysis
            extracted_text = " ".join([doc.get("text", "") for doc in doc_results.values()])
            
            # Run fraud detection on extracted text
            fraud_result = await fraud_service.analyze_text(
                extracted_text, 
                request.claimType, 
                request.requestedAmount
            )
            analysis_results["fraudScore"] = fraud_result["fraud_score"]
            analysis_results["detectedIssues"].extend(fraud_result["issues"])
        
        # Process images if provided
        if request.images:
            logger.info(f"🖼️ Processing {len(request.images)} images")
            img_results = await process_images_batch(request.images, request.claimType)
            analysis_results["imageAnalysis"] = img_results
            
            # Update authenticity score based on image analysis
            avg_authenticity = sum([img.get("authenticity_score", 1.0) for img in img_results.values()]) / len(img_results)
            analysis_results["authenticityScore"] = avg_authenticity
        
        # Estimate claim amount based on type and evidence
        estimated_amount = await estimate_claim_amount(
            request.claimType,
            request.requestedAmount,
            analysis_results["ocrResults"],
            analysis_results["imageAnalysis"],
            request.description
        )
        analysis_results["estimatedAmount"] = estimated_amount
        
        # Calculate overall confidence
        confidence = calculate_confidence_score(analysis_results)
        analysis_results["confidence"] = confidence
        
        # Make recommendation
        recommendation = make_recommendation(analysis_results)
        analysis_results["recommendation"] = recommendation
        
        logger.info(f"✅ Claim analysis completed: fraud={analysis_results['fraudScore']:.2f}, confidence={confidence:.2f}")
        
        return ClaimAnalysisResponse(**analysis_results)
        
    except Exception as e:
        logger.error(f"❌ Error analyzing claim: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/process-document", response_model=DocumentProcessingResponse)
async def process_document(
    file: UploadFile = File(...),
    document_type: str = "general",
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """
    Process a single document with OCR and validation
    """
    try:
        await verify_api_key(credentials.credentials)
        
        logger.info(f"📄 Processing document: {file.filename} (type: {document_type})")
        
        # Read file content
        content = await file.read()
        
        # Process with OCR
        ocr_result = await ocr_service.process_document(content, file.filename, document_type)
        
        # Validate document
        validation_result = await doc_validator.validate_document(
            content, 
            file.filename, 
            document_type,
            ocr_result["text"]
        )
        
        result = {
            "filename": file.filename,
            "document_type": document_type,
            "text": ocr_result["text"],
            "confidence": ocr_result["confidence"],
            "metadata": ocr_result["metadata"],
            "validation": validation_result,
            "processing_time": ocr_result["processing_time"]
        }
        
        logger.info(f"✅ Document processed successfully: {file.filename}")
        return DocumentProcessingResponse(**result)
        
    except Exception as e:
        logger.error(f"❌ Error processing document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Document processing failed: {str(e)}")

@app.post("/analyze-image")
async def analyze_image(
    file: UploadFile = File(...),
    analysis_type: str = "general",
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """
    Analyze image for authenticity, damage assessment, etc.
    """
    try:
        await verify_api_key(credentials.credentials)
        
        logger.info(f"🖼️ Analyzing image: {file.filename} (type: {analysis_type})")
        
        # Read file content
        content = await file.read()
        
        # Analyze image
        result = await image_service.analyze_image(content, file.filename, analysis_type)
        
        logger.info(f"✅ Image analyzed successfully: {file.filename}")
        return result
        
    except Exception as e:
        logger.error(f"❌ Error analyzing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")

@app.post("/batch-process")
async def batch_process_documents(
    files: List[UploadFile] = File(...),
    document_types: List[str] = None,
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """
    Process multiple documents in batch
    """
    try:
        await verify_api_key(credentials.credentials)
        
        logger.info(f"📄 Batch processing {len(files)} documents")
        
        if document_types and len(document_types) != len(files):
            raise HTTPException(status_code=400, detail="Document types list must match files list length")
        
        results = []
        for i, file in enumerate(files):
            doc_type = document_types[i] if document_types else "general"
            content = await file.read()
            
            # Process each document
            ocr_result = await ocr_service.process_document(content, file.filename, doc_type)
            validation_result = await doc_validator.validate_document(
                content, file.filename, doc_type, ocr_result["text"]
            )
            
            results.append({
                "filename": file.filename,
                "document_type": doc_type,
                "text": ocr_result["text"],
                "confidence": ocr_result["confidence"],
                "validation": validation_result
            })
        
        logger.info(f"✅ Batch processing completed: {len(results)} documents")
        return {"results": results, "total_processed": len(results)}
        
    except Exception as e:
        logger.error(f"❌ Error in batch processing: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Batch processing failed: {str(e)}")

# Helper functions
async def process_documents_batch(document_hashes: List[str]) -> Dict[str, Any]:
    """Process multiple documents from IPFS hashes"""
    results = {}
    for doc_hash in document_hashes:
        try:
            # In a real implementation, fetch from IPFS
            # For now, simulate processing
            results[doc_hash] = {
                "text": f"Processed document content for {doc_hash}",
                "confidence": 0.95,
                "document_type": "medical_bill",
                "extracted_amount": 1500.00
            }
        except Exception as e:
            logger.error(f"Error processing document {doc_hash}: {e}")
            results[doc_hash] = {"error": str(e)}
    
    return results

async def process_images_batch(image_hashes: List[str], claim_type: str) -> Dict[str, Any]:
    """Process multiple images from IPFS hashes"""
    results = {}
    for img_hash in image_hashes:
        try:
            # In a real implementation, fetch from IPFS
            # For now, simulate processing
            results[img_hash] = {
                "authenticity_score": 0.92,
                "damage_assessment": "moderate_damage" if claim_type == "vehicle" else "visible_injury",
                "estimated_cost": 2000.00,
                "confidence": 0.88
            }
        except Exception as e:
            logger.error(f"Error processing image {img_hash}: {e}")
            results[img_hash] = {"error": str(e)}
    
    return results

async def estimate_claim_amount(
    claim_type: str,
    requested_amount: float,
    ocr_results: Dict,
    image_results: Dict,
    description: str
) -> float:
    """Estimate appropriate claim amount based on evidence"""
    try:
        # Extract amounts from documents
        doc_amounts = []
        for doc_data in ocr_results.values():
            if isinstance(doc_data, dict) and "extracted_amount" in doc_data:
                doc_amounts.append(doc_data["extracted_amount"])
        
        # Extract amounts from image analysis
        img_amounts = []
        for img_data in image_results.values():
            if isinstance(img_data, dict) and "estimated_cost" in img_data:
                img_amounts.append(img_data["estimated_cost"])
        
        # Calculate base estimate
        if doc_amounts:
            base_estimate = max(doc_amounts)
        elif img_amounts:
            base_estimate = max(img_amounts)
        else:
            # Use claim type based estimation
            base_estimate = estimate_by_claim_type(claim_type, description)
        
        # Adjust based on requested amount
        if base_estimate > requested_amount * 1.5:
            # Estimated amount is much higher than requested, cap it
            return min(base_estimate, requested_amount * 1.2)
        elif base_estimate < requested_amount * 0.5:
            # Estimated amount is much lower than requested, investigate
            return base_estimate
        else:
            # Reasonable range
            return base_estimate
            
    except Exception as e:
        logger.error(f"Error estimating claim amount: {e}")
        return requested_amount * 0.8  # Conservative estimate

def estimate_by_claim_type(claim_type: str, description: str) -> float:
    """Estimate amount based on claim type and description"""
    base_estimates = {
        "health": 1000.0,
        "vehicle": 2500.0,
        "travel": 500.0,
        "product_warranty": 300.0,
        "pet": 800.0,
        "agricultural": 5000.0
    }
    
    base = base_estimates.get(claim_type, 1000.0)
    
    # Adjust based on description keywords
    if any(word in description.lower() for word in ["emergency", "urgent", "critical"]):
        base *= 1.5
    elif any(word in description.lower() for word in ["minor", "small", "slight"]):
        base *= 0.7
    
    return base

def calculate_confidence_score(analysis_results: Dict) -> float:
    """Calculate overall confidence score for the analysis"""
    try:
        scores = []
        
        # OCR confidence
        if analysis_results["ocrResults"]:
            ocr_confidences = [
                doc.get("confidence", 0.5) 
                for doc in analysis_results["ocrResults"].values() 
                if isinstance(doc, dict)
            ]
            if ocr_confidences:
                scores.append(sum(ocr_confidences) / len(ocr_confidences))
        
        # Image analysis confidence
        if analysis_results["imageAnalysis"]:
            img_confidences = [
                img.get("confidence", 0.5) 
                for img in analysis_results["imageAnalysis"].values() 
                if isinstance(img, dict)
            ]
            if img_confidences:
                scores.append(sum(img_confidences) / len(img_confidences))
        
        # Fraud score (inverse relationship)
        fraud_confidence = 1.0 - analysis_results["fraudScore"]
        scores.append(fraud_confidence)
        
        # Authenticity score
        scores.append(analysis_results["authenticityScore"])
        
        return sum(scores) / len(scores) if scores else 0.5
        
    except Exception as e:
        logger.error(f"Error calculating confidence: {e}")
        return 0.5

def make_recommendation(analysis_results: Dict) -> str:
    """Make final recommendation based on analysis"""
    try:
        fraud_score = analysis_results["fraudScore"]
        confidence = analysis_results["confidence"]
        authenticity = analysis_results["authenticityScore"]
        
        if fraud_score > 0.7 or authenticity < 0.3:
            return "reject"
        elif fraud_score < 0.3 and confidence > 0.8 and authenticity > 0.8:
            return "approve"
        else:
            return "review"
            
    except Exception as e:
        logger.error(f"Error making recommendation: {e}")
        return "review"

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8001)),
        reload=True,
        log_level="info"
    ) 