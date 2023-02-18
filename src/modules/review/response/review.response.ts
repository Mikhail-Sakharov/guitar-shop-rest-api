import {Expose, Transform, Type} from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';

export default class ReviewResponse {
  @Transform(({obj}) => obj._id.toString())
  @Expose({name: '_id'})
  public id!: string;

  @Expose()
  public createdAt!: string;

  @Expose({name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Transform(({obj}) => obj.productId.toString())
  @Expose()
  public productId!: string;

  @Expose()
  public advantages!: string;

  @Expose()
  public disadvantages!: string;

  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;
}
