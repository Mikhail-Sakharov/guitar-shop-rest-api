import {Expose} from 'class-transformer';
import {UserRole} from '../../../types/user.interface.js';

export default class LoggedUserResponse {
  @Expose()
  public token!: string;

  @Expose()
  public email!: string;

  @Expose()
  public userName!: string;

  @Expose()
  public userRole!: UserRole;
}
