import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  wcOrderId: string;

  @Column({ nullable: true })
  wcOrderKey: string;

  @Column({ nullable: true })
  wcOrderStatus: string;

  @Column({ nullable: true })
  wcPaymentStatus: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  total: string;

  @Column({ default: 0 })
  shippingCost: string;


  @Column({ nullable: true })
  userId: string;

  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  items: any;

  @Column({ type: 'jsonb', nullable: true })
  customerData: any;

  @Column({ type: 'varchar', nullable: true })
  paymentMethod: string;

  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  paymentData: any;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @Column({ default: false })
  isDelivered: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @Column({ nullable: true })
  skipCashPaymentUrl: string;

  @Column({ nullable: true })
  skipCashTransactionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
