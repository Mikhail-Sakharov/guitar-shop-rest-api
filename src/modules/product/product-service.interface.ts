import {DocumentType} from '@typegoose/typegoose';
import {ProductEntity} from './product.entity.js';
import CreateProductDto from './dto/create-product.dto.js';
import UpdateProductDto from './dto/update-product.dto.js';
import {DocumentExistsInterface} from '../../types/document-exists.interface.js';
import {GuitarType, StringsCount} from '../../types/product.interface.js';
import {ClientSortOrder} from '../../types/sort-order.enum.js';

export interface ProductServiceInterface extends DocumentExistsInterface {
  create(dto: CreateProductDto): Promise<DocumentType<ProductEntity>>;
  findById(productId: string): Promise<DocumentType<ProductEntity> | null>;
  findByIdAndUpdate(productId: string, dto: UpdateProductDto): Promise<DocumentType<ProductEntity> | null>;
  findByIdAndDelete(productId: string): Promise<DocumentType<ProductEntity> | null>;
  find(
    sort: string,
    order: ClientSortOrder,
    page: number,
    limit: number,
    minPrice?: number,
    maxPrice?: number,
    stringsCounts?: StringsCount[],
    guitarTypes?: GuitarType[]
  ): Promise<DocumentType<ProductEntity>[]>;
  incReviewsCount(productId: string): Promise<DocumentType<ProductEntity> | null>;
  setProductRating(productId: string, rating: number): Promise<DocumentType<ProductEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}
