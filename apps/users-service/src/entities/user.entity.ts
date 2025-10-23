import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  AFFILIATE = 'affiliate',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  fullName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  code: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  notificationToken?: string;

  @Column({ type: 'jsonb', nullable: true })
  address?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    shipping_address?: any;
    shipping_option?: {
      method_id: string;
      title: string;
      cost: string;
    };
  };

  @Column({ default: true })
  isFirstLogin: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
