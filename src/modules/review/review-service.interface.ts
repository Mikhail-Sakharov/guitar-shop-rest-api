import {DocumentType} from '@typegoose/typegoose';
import {ReviewEntity} from './review.entity.js';
import CreateReviewDto from './dto/create-review.dto.js';

export interface ReviewServiceInterface {
  create(dto: CreateReviewDto & {userId: string}): Promise<DocumentType<ReviewEntity>>;
  findByProductId(
    pproductId: string,
    limit: number,
    page?: number
  ): Promise<DocumentType<ReviewEntity>[]>;
}
