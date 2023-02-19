import {DocumentType} from '@typegoose/typegoose';
import {ClientSortOrder} from '../../types/sort-order.enum';
import CreateOrderDto from './dto/create-order.dto';
import {OrderEntity} from './order.entity';

export interface OrderServiceInterface {
  create(dto: CreateOrderDto): Promise<DocumentType<OrderEntity>>;
  find(
    sort: string,
    order: ClientSortOrder,
    page: number,
    limit: number
  ): Promise<DocumentType<OrderEntity>[]>;
  findByOrderNumber(orderNumber: number): Promise<DocumentType<OrderEntity> | null>;
  findById(orderId: string): Promise<DocumentType<OrderEntity> | null>;
  deleteById(orderId: string): Promise<DocumentType<OrderEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}
