import 'reflect-metadata';
import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {LoggerInterface} from './common/logger/logger.interface.js';
import {ConfigInterface} from './common/config/config.interface.js';
import {Component} from './types/component.types.js';
import Application from './app/application.js';
import ConfigService from './common/config/config.service.js';
import LoggerService from './common/logger/logger.service.js';
import {DatabaseInterface} from './common/database-client/database.interface.js';
import DatabaseService from './common/database-client/database.service.js';
import {UserServiceInterface} from './modules/user/user-service.interface.js';
import UserService from './modules/user/user.service.js';
import {UserEntity, UserModel} from './modules/user/user.entity.js';
import {ProductServiceInterface} from './modules/product/product-service.interface.js';
import {ProductEntity, ProductModel} from './modules/product/product.entity.js';
import {ControllerInterface} from './common/controller/controller.interface.js';
import ProductController from './modules/product/product.controller.js';
import UserController from './modules/user/user.controller.js';
import {ExceptionFilterInterface} from './common/errors/exception-filter.interface.js';
import ExceptionFilter from './common/errors/exception-filter.js';
import ProductService from './modules/product/product.service.js';
import ReviewService from './modules/review/review.service.js';
import {ReviewEntity, ReviewModel} from './modules/review/review.entity.js';
import {ReviewServiceInterface} from './modules/review/review-service.interface.js';
import ReviewController from './modules/review/review.controller.js';

const applicationContainer = new Container();

applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();

applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
applicationContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
applicationContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseService).inSingletonScope();
applicationContainer.bind<ExceptionFilterInterface>(Component.ExceptionFilterInterface).to(ExceptionFilter).inSingletonScope();

applicationContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService);
applicationContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);

applicationContainer.bind<ProductServiceInterface>(Component.ProductServiceInterface).to(ProductService);
applicationContainer.bind<types.ModelType<ProductEntity>>(Component.ProductModel).toConstantValue(ProductModel);

applicationContainer.bind<ReviewServiceInterface>(Component.ReviewServiceInterface).to(ReviewService);
applicationContainer.bind<types.ModelType<ReviewEntity>>(Component.ReviewModel).toConstantValue(ReviewModel);

applicationContainer.bind<ControllerInterface>(Component.ReviewController).to(ReviewController).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.ProductController).to(ProductController).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.UserController).to(UserController).inSingletonScope();

const application = applicationContainer.get<Application>(Component.Application);
await application.init();
