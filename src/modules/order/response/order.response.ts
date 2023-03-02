import {Expose, Transform, Type} from 'class-transformer';
import ProductResponse from '../../product/response/product.response.js';
import UserResponse from '../../user/response/user.response.js';

class OrderItem {
  @Expose({name: 'productId'})
  @Type(() => ProductResponse)
  public product!: ProductResponse;

  @Expose()
  public quantity!: number;

  @Expose()
  public totalItemPrice!: number;
}

export default class OrderResponse {
  @Transform(({obj}) => obj._id.toString())
  @Expose({name: '_id'})
  public id!: string;

  @Expose()
  public createdAt!: string;

  @Expose()
  public orderNumber!: string;

  @Expose()
  @Type(() => OrderItem)
  public items!: OrderItem[];

  @Expose({name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public totalOrderPrice!: number;
}
