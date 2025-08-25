import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, unique: true })
  phone: string;

  @Column('varchar', { nullable: false })
  password: string;

  @Column('varchar', { nullable: false, unique: false })
  name: string;

  @Column('text', { nullable: true, unique: false })
  profilePicture?: string;

  @Column('boolean', { nullable: false, unique: false, default: true })
  isActive: boolean;

  @Column('varchar', { nullable: true, unique: false })
  status?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
