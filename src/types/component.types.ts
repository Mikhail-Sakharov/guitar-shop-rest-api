export const Component = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  ProductServiceInterface: Symbol.for('ProductServiceInterface'),
  ProductModel: Symbol.for('ProductModel'),
  ReviewServiceInterface: Symbol.for('ReviewServiceInterface'),
  ReviewModel: Symbol.for('ReviewModel'),
  ReviewController: Symbol.for('ReviewController'),
  ProductController: Symbol.for('ProductController'),
  UserController: Symbol.for('UserController'),
  ExceptionFilterInterface: Symbol.for('ExceptionFilterInterface')
} as const;
