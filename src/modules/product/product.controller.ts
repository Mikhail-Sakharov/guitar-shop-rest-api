import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import * as core from 'express-serve-static-core';
// import {StatusCodes} from 'http-status-codes';
import {ProductServiceInterface} from './product-service.interface.js';
import ProductResponse from './response/product.response.js';
import CreateProductDto from './dto/create-product.dto.js';
// import UpdateProductDto from './dto/update-product.dto.js';
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import {Controller} from '../../common/controller/controller.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {DocumentExistsMiddleware} from '../../common/middlewares/document-exists.middleware.js';
import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '../../common/middlewares/validate-objectid.middleware.js';
import {Component} from '../../types/component.types.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {fillDTO} from '../../utils/common.js';
import {StatusCodes} from 'http-status-codes';
import HttpError from '../../common/errors/http-error.js';
import {ClientSortOrder} from '../../types/sort-order.enum.js';
import {GuitarType, StringsCount} from '../../types/product.interface.js';
// import UploadImageResponse from './response/upload-image.response.js';

type GetProductParams = {
  id: string;
}

type GetProductsParams = {
  stringsCount: string[];
  guitarType: string[];
};

@injectable()
export default class ProductController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.ProductServiceInterface) private readonly productService: ProductServiceInterface,
      // @inject(Component.ReviewServiceInterface) private readonly reviewService: ReviewServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for ProductController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.productService, 'id')
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateProductDto)
      ]
    });
    /* this.addRoute({
      path: '/:id',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(UpdateProductDto),
        new DocumentExistsMiddleware(this.productService, 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.productService, 'id')
      ]
    });
    this.addRoute({
      path: '/:id/image',
      method: HttpMethod.Post,
      handler: this.uploadPreview,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.productService, 'id'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'image')
      ]
    }); */
  }

  public async index(
    req: Request<core.ParamsDictionary | GetProductsParams>,
    res: Response
  ): Promise<void> {
    console.log(req.query);
    const page = Number(req.query._page);
    const limit = Number(req.query._limit);
    const sort = String(req.query._sort);
    const order = String(req.query._order) as ClientSortOrder;
    const guitarTypes = req.query?.guitarType?.toString().split(',') as GuitarType[];
    const stringsCounts = req.query?.stringsCount?.toString().split(',').map((item) => Number(item)) as StringsCount[];
    const products = await this.productService.find(
      sort,
      order,
      page,
      limit,
      stringsCounts,
      guitarTypes
    );
    const productsResponse = fillDTO(ProductResponse, products);
    this.ok(res, productsResponse);
  }

  public async show(
    {params}: Request<core.ParamsDictionary | GetProductParams>,
    res: Response
  ) {
    const {id} = params;
    const product = await this.productService.findById(id);
    const productResponse = fillDTO(ProductResponse, product);
    this.ok(res, productResponse);
  }

  public async create(
    {body, user}: Request<Record<string, unknown>, Record<string, unknown>, CreateProductDto>,
    res: Response
  ): Promise<void> {
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }
    const authorId = user.id;
    const product = await this.productService.create({...body, authorId});
    const productResponse = fillDTO(ProductResponse, product);
    this.created(res, productResponse);
  }

  /* public async update(
    {body, params, user}: Request<core.ParamsDictionary | GetOfferParams, Record<string, unknown>, UpdateProductDto>,
    res: Response
  ): Promise<void> {
    const product = await this.productService.findById(params.id);
    const authorId = fillDTO(ProductResponse, product).authorId;

    if (user.id !== authorId) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Forbidden',
        'OfferController: update'
      );
    }

    const updatedProduct = await this.productService.findByIdAndUpdate(params.id, body);
    const productResponse = fillDTO(ProductResponse, updatedProduct);
    this.ok(res, productResponse);
  }

  public async delete(
    {params, user}: Request<core.ParamsDictionary | GetOfferParams>,
    res: Response
  ): Promise<void> {
    const product = await this.productService.findById(params.id);
    const authorId = fillDTO(ProductResponse, product).authorId;

    if (user.id !== authorId) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Forbidden',
        'OfferController: delete'
      );
    }

    const deletedProduct = await this.productService.findByIdAndDelete(params.id);
    await this.reviewService.deleteByOfferId(params.id);
    this.noContent(res, deletedProduct);
  }

  public async uploadPreview(
    {file, params, user}: Request<core.ParamsDictionary | GetOfferParams>,
    res: Response
  ): Promise<void> {
    const product = await this.productService.findById(params.id);
    const authorId = fillDTO(ProductResponse, product).authorId;

    if (user.id !== authorId) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Forbidden',
        'OfferController: uploadPreview'
      );
    }

    const updatedProduct = await this.productService.findByIdAndUpdate(params.id, {image: file?.filename});
    const productResponse = fillDTO(UploadImageResponse, updatedProduct);
    this.ok(res, productResponse);
  } */
}
