import {Expose, Transform, Type} from 'class-transformer';
import {GuitarType, StringsCount} from '../../../types/product.interface.js';
import UserResponse from '../../user/response/user.response.js';

export default class ProductResponse {
  @Transform(({obj}) => obj._id.toString())
  @Expose({name: '_id'})
  public id!: number;

  @Expose()
  public createdAt!: string;

  @Expose({name: 'authorId'})
  @Type(() => UserResponse)
  public author!: UserResponse;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public image!: string;

  @Expose()
  public guitarType!: GuitarType;

  @Expose()
  public sku!: string;

  @Expose()
  public stringsCount!: StringsCount;

  @Expose()
  public rating!: number;

  @Expose()
  public price!: number;

  @Expose()
  public reviewsCount!: number;
}
