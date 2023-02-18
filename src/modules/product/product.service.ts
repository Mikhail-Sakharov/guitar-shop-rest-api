import {inject, injectable} from 'inversify';
import {ProductServiceInterface} from './product-service.interface.js';
import CreateProductDto from './dto/create-product.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {ProductEntity} from './product.entity.js';
import UpdateProductDto from './dto/update-product.dto.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.types.js';
import {ClientSortOrder, SortOrderMap} from '../../types/sort-order.enum.js';
import {GuitarType, StringsCount} from '../../types/product.interface.js';

@injectable()
export default class ProductService implements ProductServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private  readonly logger: LoggerInterface,
    @inject(Component.ProductModel) private readonly productModel: types.ModelType<ProductEntity>
  ) {}

  public async exists(documentId: string): Promise<boolean> {
    return !!await this.findById(documentId);
  }

  public async create(dto: CreateProductDto): Promise<DocumentType<ProductEntity>> {
    const result = await this.productModel.create(dto);
    this.logger.info(`New product created: ${dto.title}`);

    return result.populate('authorId');
  }

  public async findById(productId: string): Promise<DocumentType<ProductEntity> | null> {
    return this.productModel
      .findById(productId)
      .populate(['authorId'])
      .exec();
  }

  public async findByIdAndUpdate(productId: string, dto: UpdateProductDto): Promise<DocumentType<ProductEntity> | null> {
    return this.productModel
      .findByIdAndUpdate(productId, dto, {new: true})
      .populate(['authorId'])
      .exec();
  }

  public async findByIdAndDelete(productId: string): Promise<DocumentType<ProductEntity> | null> {
    return this.productModel
      .findByIdAndDelete(productId)
      .exec();
  }

  public async find(
    sort: string,
    order: ClientSortOrder,
    page: number,
    limit: number,
    minPrice?: number,
    maxPrice?: number,
    stringsCounts?: StringsCount[],
    guitarTypes?: GuitarType[]
  ): Promise<DocumentType<ProductEntity>[]> {
    return this.productModel
      .find()
      .where('price').gte(minPrice ? minPrice : 0).lte(maxPrice ? maxPrice : 1000000)
      .where(guitarTypes ? {guitarType: guitarTypes} : {})
      .where(stringsCounts ? {stringsCount: stringsCounts} : {})
      .populate(['authorId'])
      .sort({[sort]: SortOrderMap[order]})
      .skip(page > 0 ? (page - 1) * limit : 0)
      .limit(limit ?? 0)
      .exec();
  }

  public async incReviewsCount(productId: string): Promise<DocumentType<ProductEntity> | null> {
    return this.productModel
      .findByIdAndUpdate(productId, {'$inc': {
        reviewsCount: 1,
      }}).exec();
  }

  public async setProductRating(productId: string, rating: number): Promise<DocumentType<ProductEntity> | null> {
    return this.productModel
      .findByIdAndUpdate(productId, {'$set': {rating}}).exec();
  }
}
