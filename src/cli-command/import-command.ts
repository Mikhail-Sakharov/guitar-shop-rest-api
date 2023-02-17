import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import {CliCommandInterface} from './cli-command.interface.js';
import {createProduct, getErrorMessage} from '../utils/common.js';
import {getURI} from '../utils/db.js';
import {DatabaseInterface} from '../common/database-client/database.interface.js';
import DatabaseService from '../common/database-client/database.service.js';
import ConsoleLoggerService from '../common/logger/console-logger.service.js';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import {ProductModel} from '../modules/product/product.entity.js';
import OfferService from '../modules/product/product.service.js';
import {UserServiceInterface} from '../modules/user/user-service.interface.js';
import {UserModel} from '../modules/user/user.entity.js';
import UserService from '../modules/user/user.service.js';
import {Product} from '../types/product.interface.js';
import {ProductServiceInterface} from '../modules/product/product-service.interface.js';

const DEFAULT_DB_PORT = 27017;
const DEFAULT_USER_PASSWORD = '123456';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  private userService!: UserServiceInterface;
  private productService!: ProductServiceInterface;
  private databaseService!: DatabaseInterface;
  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.productService = new OfferService(this.logger, ProductModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new DatabaseService(this.logger);
  }

  private async saveProduct(product: Product & {userObject: {email: string, userName: string}}) {
    await this.userService.findOrCreate({
      ...product.userObject,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    const transformedProduct = JSON.parse(JSON.stringify(product));

    delete transformedProduct.userObject;

    await this.productService.create(product);
  }

  private async onLine(line: string, resolve: () => void) {
    const product = createProduct(line);
    await this.saveProduct(product);
    resolve();
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
    this.databaseService.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch(err) {
      console.log(`Can't read the file: ${getErrorMessage(err)}`);
    }
  }
}
