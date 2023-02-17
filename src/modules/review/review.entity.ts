import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import {ProductEntity} from '../product/product.entity.js';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface ReviewEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'reviews'
  }
})
export class ReviewEntity extends defaultClasses.TimeStamps {
  @prop({ref: UserEntity, required: true})
  public userId!: UserEntity;

  @prop({ref: ProductEntity, required: true})
  public productId!: ProductEntity;

  @prop()
  public advantages!: string;

  @prop()
  public disadvantages!: string;

  @prop()
  public text!: string;

  @prop()
  public rating!: number;
}

export const ReviewModel = getModelForClass(ReviewEntity);
