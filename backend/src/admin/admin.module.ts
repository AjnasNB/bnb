import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { PoliciesModule } from '../policies/policies.module';
import { ClaimsModule } from '../claims/claims.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [UsersModule, PoliciesModule, ClaimsModule, FilesModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {} 