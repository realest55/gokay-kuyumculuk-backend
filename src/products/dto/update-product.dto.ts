import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// 'export' kelimesi eklendi.
export class UpdateProductDto extends PartialType(CreateProductDto) {}
