import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsNumber()
  CategoryId: number;

  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  width: number;

  @IsNotEmpty()
  @IsNumber()
  length: number;

  @IsNotEmpty()
  @IsNumber()
  height: number;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
