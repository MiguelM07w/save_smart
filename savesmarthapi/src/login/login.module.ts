import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { Login, LoginSchema } from './schema/login.schema';
import { PasswordResetToken, PasswordResetTokenSchema } from './schema/password-reset-token.schema';
import { EmailModule } from '../email/email.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Login.name, schema: LoginSchema },
            { name: PasswordResetToken.name, schema: PasswordResetTokenSchema },
        ]),
        PassportModule.register({ defaultStrategy: 'google' }),
        EmailModule,
    ],
    controllers: [LoginController],
    providers: [LoginService, GoogleStrategy],
})
export class LoginModule {}
