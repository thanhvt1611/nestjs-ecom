import { applyDecorators } from '@nestjs/common';
import { Get, Post, Put, Patch, Delete } from '@nestjs/common';
import { IsPublic } from './auth.decorator';

export const PublicGet = (path?: string) => applyDecorators(Get(path), IsPublic());
export const PublicPost = (path?: string) => applyDecorators(Post(path), IsPublic());
export const PublicPut = (path?: string) => applyDecorators(Put(path), IsPublic());
export const PublicPatch = (path?: string) => applyDecorators(Patch(path), IsPublic());
export const PublicDelete = (path?: string) => applyDecorators(Delete(path), IsPublic());
