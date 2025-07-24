import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

// 'export' kelimesi eklendi.
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional()
  image1?: string; // Soru işareti ismin değil, tipin bir parçası olmalı.

  @IsString()
  @IsOptional()
  image2?: string; // Soru işareti ismin değil, tipin bir parçası olmalı.

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}