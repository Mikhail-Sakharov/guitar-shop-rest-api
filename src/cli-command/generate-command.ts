import got from 'got';
import TSVFileWriter from '../common/file-writer/tsv-file-writer.js';
import ProductGenerator from '../common/product-generator/product-generator.js';
import {MockData} from '../types/mock-data.type.js';
import {CliCommandInterface} from './cli-command.interface.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const productCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return console.log(`Can't fetch data from ${url}.`);
    }

    const productGeneratorString = new ProductGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < productCount; i++) {
      await tsvFileWriter.write(productGeneratorString.generate());
    }

    console.log(`File ${filepath} was created!`);
  }
}
