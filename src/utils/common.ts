import crypto from 'crypto';
import * as jose from 'jose';
import {plainToInstance, ClassConstructor} from 'class-transformer';
import {ValidationError} from 'class-validator';
import {GuitarType, StringsCount} from '../types/product.interface.js';
import {ValidationErrorField} from '../types/validation-error-field.type.js';
import {ServiceError} from '../types/service-error.enum.js';
import {DEFAULT_STATIC_IMAGES} from '../app/application.constant.js';
import {UnknownObject} from '../types/unknown-object.type.js';

export const createProduct = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    authorId,
    title,
    description,
    image,
    gType,
    sku,
    sCount,
    price,
    user
  ] = tokens;

  const userData = user.split(';');
  const [email, userName] = userData;
  const userObject = {
    email,
    userName
  };
  const guitarType = gType as GuitarType;
  const stringsCount = Number(sCount) as StringsCount;

  return {
    authorId,
    title,
    description,
    image,
    guitarType,
    sku,
    stringsCount,
    price: Number(price),
    userObject
  };
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export const createErrorObject = (serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: UnknownObject,
  transformFn: (object: UnknownObject) => void
) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownObject, transformFn);
      }
    });
};

export const transformObject = (properties: string[], staticPath: string, uploadPath: string, data:UnknownObject) => {
  properties
    .forEach((property) => transformProperty(property, data, (target: UnknownObject) => {
      if (Array.isArray(target[property])) {
        const transformedValue = (target[property] as string[]).map((path) => path === '' ? '' : `${uploadPath}/${path}`);
        target[property] = transformedValue;
      } else {
        const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
        target[property] = target[property] === '' ? '' : `${rootPath}/${target[property]}`;
      }
    }));
};
