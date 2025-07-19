import { AIService } from './ai.service';
export declare class AIController {
    private readonly aiService;
    constructor(aiService: AIService);
    analyzeClaim(claimData: any): Promise<any>;
    processDocument(file: Express.Multer.File, documentType?: string): Promise<any>;
    analyzeImage(file: Express.Multer.File, analysisType?: string): Promise<any>;
    geminiAnalyze(data: {
        document_text: string;
        claim_type: string;
    }): Promise<any>;
    geminiImageAnalysis(file: Express.Multer.File, claimContext?: string): Promise<any>;
    healthCheck(): Promise<{
        status: string;
        aiService: any;
        connection: string;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        error: any;
        connection: string;
        timestamp: string;
        aiService?: undefined;
    }>;
}
