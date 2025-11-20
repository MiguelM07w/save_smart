import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { PaymentStatus } from 'src/payment/schema/payment.schema';

export class CreatePayment {
  @IsMongoId()
  userId: Types.ObjectId; // Relación con Users (requerido)

  @IsString()
  concept: string;

  @IsNumber()
  amount: number;

  @IsString()
  method: string; // Ej. 'Card', 'Cash', 'Transfer'

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus; // Pending | Completed | Cancelled

  @IsBoolean()
  @IsOptional()
  isScheduled?: boolean;

  @IsString()
  @IsOptional()
  frequency?: string;

  @IsOptional()
  dueDate?: Date;

  @IsOptional()
  startDate?: Date;
}
