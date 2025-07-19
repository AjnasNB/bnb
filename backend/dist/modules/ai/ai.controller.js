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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const ai_service_1 = require("./ai.service");
let AIController = class AIController {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async analyzeClaim(claimData) {
        return this.aiService.analyzeClaim(claimData);
    }
    async processDocument(file, documentType = 'general') {
        return this.aiService.processDocument(file, documentType);
    }
    async analyzeImage(file, analysisType = 'general') {
        return this.aiService.analyzeImage(file, analysisType);
    }
    async geminiAnalyze(data) {
        return this.aiService.geminiAnalyzeClaim(data.document_text, data.claim_type);
    }
    async geminiImageAnalysis(file, claimContext = '') {
        return this.aiService.geminiAnalyzeImage(file, claimContext);
    }
    async healthCheck() {
        return this.aiService.healthCheck();
    }
};
exports.AIController = AIController;
__decorate([
    (0, common_1.Post)('analyze-claim'),
    (0, swagger_1.ApiOperation)({ summary: 'Analyze claim with AI' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim analysis completed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "analyzeClaim", null);
__decorate([
    (0, common_1.Post)('process-document'),
    (0, swagger_1.ApiOperation)({ summary: 'Process document with OCR' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('document_type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "processDocument", null);
__decorate([
    (0, common_1.Post)('analyze-image'),
    (0, swagger_1.ApiOperation)({ summary: 'Analyze image evidence' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('analysis_type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "analyzeImage", null);
__decorate([
    (0, common_1.Post)('gemini-analyze'),
    (0, swagger_1.ApiOperation)({ summary: 'Advanced claim analysis with Gemini' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "geminiAnalyze", null);
__decorate([
    (0, common_1.Post)('gemini-image-analysis'),
    (0, swagger_1.ApiOperation)({ summary: 'Advanced image analysis with Gemini' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('claim_context')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "geminiImageAnalysis", null);
__decorate([
    (0, common_1.Post)('health-check'),
    (0, swagger_1.ApiOperation)({ summary: 'Check AI service health' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AIController.prototype, "healthCheck", null);
exports.AIController = AIController = __decorate([
    (0, swagger_1.ApiTags)('AI Service'),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AIService])
], AIController);
//# sourceMappingURL=ai.controller.js.map