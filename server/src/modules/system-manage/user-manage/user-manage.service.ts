/*
 * @Author: 狗蛋<pup.com>
 * @Date: 2024-07-18 11:01:38
 * @LastEditors: 狗蛋<pup.com>
 * @LastEditTime: 2024-08-27 14:55:38
 * @Description: UserManageService - 用户管理
 */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { lastValueFrom, map } from 'rxjs';

import { RESPONSE_MSG } from '@/enums';
import { AuthService } from '@/modules/auth/auth.service';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { omit, responseMessage } from '@/utils';

import { UserParamsDto } from './dto/params-user.dto';
import { ChangePasswordDto, SaveUserDto } from './dto/save-user.dto';

@Injectable()
export class UserManageService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * @description: 查询用户列表
   */
  async findAll({ userName, status, current, size }: UserParamsDto) {
    // 分页处理，这里获取到的分页是字符串，需要转换成整数
    const take = Number(size);
    const skip = (Number(current) - 1) * take;
    // 条件判断
    const where = {}; // 查询参数
    // 模糊查询
    if (userName) {
      where['userName'] = { contains: userName, mode: 'insensitive' };
    }

    if (status) {
      where['status'] = { equals: status };
    }

    const records = await this.prisma.user.findMany({
      skip,
      take,
      where,
      select: {
        id: true,
        userName: true,
        cnName: true,
        email: true,
        phone: true,
        avatar: true,
        sex: true,
        status: true,
        sort: true,
        tags: true,
        city: true,
        address: true,
        roleId: true,
        role: true,
        orgId: true,
        organization: true,
        postId: true,
        post: true,
        loginCount: true,
        lastIp: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { sort: 'desc' }, // 按照sort字段升序
        { createdAt: 'desc' }, // 如果sort相同，再按照createdAt字段降序
      ],
    });
    // 总条数
    const total = await this.prisma.user.count({ where });
    return responseMessage<CommonType.PageResponse<User>>({
      records,
      total,
      current: Number(current),
      size: take,
    });
  }

  /**
   * @description: 查询单个用户信息
   */
  async findOne(id: string) {
    const result = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return responseMessage<User>(result);
  }

  /**
   * @description: 创建用户
   */
  async create(body: SaveUserDto) {
    try {
      // 密码加密
      const hashedPassword = await this.authService.hashPassword(body.password);
      // 这里不知道为什么 prisma 客户端会报类型错误
      const result = await this.prisma.user.create({
        data: {
          ...body,
          password: hashedPassword,
        } as any,
      });
      return responseMessage<User>(result);
    } catch (error) {
      // 判断是否违反 postgresql 唯一性约束
      if (error.code === 'P2002') {
        return responseMessage(null, '用户名、电子邮箱、手机号已存在!', -1);
      }
      return responseMessage(error, RESPONSE_MSG.ERROR, -1);
    }
  }

  /**
   * @description: 更新用户
   */
  async update(id: string, body: SaveUserDto, session: CommonType.SessionInfo) {
    try {
      const result = await this.prisma.user.update({
        where: { id },
        data: body,
      });
      // 判断是否更新的是当前用户，是则更新 session 信息
      if (id === session.userInfo.id) {
        const user = await this.prisma.user.findUnique({
          where: {
            id,
          },
          include: {
            role: true,
            organization: true,
            post: true,
          },
        });
        Object.assign(session.userInfo, omit(user, ['password', 'token']));
      }
      return responseMessage<User>(result);
    } catch (error) {
      // 判断是否违反 postgresql 唯一性约束
      if (error.code === 'P2002') {
        return responseMessage(null, '用户名、电子邮箱、手机号已存在!', -1);
      }
      return responseMessage(error, RESPONSE_MSG.ERROR, -1);
    }
  }

  /**
   * @description: 删除用户
   */
  async remove(id: string) {
    try {
      // 限制 admin 账号不能删除
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (user.userName.toLowerCase() === 'admin') {
        return responseMessage(null, 'admin 账号不能删除!', -1);
      }
      const result = await this.prisma.user.delete({
        where: { id },
      });
      return responseMessage<User>(result);
    } catch (error) {
      return responseMessage(error, RESPONSE_MSG.ERROR, -1);
    }
  }

  /**
   * @description: 更新用户标签
   */
  async updateUserTags(session: CommonType.SessionInfo, tags: string[]) {
    try {
      const result = await this.prisma.user.update({
        where: { id: session.userInfo.id },
        data: { tags },
      });
      Object.assign(session.userInfo, { tags });
      return responseMessage<User>(result);
    } catch (error) {
      return responseMessage(error, RESPONSE_MSG.ERROR, -1);
    }
  }

  /**
   * @description: 更改用户密码
   */
  async changePassword(body: ChangePasswordDto, session: CommonType.SessionInfo) {
    const id = session.userInfo.id;
    // 查询当前用户信息
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    // 判断密码是否正确
    const isMatch = await this.authService.comparePassword(body.password, user.password);
    if (!isMatch) {
      return responseMessage(null, '原密码错误!', -1);
    }
    // 生成新哈希值
    const hashedPassword = await this.authService.hashPassword(body.newPassword);
    const result = await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    return responseMessage<User>(result);
  }

  /**
   * @description: 绑定微信
   */
  async bindWechat(code: string, session: CommonType.SessionInfo) {
    // 获取微信 openid
    const { openid, errcode, errmsg } = await this.getWechatOpenId(code);
    if (errcode) throw new Error(`[${errcode}] ${errmsg}`);

    // 检查 openid 是否已被绑定
    const existUser = await this.prisma.user.findUnique({
      where: { openId: openid },
    });
    if (existUser) {
      return responseMessage(null, '该微信已绑定其他账号', -1);
    }

    // 更新当前用户
    return this.updateUserOpenId(session.userInfo.id, openid, session);
  }

  /**
   * @description: 解绑微信
   */
  async unbindWechat(session: CommonType.SessionInfo) {
    return this.updateUserOpenId(session.userInfo.id, null, session);
  }

  private async getWechatOpenId(code: string) {
    const url = new URL('https://api.weixin.qq.com/sns/jscode2session');
    url.searchParams.append('appid', process.env.WECHAT_APP_ID);
    url.searchParams.append('secret', process.env.WECHAT_SECRET);
    url.searchParams.append('js_code', code);
    url.searchParams.append('grant_type', 'authorization_code');
    console.log(url.toString());
    const responseData: any = await lastValueFrom(this.httpService.get(url.toString()).pipe(map((res) => res.data)));
    return responseData;
  }

  private async updateUserOpenId(userId: string, openId: string | null, session: CommonType.SessionInfo) {
    try {
      // 更新数据库
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { openId },
        include: { role: true, organization: true, post: true },
      });

      // 更新 session
      Object.assign(session.userInfo, omit(user, ['password', 'token']));

      return responseMessage(user);
    } catch (error) {
      // 处理唯一约束异常
      if (error.code === 'P2002') {
        return responseMessage(null, '该微信已绑定其他账号', -1);
      }
      return responseMessage(error, RESPONSE_MSG.ERROR, -1);
    }
  }
}
