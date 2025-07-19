import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Response,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('files')
@Controller('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.filesService.uploadFile(file, req.user.id);
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[], @Request() req) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    return this.filesService.uploadMultipleFiles(files, req.user.id);
  }

  @Post('upload-to-ipfs')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload file to IPFS' })
  @ApiResponse({ status: 201, description: 'File uploaded to IPFS successfully' })
  async uploadToIPFS(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const ipfsHash = await this.filesService.uploadToIPFS(file);
    return { ipfsHash, originalName: file.originalname };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get file system statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getFileStats() {
    return this.filesService.getFileStats();
  }

  @Get(':filename')
  @ApiOperation({ summary: 'Download file' })
  @ApiResponse({ status: 200, description: 'File retrieved successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async downloadFile(@Param('filename') filename: string, @Response() res: ExpressResponse) {
    try {
      const fileBuffer = await this.filesService.getFile(filename);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(fileBuffer);
    } catch (error) {
      res.status(404).json({ message: 'File not found' });
    }
  }

  @Get('ipfs/:hash')
  @ApiOperation({ summary: 'Retrieve file from IPFS' })
  @ApiResponse({ status: 200, description: 'File retrieved from IPFS' })
  async getFromIPFS(@Param('hash') hash: string, @Response() res: ExpressResponse) {
    try {
      const fileBuffer = await this.filesService.getFromIPFS(hash);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${hash}"`);
      res.send(fileBuffer);
    } catch (error) {
      res.status(404).json({ message: 'File not found on IPFS' });
    }
  }

  @Delete(':filename')
  @ApiOperation({ summary: 'Delete file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async deleteFile(@Param('filename') filename: string) {
    await this.filesService.deleteFile(filename);
    return { message: 'File deleted successfully' };
  }
} 