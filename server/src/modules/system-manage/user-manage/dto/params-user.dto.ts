/*
 * @Author: 狗蛋<pup.com>
 * @Date: 2024-07-18 13:48:58
 * @LastEditors: 狗蛋<pup.com>
 * @LastEditTime: 2024-07-30 14:51:56
 * @Description: 请求参数 DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

import { PaginatingDTO } from '@/dto/params.dto';

export class UserParamsDto extends PaginatingDTO {
  @ApiProperty({
    type: String,
    description: '用户名',
    required: false,
    default: 'admin',
  })
  userName?: string;

  @ApiProperty({
    enum: Status,
    description: '状态',
    default: Status.ACTIVE,
    required: false,
  })
  status?: Status;
}

export class BindWechatDto {
  @ApiProperty({ type: String, description: '微信临时code', default: '', required: true, })
  code: string;
}
