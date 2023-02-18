import {IsInt, Max, Min, IsString, Length, IsMongoId} from 'class-validator';

export default class CreateReviewDto {
  @IsMongoId({message: 'productId is required to be a valid MondoDB ID'})
  public productId!: string;

  @IsString({message: 'advantages is required'})
  @Length(50, 100, {message: 'Min length is 50, max is 100'})
  public advantages!: string;

  @IsString({message: 'disadvantages is required'})
  @Length(50, 100, {message: 'Min length is 50, max is 100'})
  public disadvantages!: string;

  @IsString({message: 'text is required'})
  @Length(5, 1024, {message: 'Min length is 5, max is 1024'})
  public text!: string;

  @IsInt({message: 'The value of "rating" should be an integer'})
  @Min(1, {message: 'Min value should be 1'})
  @Max(5, {message: 'Max value should be 5'})
  public rating!: number;
}
