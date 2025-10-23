// apps/cart-service/src/entities/cart.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity()
@Index(['userId']) 
@Index(['guestId'])
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' }) 
  userId?: string;

  @Column({ nullable: true, type: 'varchar' })
  guestId?: string;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column('json', { default: () => "'[]'" })
  variation: { attribute: string; value: string }[];

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'varchar', nullable: true })
  price?: string;

  @Column({ nullable: true, type: 'varchar' })
  couponCode?: string;

  @Column({ type: 'float', nullable: true, default: 0 })
  discountPercentage?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
