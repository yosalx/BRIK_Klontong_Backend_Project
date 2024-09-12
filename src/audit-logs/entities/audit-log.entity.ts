import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entityName: string;

  @Column()
  entityId: number;

  @Column()
  action: string;

  @Column('json')
  oldValues: Record<string, any>;

  @Column('json')
  newValues: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
