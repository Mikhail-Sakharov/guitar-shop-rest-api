import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import * as core from 'express-serve-static-core';
import {ReviewServiceInterface} from './review-service.interface.js';
import ReviewResponse from './response/review.response.js';
import CreateReviewDto from './dto/create-review.dto.js';
// import {ProductServiceInterface} from '../product/product-service.interface.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import {Controller} from '../../common/controller/controller.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';
import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.middleware.js';
import {Component} from '../../types/component.types.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {fillDTO} from '../../utils/common.js';

type GetReviewsParams = {
  productId: string | undefined;
}

@injectable()
export default class ReviewController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.ReviewServiceInterface) private readonly reviewService: ReviewServiceInterface,
      // @inject(Component.ProductServiceInterface) private readonly productService: ProductServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for ReviewController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateReviewDto),
      ]
    });
  }

  public async index(
    req: Request<core.ParamsDictionary | GetReviewsParams>,
    res: Response
  ): Promise<void> {
    const productId = String(req.query.productId);
    const page = Number(req.query._page);
    const limit = Number(req.query._limit);
    const comments = await this.reviewService.findByProductId(productId, limit, page);
    const commentsResponse = fillDTO(ReviewResponse, comments);
    this.ok(res, commentsResponse);
  }

  public async create(
    {body, user}: Request<core.ParamsDictionary, Record<string, unknown>, CreateReviewDto>,
    res: Response
  ): Promise<void> {
    const userId = user.id;
    const comment = await this.reviewService.create({...body, userId});
    const commentResponse = fillDTO(ReviewResponse, comment);
    this.created(res, commentResponse);
  }
}
