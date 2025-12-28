import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { RegisterBodySchema, RegisterResSchema, VerificationBodySchema } from './auth.model';

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}

export class RegisterResDTO extends createZodDto(RegisterResSchema) {}

export class VerificationBodyDTO extends createZodDto(VerificationBodySchema) {}
