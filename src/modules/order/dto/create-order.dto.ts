import {Type} from 'class-transformer';
import {IsInt, IsMongoId, ValidateNested} from 'class-validator';

class OrderItem {
  @IsMongoId({message: 'productId is required to be a valid MondoDB ID'})
  public productId!: string;

  @IsInt({message: 'The value of "quantity" should be an integer'})
  public quantity!: number;

  @IsInt({message: 'The value of "totalItemPrice" should be an integer'})
  public totalItemPrice!: number;
}

export default class CreateOrderDto {
  @ValidateNested({each: true})
  @Type(() => OrderItem)
  public items!: OrderItem[];

  @IsMongoId({message: 'userId is required to be a valid MondoDB ID'})
  public userId!: string;

  @IsInt({message: 'The value of "totalOrderPrice" should be an integer'})
  public totalOrderPrice!: number;
}
