import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Affiliate } from './affiliate.entity';

@Entity('affiliate_transactions')
export class AffiliateTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Affiliate, (affiliate) => affiliate.transactions, { onDelete: 'CASCADE' })
  affiliate: Affiliate;

  @Column('float')
  amount: number;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
