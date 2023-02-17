import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import {UserRole} from '../../types/user.interface.js';
import {createSHA256} from '../../utils/common.js';

const {prop, modelOptions} = typegoose;

interface User {
  email: string;
  userName: string;
  password: string;
  userRole?: UserRole;
}

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.email = data.email;
    this.userName = data.userName;
    this.password = data.password;
    this.userRole = data.userRole ?? UserRole.User;
  }

  @prop()
  public email!: string;

  @prop()
  public userName!: string;

  @prop()
  public password!: string;

  @prop()
  public userRole!: UserRole;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
