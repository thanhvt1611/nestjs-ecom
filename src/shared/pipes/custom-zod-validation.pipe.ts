import { UnprocessableEntityException } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';

const CustomZodValidationPipe: ReturnType<typeof createZodValidationPipe> =
  createZodValidationPipe({
    createValidationException: (error: ZodError) => {
      return new UnprocessableEntityException(
        error.issues.map((e) => ({
          ...e,
          path: e.path.join('.'),
        })),
      );
    },
  });
export default CustomZodValidationPipe;
