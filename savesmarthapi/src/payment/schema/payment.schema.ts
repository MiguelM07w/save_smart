import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

export enum PaymentStatus {
  Pending = 'pending',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

@Schema({ timestamps: true })
export class Payment {

  @Prop()
  concept: string;

  @Prop()
  amount: number;

  @Prop()
  method: string;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.Pending })
  status: PaymentStatus;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  userId: Types.ObjectId; // Relacionado con Users en vez de student

  @Prop({ type: Date, default: null }) // Soft delete
  deletedAt: Date | null;

  // --- NUEVO ---
  @Prop({ default: false })
  isScheduled: boolean;

  @Prop({ type: String, enum: ['daily', 'weekly', 'friday', 'saturday'], required: false })
  frequency?: string;

  @Prop({ type: Date, required: false })
  dueDate?: Date;

  @Prop({ type: Date, required: false })
  startDate?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
