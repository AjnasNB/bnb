import { ConfigService } from '@nestjs/config';
export declare class FilesService {
    private configService;
    private readonly uploadPath;
    private readonly maxFileSize;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, userId: string): Promise<any>;
    uploadMultipleFiles(files: Express.Multer.File[], userId: string): Promise<any[]>;
    getFile(filename: string): Promise<Buffer>;
    deleteFile(filename: string): Promise<void>;
    uploadToIPFS(file: Express.Multer.File): Promise<string>;
    getFromIPFS(hash: string): Promise<Buffer>;
    validateImage(file: Express.Multer.File): boolean;
    validateDocument(file: Express.Multer.File): boolean;
    getFileStats(): any;
}
