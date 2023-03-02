import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.types.js';
import {ClientSortOrder, SortOrderMap} from '../../types/sort-order.enum.js';
import {OrderEntity} from './order.entity.js';
import CreateOrderDto from './dto/create-order.dto.js';
import {OrderServiceInterface} from './order-service.interface.js';
import {customAlphabet} from 'nanoid';
import {ProductModel} from '../product/product.entity.js';

@injectable()
export default class OrderService implements OrderServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private  readonly logger: LoggerInterface,
    @inject(Component.OrderModel) private readonly orderModel: types.ModelType<OrderEntity>
  ) {}

  public async exists(documentId: string): Promise<boolean> {
    return !!await this.findById(documentId);
  }

  public async create(dto: CreateOrderDto, userId: string): Promise<DocumentType<OrderEntity>> {
    const intNanoid = customAlphabet('1234567890');
    const orderNumber = `${intNanoid(2)}-${intNanoid(3)}-${intNanoid(3)}`;
    const order = await this.orderModel.create({...dto, orderNumber, userId});
    this.logger.info('New order created');

    return order.populate('userId');
  }

  public async find(
    sort: string,
    order: ClientSortOrder,
    page: number,
    limit: number
  ): Promise<DocumentType<OrderEntity>[]> {
    const orders = await this.orderModel
      .find()
      .sort({[sort]: SortOrderMap[order]})
      .skip(page > 0 ? (page - 1) * limit : 0)
      .limit(limit ?? 0)
      .populate({path: 'items', populate: {path: 'productId', model: ProductModel}})
      .exec();
    return orders;
  }

  public async findByOrderNumber(orderNumber: number): Promise<DocumentType<OrderEntity> | null> {
    return this.orderModel
      .findOne({orderNumber})
      .populate({path: 'items', populate: {path: 'productId', model: ProductModel}})
      .exec();
  }

  public async findById(orderId: string): Promise<DocumentType<OrderEntity> | null> {
    return this.orderModel
      .findById(orderId)
      .populate({path: 'items', populate: {path: 'productId', model: ProductModel}})
      .exec();
  }

  public async deleteById(orderId: string): Promise<DocumentType<OrderEntity> | null> {
    this.logger.info('The order has been deleted');

    return this.orderModel
      .findByIdAndDelete(orderId)
      .exec();
  }
}
