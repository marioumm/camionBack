import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity()
@Index(['userId']) 
@Index(['guestId']) 
export class WishlistItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  userId?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  guestId?: string | null;

  @Column()
  productId: string;

  @Column()
  productName: string;

  @Column({ nullable: true })
  productImage: string;

  @Column('varchar', { default: '0' })
  price: string;

  @CreateDateColumn()
  createdAt: Date;
}
