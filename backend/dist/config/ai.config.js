"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiConfig = void 0;
const config_1 = require("@nestjs/config");
exports.aiConfig = (0, config_1.registerAs)('ai', () => ({
    endpoint: process.env.AI_SERVICE_URL || 'http://localhost:8001',
    apiKey: process.env.AI_SERVICE_API_KEY || 'chainsure_backend_key_2024',
    timeout: parseInt(process.env.AI_SERVICE_TIMEOUT, 10) || 30000,
    maxRetries: parseInt(process.env.AI_SERVICE_MAX_RETRIES, 10) || 3,
    retryDelay: parseInt(process.env.AI_SERVICE_RETRY_DELAY, 10) || 1000,
    fraudThreshold: parseInt(process.env.AI_FRAUD_THRESHOLD, 10) || 80,
    confidenceThreshold: parseInt(process.env.AI_CONFIDENCE_THRESHOLD, 10) || 70,
    enableFraudDetection: process.env.AI_ENABLE_FRAUD_DETECTION !== 'false',
    enableDocumentAnalysis: process.env.AI_ENABLE_DOCUMENT_ANALYSIS !== 'false',
    enableImageAnalysis: process.env.AI_ENABLE_IMAGE_ANALYSIS !== 'false',
    maxFileSize: parseInt(process.env.AI_MAX_FILE_SIZE, 10) || 50 * 1024 * 1024,
    allowedFileTypes: (process.env.AI_ALLOWED_FILE_TYPES || 'pdf,jpg,jpeg,png,bmp,tiff').split(','),
    ocrEngine: process.env.AI_OCR_ENGINE || 'easyocr',
    imageQuality: process.env.AI_IMAGE_QUALITY || 'high',
    cacheResults: process.env.AI_CACHE_RESULTS !== 'false',
    cacheExpiry: parseInt(process.env.AI_CACHE_EXPIRY, 10) || 3600,
}));
//# sourceMappingURL=ai.config.js.map