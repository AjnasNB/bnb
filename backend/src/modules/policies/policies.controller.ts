import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PoliciesService } from './policies.service';

@ApiTags('Policies')
@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all policies' })
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.policiesService.findAll({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get policy by ID' })
  async findOne(@Param('id') id: string) {
    return this.policiesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new policy' })
  async create(@Body() policyData: any) {
    return this.policiesService.create(policyData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update policy' })
  async update(@Param('id') id: string, @Body() policyData: any) {
    return this.policiesService.update(id, policyData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete policy' })
  async remove(@Param('id') id: string) {
    return this.policiesService.remove(id);
  }

  @Get('types/available')
  @ApiOperation({ summary: 'Get available policy types' })
  async getAvailableTypes() {
    return this.policiesService.getAvailableTypes();
  }

  @Post('quote')
  @ApiOperation({ summary: 'Get policy quote' })
  async getQuote(@Body() quoteData: any) {
    return this.policiesService.getQuote(quoteData);
  }
} 