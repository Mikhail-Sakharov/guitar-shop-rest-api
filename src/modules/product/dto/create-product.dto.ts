import {
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {GuitarType, StringsCount} from '../../../types/product.interface.js';

export default class CreateProductDto {
  @IsDateString({message: '"createdAt" should be a valid date string'})
  public createdAt?: string;

  @IsMongoId({message: '"authorId" should be a valid Mongo ID'})
  public authorId!: string;

  @MinLength(10, {message: 'Minimum title length is 10'})
  @MaxLength(100, {message: 'Maximum title length is 100'})
  public title!: string;

  @MinLength(20, {message: 'Minimum description length is 20'})
  @MaxLength(1024, {message: 'Maximum description length is 1024'})
  public description!: string;

  public image!: string;

  @IsEnum(GuitarType, {message: '"guitarType" should be: аккустика | электро | укулеле'})
  public guitarType!: GuitarType;

  @MinLength(5, {message: 'Minimum sku length is 5'})
  @MaxLength(40, {message: 'Maximum sku length is 40'})
  public sku!: string;

  @IsEnum(StringsCount, {message: '"StringsCount" should be: 4 | 6 | 7 | 12'})
  public stringsCount!: StringsCount;

  @IsInt({message: 'Price should be an integer'})
  @Min(100, {message: 'Minimum price is 100'})
  @Max(1000000, {message: 'Maximum price is 1000000'})
  public price!: number;
}
