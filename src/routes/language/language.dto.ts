import { createZodDto } from 'nestjs-zod';
import {
  CreateLanguageBodySchema,
  GetLanguageBodySchema,
  GetLanguagesResSchema,
  LanguageSchema,
  UpdateLanguageBodySchema,
} from './language.model';

export class CreateLanguageDTO extends createZodDto(CreateLanguageBodySchema) {}

export class UpdateLanguageDTO extends createZodDto(UpdateLanguageBodySchema) {}

export class LanguageResDTO extends createZodDto(LanguageSchema) {}

export class GetLanguagesResDTO extends createZodDto(GetLanguagesResSchema) {}

export class GetLanguageDTO extends createZodDto(GetLanguageBodySchema) {}
