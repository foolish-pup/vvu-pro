/*
 * @Author: 狗蛋<pup.com>
 * @Date: 2024-07-10 14:17:49
 * @LastEditors: 狗蛋<pup.com>
 * @LastEditTime: 2024-07-10 15:48:42
 * @Description: http 异常过滤器
 */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

import { responseMessage } from '@/utils';

// @Catch() 装饰器绑定所需的元数据到异常过滤器上。它告诉 Nest这个特定的过滤器正在寻找
@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 获取上下文
    const ctx = host.switchToHttp();
    // 获取响应体
    const response = ctx.getResponse<Response>();
    // 获取状态码
    const statusCode = exception.getStatus();

    // 自定义异常返回体
    response.status(statusCode).json(responseMessage(null, exception.message, statusCode));
  }
}
