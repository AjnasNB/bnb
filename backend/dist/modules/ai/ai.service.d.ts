import { HttpService } from '@nestjs/axios';
export declare class AIService {
    private readonly httpService;
    private readonly logger;
    private readonly aiServiceUrl;
    private readonly apiKey;
    constructor(httpService: HttpService);
    private getHeaders;
    analyzeClaim(claimData: any): Promise<any>;
    processDocument(file: Express.Multer.File, documentType: string): Promise<any>;
    analyzeImage(file: Express.Multer.File, analysisType: string): Promise<any>;
    geminiAnalyzeClaim(documentText: string, claimType: string): Promise<any>;
    geminiAnalyzeImage(file: Express.Multer.File, claimContext: string): Promise<any>;
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
    batchProcessDocuments(files: Express.Multer.File[], documentTypes: string[]): Promise<any>;
}
