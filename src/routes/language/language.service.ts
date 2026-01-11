import { Injectable } from '@nestjs/common';
import { LanguageRepository } from './language.repo';
import { CreateLanguageBodyType, UpdateLanguageBodyType } from './language.model';
import { NotFoundRecordException } from '../../shared/error';
import { isNotFoundError, isUniqueConstraintError } from '../../shared/helpers';
import { LanguageAlreadyExistsException } from './language.error';

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async getAll() {
    const data = await this.languageRepository.getAll();
    return {
      data,
      totalItems: data.length,
    };
  }

  async getOne(id: string) {
    const lang = await this.languageRepository.getOne(id);
    if (!lang) {
      throw NotFoundRecordException;
    }
    return lang;
  }

  async create({ code, name, userId }: CreateLanguageBodyType & { userId: number }) {
    try {
      return await this.languageRepository.create({ code, name, createdById: userId });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw LanguageAlreadyExistsException;
      }
      throw error;
    }
  }

  async update({ id, payload, userId }: { id: string; payload: UpdateLanguageBodyType; userId: number }) {
    try {
      return await this.languageRepository.update({ id, ...payload, updatedById: userId });
    } catch (error) {
      if (isNotFoundError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      await this.languageRepository.delete({ id, isForceDelete: true });
      return { message: 'OK' };
    } catch (error) {
      if (isNotFoundError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}
