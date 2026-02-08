import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateShopDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  // Регулярка: только маленькие латинские буквы, цифры и дефис
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers and hyphens',
  })
  slug: string;
}
