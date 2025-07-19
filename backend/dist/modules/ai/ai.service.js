"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AIService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const app_config_1 = require("../../config/app.config");
const form_data_1 = require("form-data");
let AIService = AIService_1 = class AIService {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(AIService_1.name);
        this.aiServiceUrl = app_config_1.AppConfig.aiService.url;
        this.apiKey = app_config_1.AppConfig.aiService.apiKey;
    }
    getHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };
    }
    async analyzeClaim(claimData) {
        try {
            this.logger.log(`Analyzing claim ${claimData.claimId} with AI service`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.aiServiceUrl}/analyze-claim`, claimData, {
                headers: this.getHeaders(),
                timeout: app_config_1.AppConfig.aiService.timeout
            }));
            this.logger.log(`Claim analysis completed for ${claimData.claimId}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`AI claim analysis failed: ${error.message}`);
            throw new common_1.HttpException(`AI service error: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async processDocument(file, documentType) {
        try {
            this.logger.log(`Processing document ${file.originalname} with AI service`);
            const formData = new form_data_1.default();
            formData.append('file', file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype,
            });
            formData.append('document_type', documentType);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.aiServiceUrl}/process-document`, formData, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    ...formData.getHeaders(),
                },
                timeout: app_config_1.AppConfig.aiService.timeout,
                maxContentLength: app_config_1.AppConfig.aiService.maxFileSize,
                maxBodyLength: app_config_1.AppConfig.aiService.maxFileSize,
            }));
            this.logger.log(`Document processing completed for ${file.originalname}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`AI document processing failed: ${error.message}`);
            throw new common_1.HttpException(`AI service error: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async analyzeImage(file, analysisType) {
        try {
            this.logger.log(`Analyzing image ${file.originalname} with AI service`);
            const formData = new form_data_1.default();
            formData.append('file', file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype,
            });
            formData.append('analysis_type', analysisType);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.aiServiceUrl}/analyze-image`, formData, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    ...formData.getHeaders(),
                },
                timeout: app_config_1.AppConfig.aiService.timeout,
                maxContentLength: app_config_1.AppConfig.aiService.maxFileSize,
                maxBodyLength: app_config_1.AppConfig.aiService.maxFileSize,
            }));
            this.logger.log(`Image analysis completed for ${file.originalname}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`AI image analysis failed: ${error.message}`);
            throw new common_1.HttpException(`AI service error: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async geminiAnalyzeClaim(documentText, claimType) {
        try {
            this.logger.log(`Running Gemini analysis for ${claimType} claim`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.aiServiceUrl}/gemini-analyze`, {
                document_text: documentText,
                claim_type: claimType,
            }, {
                headers: this.getHeaders(),
                timeout: app_config_1.AppConfig.aiService.timeout
            }));
            this.logger.log(`Gemini analysis completed for ${claimType} claim`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Gemini analysis failed: ${error.message}`);
            throw new common_1.HttpException(`Gemini service error: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async geminiAnalyzeImage(file, claimContext) {
        try {
            this.logger.log(`Running Gemini image analysis for ${file.originalname}`);
            const formData = new form_data_1.default();
            formData.append('file', file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype,
            });
            formData.append('claim_context', claimContext);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.aiServiceUrl}/gemini-image-analysis`, formData, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    ...formData.getHeaders(),
                },
                timeout: app_config_1.AppConfig.aiService.timeout,
                maxContentLength: app_config_1.AppConfig.aiService.maxFileSize,
                maxBodyLength: app_config_1.AppConfig.aiService.maxFileSize,
            }));
            this.logger.log(`Gemini image analysis completed for ${file.originalname}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Gemini image analysis failed: ${error.message}`);
            throw new common_1.HttpException(`Gemini service error: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async healthCheck() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.aiServiceUrl}/health`, {
                headers: this.getHeaders(),
                timeout: 5000
            }));
            return {
                status: 'healthy',
                aiService: response.data,
                connection: 'ok',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`AI service health check failed: ${error.message}`);
            return {
                status: 'unhealthy',
                error: error.message,
                connection: 'failed',
                timestamp: new Date().toISOString(),
            };
        }
    }
    async batchProcessDocuments(files, documentTypes) {
        try {
            this.logger.log(`Batch processing ${files.length} documents`);
            const formData = new form_data_1.default();
            files.forEach((file, index) => {
                formData.append('files', file.buffer, {
                    filename: file.originalname,
                    contentType: file.mimetype,
                });
            });
            if (documentTypes && documentTypes.length > 0) {
                documentTypes.forEach(type => {
                    formData.append('document_types', type);
                });
            }
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.aiServiceUrl}/batch-process`, formData, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    ...formData.getHeaders(),
                },
                timeout: app_config_1.AppConfig.aiService.timeout * 2,
                maxContentLength: app_config_1.AppConfig.aiService.maxFileSize * files.length,
                maxBodyLength: app_config_1.AppConfig.aiService.maxFileSize * files.length,
            }));
            this.logger.log(`Batch processing completed for ${files.length} documents`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`AI batch processing failed: ${error.message}`);
            throw new common_1.HttpException(`AI service error: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
};
exports.AIService = AIService;
exports.AIService = AIService = AIService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], AIService);
//# sourceMappingURL=ai.service.js.map