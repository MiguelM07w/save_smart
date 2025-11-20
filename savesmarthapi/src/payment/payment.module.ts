// payment.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { Expense, ExpenseSchema } from '../expense/schema/expenses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Expense.name, schema: ExpenseSchema }, // Para crear gastos automáticamente
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
