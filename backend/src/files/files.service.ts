import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class FilesService {
  private readonly uploadPath: string;
  private readonly maxFileSize: number;

  constructor(private configService: ConfigService) {
    this.uploadPath = this.configService.get<string>('UPLOAD_PATH', './uploads');
    this.maxFileSize = this.configService.get<number>('MAX_FILE_SIZE', 10485760); // 10MB

    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, userId: string): Promise<any> {
    try {
      // Validate file size
      if (file.size > this.maxFileSize) {
        throw new BadRequestException('File size exceeds maximum allowed size');
      }

      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException('File type not allowed');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = crypto.randomBytes(8).toString('hex');
      const extension = path.extname(file.originalname);
      const filename = `${userId}_${timestamp}_${randomString}${extension}`;
      const filepath = path.join(this.uploadPath, filename);

      // Save file to disk
      fs.writeFileSync(filepath, file.buffer);

      // Calculate file hash
      const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');

      // In a real implementation, you would upload to IPFS here
      // For now, we'll simulate an IPFS hash
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
    } catch (error) {
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }

  async uploadMultipleFiles(files: Express.Multer.File[], userId: string): Promise<any[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, userId));
    return Promise.all(uploadPromises);
  }

  async getFile(filename: string): Promise<Buffer> {
    const filepath = path.join(this.uploadPath, filename);
    
    if (!fs.existsSync(filepath)) {
      throw new BadRequestException('File not found');
    }

    return fs.readFileSync(filepath);
  }

  async deleteFile(filename: string): Promise<void> {
    const filepath = path.join(this.uploadPath, filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }

  // Simulate IPFS operations (in production, use actual IPFS client)
  async uploadToIPFS(file: Express.Multer.File): Promise<string> {
    try {
      // This is a mock implementation
      // In production, you would use ipfs-http-client or similar
      const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
      const ipfsHash = `Qm${fileHash.substring(0, 44)}`;
      
      console.log(`Mock IPFS upload: ${file.originalname} -> ${ipfsHash}`);
      return ipfsHash;
    } catch (error) {
      throw new BadRequestException(`IPFS upload failed: ${error.message}`);
    }
  }

  async getFromIPFS(hash: string): Promise<Buffer> {
    try {
      // This is a mock implementation
      // In production, you would fetch from IPFS
      console.log(`Mock IPFS retrieval: ${hash}`);
      return Buffer.from('Mock file content');
    } catch (error) {
      throw new BadRequestException(`IPFS retrieval failed: ${error.message}`);
    }
  }

  validateImage(file: Express.Multer.File): boolean {
    const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    return imageTypes.includes(file.mimetype);
  }

  validateDocument(file: Express.Multer.File): boolean {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    return documentTypes.includes(file.mimetype);
  }

  getFileStats(): any {
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
    } catch (error) {
      return {
        totalFiles: 0,
        totalSize: 0,
        uploadPath: this.uploadPath,
      };
    }
  }
} 