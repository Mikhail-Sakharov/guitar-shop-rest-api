import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import * as core from 'express-serve-static-core';
import {StatusCodes} from 'http-status-codes';
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import {Controller} from '../../common/controller/controller.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {DocumentExistsMiddleware} from '../../common/middlewares/document-exists.middleware.js';
// import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '../../common/middlewares/validate-objectid.middleware.js';
import {Component} from '../../types/component.types.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {fillDTO} from '../../utils/common.js';
import HttpError from '../../common/errors/http-error.js';
import {ClientSortOrder} from '../../types/sort-order.enum.js';
import {OrderServiceInterface} from './order-service.interface.js';
import CreateOrderDto from './dto/create-order.dto.js';
import OrderResponse from './response/order.response.js';

type GetOrderParams = {
  id: string;
}

type GetOrdersQuery = {
  _page: string;
  _limit: string;
  _sort: string;
  _order: string;
};

@injectable()
export default class OrderController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.OrderServiceInterface) private readonly orderService: OrderServiceInterface,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for OrderController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new PrivateRouteMiddleware()
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.orderService, 'id')
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        // new ValidateDtoMiddleware(CreateOrderDto)
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.orderService, 'id')
      ]
    });
  }

  public async index(
    req: Request<core.ParamsDictionary | GetOrdersQuery>,
    res: Response
  ): Promise<void> {
    const page = Number(req.query._page);
    const limit = Number(req.query._limit);
    const sort = String(req.query._sort);
    const order = String(req.query._order) as ClientSortOrder;
    const products = await this.orderService.find(
      sort,
      order,
      page,
      limit
    );
    const orderResponse = fillDTO(OrderResponse, products);
    this.ok(res, orderResponse);
  }

  public async show(
    {params}: Request<core.ParamsDictionary | GetOrderParams>,
    res: Response
  ) {
    const {id} = params;
    const order = await this.orderService.findById(id);
    const orderResponse = fillDTO(OrderResponse, order);
    this.ok(res, orderResponse);
  }

  public async create(
    {body, user}: Request<Record<string, unknown>, Record<string, unknown>, CreateOrderDto>,
    res: Response
  ): Promise<void> {
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'OrderController: create'
      );
    }
    const userId = user.id;
    const order = await this.orderService.create({...body, userId});
    const orderResponse = fillDTO(OrderResponse, order);
    this.created(res, orderResponse);
  }

  public async delete(
    {params, user}: Request<core.ParamsDictionary | GetOrderParams>,
    res: Response
  ): Promise<void> {
    const order = await this.orderService.findById(params.id);
    const userId = fillDTO(OrderResponse, order).user.id;

    if (user.id !== userId) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Forbidden',
        'OrderController: delete'
      );
    }

    const deletedProduct = await this.orderService.deleteById(params.id);
    this.noContent(res, deletedProduct);
  }
}
