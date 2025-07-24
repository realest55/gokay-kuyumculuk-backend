// Bu dosyayı src/categories/dto/ klasörü içinde oluştur.

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
