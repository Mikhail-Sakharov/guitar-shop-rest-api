import {
  MockData,
  getRandomItem,
  generateRandomValue
} from '../index.js';
import {ProductGeneratorInterface} from './product-generator.interface.js';

export default class ProductGenerator implements ProductGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const authorId = getRandomItem<string>(this.mockData.authorIds);
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const image = getRandomItem<string>(this.mockData.images);
    const guitarType = getRandomItem<string>(this.mockData.guitarTypes);
    const sku = `${Number(new Date())}`;
    const stringsCount = getRandomItem<number>(this.mockData.stringsCounts);
    const price = generateRandomValue(100, 1000000);

    const email = getRandomItem<string>(this.mockData.emails);
    const userName = getRandomItem<string>(this.mockData.names);
    const user = `${email};${userName}`;

    return [
      authorId,
      title,
      description,
      image,
      guitarType,
      sku,
      stringsCount,
      price,
      user
    ].join('\t');
  }
}


