import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import {
  CreatePermissionDTO,
  GetListPermissionBodyDTO,
  GetListPermissionsResDTO,
  GetPermissionBodyDTO,
  GetPermissionResDTO,
  UpdatePermissionDTO,
} from './permission.dto';
import { ActiveUser } from '../../shared/decorators/active-user.decorator';
import { ZodSerializerDto } from 'nestjs-zod';
import { MessageResDTO } from '../../shared/dtos/respose.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ZodSerializerDto(GetPermissionResDTO)
  create(@Body() createPermissionDto: CreatePermissionDTO, @ActiveUser('userId') userId: number) {
    return this.permissionService.create({ body: createPermissionDto, userId });
  }

  @Get()
  @ZodSerializerDto(GetListPermissionsResDTO)
  findAll(@Query() params: GetListPermissionBodyDTO) {
    return this.permissionService.findAll(params);
  }

  @Get(':id')
  @ZodSerializerDto(GetPermissionResDTO)
  findOne(@Param() params: GetPermissionBodyDTO) {
    return this.permissionService.findOne(+params.id);
  }

  @Put(':id')
  @ZodSerializerDto(GetPermissionResDTO)
  update(
    @Param() params: GetPermissionBodyDTO,
    @Body() updatePermissionDto: UpdatePermissionDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.permissionService.update({
      id: +params.id,
      body: updatePermissionDto,
      userId,
    });
  }

  @Delete(':id')
  @ZodSerializerDto(MessageResDTO)
  remove(@Param() params: GetPermissionBodyDTO, @ActiveUser('userId') userId: number) {
    return this.permissionService.remove({ id: +params.id, deletedById: userId });
  }
}
