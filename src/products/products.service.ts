import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<[Product[], number]> {
    const query = this.productRepository.createQueryBuilder('product');

    if (search) {
      query.where(
        'product.name LIKE :search OR product.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    query.skip((page - 1) * limit).take(limit);

    return await query.getManyAndCount();
  }

  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
