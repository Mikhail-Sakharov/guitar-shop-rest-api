import {Expose, Type} from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';

export default class ReviewResponse {
  @Expose({name: '_id'})
  public id!: string;

  @Expose()
  public createdAt!: string;

  // @Expose()
  // public userName!: string;

  @Expose({name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;

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
