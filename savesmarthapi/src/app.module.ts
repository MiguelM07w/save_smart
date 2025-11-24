import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';
import { LoginModule } from './login/login.module';
import { ReportsModule } from './reports/reports.module';
import { PaymentModule } from './payment/payment.module';
import { IncomeModule } from './income/income.module';
import { ExpenseModule } from './expense/expense.module';
import { VideoModule } from './video/video.module';
import { ArticleModule } from './article/article.module';
import { NewsModule } from './news/news.module';


@Module({
  imports: [
    // Config Module - Cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // MongooseModule.forRoot('mongodb://mongo:iSYjHUidqXllgiIdvhrCdxydVUyiMvcM@junction.proxy.rlwy.net:49497'),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/savesmarth'),
    // JWT Module - Global configuration
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'savesmarth-secret-key-change-in-production',
      signOptions: { expiresIn: '7d' }, // Token válido por 7 días
    }),
    StudentsModule,
    UsersModule,
    LoginModule,
    ReportsModule,
    PaymentModule,
    IncomeModule,
    ExpenseModule,
    VideoModule,
    ArticleModule,
    NewsModule,
     ],
  providers: [],
})
export class AppModule {}
