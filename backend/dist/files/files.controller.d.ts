import { Response as ExpressResponse } from 'express';
import { FilesService } from './files.service';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    uploadFile(file: Express.Multer.File, req: any): Promise<any>;
    uploadMultipleFiles(files: Express.Multer.File[], req: any): Promise<any[]>;
    uploadToIPFS(file: Express.Multer.File): Promise<{
        ipfsHash: string;
        originalName: string;
    }>;
    getFileStats(): any;
    downloadFile(filename: string, res: ExpressResponse): Promise<void>;
    getFromIPFS(hash: string, res: ExpressResponse): Promise<void>;
    deleteFile(filename: string): Promise<{
        message: string;
    }>;
}
