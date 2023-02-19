import {Expose, Transform, Type} from 'class-transformer';
import {OrderItemType} from '../../../types/order.interface.js';
import UserResponse from '../../user/response/user.response.js';

export default class OrderResponse {
  @Transform(({obj}) => obj._id.toString())
  @Expose({name: '_id'})
  public id!: number;

  @Expose()
  public createdAt!: string;

  @Expose()
  public orderNumber!: string;

  @Expose()
  public items!: OrderItemType[];

  @Expose({name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public totalOrderPrice!: number;
}
