import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  CategoryId: number;

  @Column()
  categoryName: string;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  stock: number;

  @Column()
  description: string;

  @Column()
  weight: number;

  @Column()
  width: number;

  @Column()
  length: number;

  @Column()
  height: number;

  @Column({ nullable: true })
  image: string;

  @Column()
  price: number;
}
