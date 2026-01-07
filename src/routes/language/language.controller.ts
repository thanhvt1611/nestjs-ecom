import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { LanguageService } from './language.service';
import {
  CreateLanguageDTO,
  GetLanguageDTO,
  GetLanguagesResDTO,
  LanguageResDTO,
  UpdateLanguageDTO,
} from './language.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { ActiveUser } from '../../shared/decorators/active-user.decorator';
import { MessageResDTO } from '../../shared/dtos/respose.dto';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  @ZodSerializerDto(GetLanguagesResDTO)
  getAll() {
    return this.languageService.getAll();
  }

  @Get(':id')
  @ZodSerializerDto(LanguageResDTO)
  getOne(@Param() params: GetLanguageDTO) {
    return this.languageService.getOne(params.id);
  }

  @Post()
  @ZodSerializerDto(LanguageResDTO)
  create(@Body() payload: CreateLanguageDTO, @ActiveUser('userId') userId: number) {
    return this.languageService.create({ ...payload, userId });
  }

  @Put(':id')
  @ZodSerializerDto(LanguageResDTO)
  update(@Param() params: GetLanguageDTO, @Body() payload: UpdateLanguageDTO, @ActiveUser('userId') userId: number) {
    return this.languageService.update({ id: params.id, payload, userId });
  }

  @Delete(':id')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetLanguageDTO) {
    return this.languageService.delete(params.id);
  }
}
