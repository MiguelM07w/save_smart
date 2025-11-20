import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentStatus } from './schema/payment.schema';
import { Expense } from 'src/expense/schema/expenses.schema';
import { CreatePayment } from './dto/createpayment.dto';
import { UpdatePayment } from './dto/updatepayment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Expense.name) private readonly expenseModel: Model<Expense>,
  ) {}

  // Crear un pago normal o programado
  async create(paymentData: CreatePayment): Promise<Payment> {
    const payment = new this.paymentModel(paymentData);
    const savedPayment = await payment.save();

    // Si el pago se crea como Completed, crear Expense automáticamente
    if (savedPayment.status === PaymentStatus.Completed) {
      await this.createExpenseFromPayment(savedPayment);
    }

    return savedPayment;
  }

  // Crear pago programado
  async createScheduled(paymentData: CreatePayment): Promise<Payment> {
    const scheduled = new this.paymentModel({
      ...paymentData,
      isScheduled: true,
    });
    return scheduled.save();
  }

  // Obtener pagos programados
  async findScheduled(): Promise<Payment[]> {
    return this.paymentModel.find({ isScheduled: true, deletedAt: null }).exec();
  }

  // Eliminar pago programado
  async deleteScheduled(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');
    const payment = await this.paymentModel.findOneAndUpdate(
      { _id: id, isScheduled: true, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    ).exec();
    if (!payment) throw new NotFoundException(`Pago programado con ID ${id} no encontrado`);
    return payment;
  }

  // Completar pago programado
  async completeScheduled(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');
    const payment = await this.paymentModel.findOne({ _id: id, isScheduled: true, deletedAt: null }).exec();
    if (!payment) throw new NotFoundException(`Pago programado con ID ${id} no encontrado`);
    payment.status = PaymentStatus.Completed;
    return payment.save();
  }

  // Métodos existentes...
  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find({ deletedAt: null, isScheduled: false }).exec();
  }

  async findOne(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');
    const payment = await this.paymentModel.findOne({ _id: id, deletedAt: null }).exec();
    if (!payment) throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    return payment;
  }

  async update(id: string, updateData: UpdatePayment): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');

    const oldPayment = await this.paymentModel.findOne({ _id: id, deletedAt: null }).exec();
    if (!oldPayment) throw new NotFoundException(`Pago con ID ${id} no encontrado`);

    const payment = await this.paymentModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      updateData,
      { new: true, runValidators: true }
    ).exec();

    // Si cambió a Completed, crear Expense automáticamente
    if (oldPayment.status !== PaymentStatus.Completed && payment.status === PaymentStatus.Completed) {
      await this.createExpenseFromPayment(payment);
    }

    return payment;
  }

  async delete(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');
    const payment = await this.paymentModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    ).exec();
    if (!payment) throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    return payment;
  }

  async restore(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');
    const payment = await this.paymentModel.findOneAndUpdate(
      { _id: id, deletedAt: { $ne: null } },
      { deletedAt: null },
      { new: true }
    ).exec();
    if (!payment) throw new NotFoundException(`Pago con ID ${id} no encontrado o no eliminado`);
    return payment;
  }

  async markPaymentAsCompleted(paymentId: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(paymentId)) throw new BadRequestException('Payment ID no válido');
    const payment = await this.paymentModel.findOne({ _id: paymentId, deletedAt: null }).exec();
    if (!payment) throw new NotFoundException('Pago no encontrado');

    const oldStatus = payment.status;
    payment.status = PaymentStatus.Completed;
    const savedPayment = await payment.save();

    // Crear Expense si cambió a Completed
    if (oldStatus !== PaymentStatus.Completed) {
      await this.createExpenseFromPayment(savedPayment);
    }

    return savedPayment;
  }

  // Obtener pagos de un usuario específico
  async findByUser(userId: string): Promise<Payment[]> {
    if (!Types.ObjectId.isValid(userId)) throw new BadRequestException('User ID no válido');
    return this.paymentModel.find({ userId, deletedAt: null }).sort({ createdAt: -1 }).exec();
  }

  // Crear Expense automáticamente cuando el pago se completa
  private async createExpenseFromPayment(payment: any): Promise<void> {
    const expense = new this.expenseModel({
      iduser: payment.userId,
      title: `Pago: ${payment.concept}`,
      concept: payment.concept,
      amount: payment.amount,
      source: payment.method,
      category: 'Pagos',
      date: new Date(),
      notes: `Generado automáticamente desde pago ID: ${payment._id?.toString() || 'N/A'}`,
      deletedAt: null,
      profits: 0, // Se recalculará en el expense service
    });
    await expense.save();
  }
}
