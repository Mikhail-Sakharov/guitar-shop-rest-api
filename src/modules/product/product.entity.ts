import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import {GuitarType, StringsCount} from '../../types/product.interface.js';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface ProductEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'products'
  }
})
export class ProductEntity extends defaultClasses.TimeStamps {
  @prop({ref: UserEntity, required: true})
  public authorId!: Ref<UserEntity>;

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public description!: string;

  @prop({required: true})
  public image!: string;

  @prop({required: true})
  public guitarType!: GuitarType;

  @prop({required: true})
  public sku!: string;

  @prop({required: true})
  public stringsCount!: StringsCount;

  @prop({default: 0})
  public rating!: number;

  @prop({required: true})
  public price!: number;

  @prop({default: 0})
  public reviewsCount!: number;
}

export const ProductModel = getModelForClass(ProductEntity);
