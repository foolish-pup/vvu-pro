/*
 * @Author: 狗蛋<pup.com>
 * @Date: 2024-07-18 14:26:58
 * @LastEditors: 狗蛋<pup.com>
 * @LastEditTime: 2024-08-07 09:59:24
 * @Description: UserManageModule
 */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AuthModule } from '@/modules/auth/auth.module';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { OperationLogModule } from '@/modules/system-manage/operation-log/operation-log.module';

import { UserManageController } from './user-manage.controller';
import { UserManageService } from './user-manage.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    OperationLogModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [UserManageController],
  providers: [UserManageService],
  exports: [UserManageService],
})
export class UserManageModule {}
