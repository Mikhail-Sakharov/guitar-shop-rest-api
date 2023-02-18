import {types, DocumentType} from '@typegoose/typegoose';
import {injectable, inject} from 'inversify';
import {ProductServiceInterface} from '../product/product-service.interface.js';
import {ReviewServiceInterface as ReviewServiceInterface} from './review-service.interface.js';
import {ReviewEntity} from './review.entity.js';
import CreateReviewDto from './dto/create-review.dto.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.types.js';
import {SortOrder} from '../../types/sort-order.enum.js';

@injectable()
export default class ReviewService implements ReviewServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private  readonly logger: LoggerInterface,
    @inject(Component.ReviewModel) private readonly reviewModel: types.ModelType<ReviewEntity>,
    @inject(Component.ProductServiceInterface) private readonly productService: ProductServiceInterface
  ) {}

  public async create(dto: CreateReviewDto & {userId: string}): Promise<DocumentType<ReviewEntity>> {
    const result = await this.reviewModel.create(dto);

    const reviews = await this.findByProductId(dto.productId, 0);
    const reviewsTotalCount = reviews.length;
    this.productService.setReviewsCount(dto.productId, reviewsTotalCount);

    const rating = reviews.reduce((res, review) => res + review.rating, 0)/reviewsTotalCount;
    this.productService.setProductRating(dto.productId, rating);

    this.logger.info('New review created');

    return result.populate('productId');
  }

  public async findByProductId(
    productId: string,
    limit: number,
    page?: number
  ): Promise<DocumentType<ReviewEntity>[]> {
    return this.reviewModel
      .find({productId}, {}, {limit})
      .sort({createdAt: SortOrder.Down})
      .skip(page && page > 0 ? (page - 1) * limit : 0)
      .exec();
  }
}
