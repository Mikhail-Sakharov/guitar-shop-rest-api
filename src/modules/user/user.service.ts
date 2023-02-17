import {inject, injectable} from 'inversify';
import {UserEntity} from './user.entity.js';
import {DocumentType, types} from '@typegoose/typegoose';
import CreateUserDto from './dto/create-user.dto.js';
import {UserServiceInterface} from './user-service.interface.js';
import LoginUserDto from './dto/login-user.dto.js';
import UpdateUserDto from './dto/update-user.dto.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.types.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    if (dto.password.length < 6 || dto.password.length > 12) {
      this.logger.error('Password length must be between 6 and 12 characters');
    }
    const userEntity = new UserEntity(dto);
    userEntity.setPassword(dto.password, salt);

    const user = await this.userModel.create(userEntity);
    this.logger.info(`New user created: ${userEntity.email}`);

    return user;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(userId).exec();
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, {new: true})
      .exec();
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      return null;
    }

    if (user.verifyPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }
}
