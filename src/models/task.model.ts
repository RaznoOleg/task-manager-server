import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { TaskStatus } from '../types/taskStatus.enum';

@Entity('tasks')
@Tree('materialized-path')
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status!: TaskStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @TreeChildren()
  subtasks?: Task[];

  @TreeParent({ onDelete: 'CASCADE' })
  parentTask?: Task;
}
