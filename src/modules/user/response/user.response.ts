import {Expose, Transform} from 'class-transformer';
import {UserRole} from '../../../types/user.interface.js';

export default class UserResponse {
  @Transform(({obj}) => obj._id.toString())
  @Expose({name: '_id'})
  public id!: string;

  @Expose()
  public createdAt!: string;

  @Expose()
  public email!: string;

  @Expose()
  public userName!: string;

  @Expose()
  public userRole!: UserRole;
}
