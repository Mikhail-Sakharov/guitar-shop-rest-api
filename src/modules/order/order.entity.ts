import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import {ProductEntity} from '../product/product.entity.js';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface OrderEntity extends defaultClasses.Base {}

class OrderItem {
  @prop({ref: ProductEntity, required: true})
  public productId!: Ref<ProductEntity>;

  @prop({required: true})
  public quantity!: number;

  @prop({required: true})
  public totalItemPrice!: number;
}

@modelOptions({
  schemaOptions: {
    collection: 'orders'
  }
})
export class OrderEntity extends defaultClasses.TimeStamps {
  @prop({required: true, unique: true})
  public orderNumber!: string;

  @prop({required: true})
  public items!: OrderItem[];

  @prop({ref: UserEntity, required: true})
  public userId!: Ref<UserEntity>;

  @prop({required: true})
  public totalOrderPrice!: number;
}

export const OrderModel = getModelForClass(OrderEntity);
