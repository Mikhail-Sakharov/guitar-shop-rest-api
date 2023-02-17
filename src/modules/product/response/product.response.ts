import {Expose, Type} from 'class-transformer';
import {GuitarType, StringsCount} from '../../../types/product.interface.js';
import UserResponse from '../../user/response/user.response.js';

export default class ProductResponse {
  @Expose({name: '_id'})
  public id!: number;

  @Expose()
  public createdAt!: string;

  @Expose({name: 'authorId'})
  @Type(() => UserResponse)
  public author!: string;

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
