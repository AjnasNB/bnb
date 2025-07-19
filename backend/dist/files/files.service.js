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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
let FilesService = class FilesService {
    constructor(configService) {
        this.configService = configService;
        this.uploadPath = this.configService.get('UPLOAD_PATH', './uploads');
        this.maxFileSize = this.configService.get('MAX_FILE_SIZE', 10485760);
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }
    async uploadFile(file, userId) {
        try {
            if (file.size > this.maxFileSize) {
                throw new common_1.BadRequestException('File size exceeds maximum allowed size');
            }
            const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/webp',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];
            if (!allowedTypes.includes(file.mimetype)) {
                throw new common_1.BadRequestException('File type not allowed');
            }
            const timestamp = Date.now();
            const randomString = crypto.randomBytes(8).toString('hex');
            const extension = path.extname(file.originalname);
            const filename = `${userId}_${timestamp}_${randomString}${extension}`;
            const filepath = path.join(this.uploadPath, filename);
            fs.writeFileSync(filepath, file.buffer);
            const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
            const ipfsHash = `Qm${fileHash.substring(0, 44)}`;
            return {
                originalName: file.originalname,
                filename,
                filepath,
                mimetype: file.mimetype,
                size: file.size,
                hash: fileHash,
                ipfsHash,
                uploadedAt: new Date(),
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`File upload failed: ${error.message}`);
        }
    }
    async uploadMultipleFiles(files, userId) {
        const uploadPromises = files.map(file => this.uploadFile(file, userId));
        return Promise.all(uploadPromises);
    }
    async getFile(filename) {
        const filepath = path.join(this.uploadPath, filename);
        if (!fs.existsSync(filepath)) {
            throw new common_1.BadRequestException('File not found');
        }
        return fs.readFileSync(filepath);
    }
    async deleteFile(filename) {
        const filepath = path.join(this.uploadPath, filename);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    }
    async uploadToIPFS(file) {
        try {
            const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
            const ipfsHash = `Qm${fileHash.substring(0, 44)}`;
            console.log(`Mock IPFS upload: ${file.originalname} -> ${ipfsHash}`);
            return ipfsHash;
        }
        catch (error) {
            throw new common_1.BadRequestException(`IPFS upload failed: ${error.message}`);
        }
    }
    async getFromIPFS(hash) {
        try {
            console.log(`Mock IPFS retrieval: ${hash}`);
            return Buffer.from('Mock file content');
        }
        catch (error) {
            throw new common_1.BadRequestException(`IPFS retrieval failed: ${error.message}`);
        }
    }
    validateImage(file) {
        const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        return imageTypes.includes(file.mimetype);
    }
    validateDocument(file) {
        const documentTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        return documentTypes.includes(file.mimetype);
    }
    getFileStats() {
        try {
            const files = fs.readdirSync(this.uploadPath);
            let totalSize = 0;
            files.forEach(filename => {
                const filepath = path.join(this.uploadPath, filename);
                const stats = fs.statSync(filepath);
                totalSize += stats.size;
            });
            return {
                totalFiles: files.length,
                totalSize,
                uploadPath: this.uploadPath,
            };
        }
        catch (error) {
            return {
                totalFiles: 0,
                totalSize: 0,
                uploadPath: this.uploadPath,
            };
        }
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FilesService);
//# sourceMappingURL=files.service.js.map