import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number) // Это нужно, чтобы превратить строку "100" в число 100 (если шлем multipart/form-data)
  price: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @IsArray()
  @IsString({ each: true }) // Проверяем, что каждый элемент массива — строка (URL)
  @IsOptional()
  images?: string[];
}
