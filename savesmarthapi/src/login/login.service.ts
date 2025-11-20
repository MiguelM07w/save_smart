import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Response } from 'express';
import { Login } from './schema/login.schema';
import { PasswordResetToken } from './schema/password-reset-token.schema';
import { CreateLogin } from './dto/createlogin.dto';
import { UpdateLogin } from './dto/updatelogin.dto';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class LoginService {

    constructor(
        @InjectModel(Login.name)
        private loginModel: Model<Login>,
        @InjectModel(PasswordResetToken.name)
        private passwordResetTokenModel: Model<PasswordResetToken>,
        private jwtService: JwtService,
        private emailService: EmailService
    ){}

    async login(updateLogin: UpdateLogin) {
        try {
            const user = await this.loginModel.findOne({ email: updateLogin.email });
            if (!user) return false;

            const isPasswordMatch = await bcrypt.compare(updateLogin.password, user.password);

            if (!isPasswordMatch) return false;

            // Generar JWT token
            const payload = {
                sub: user._id.toString(),
                email: user.email,
                username: user.username,
                rol: user.rol
            };
            const token = this.jwtService.sign(payload);

            // Devolver user + token
            const userObject = user.toObject();
            return {
                ...userObject,
                token,
                password: undefined // No enviar password al frontend
            };
        } catch (error) {
            return false;
        }
    }

    async create(createLogin: CreateLogin) {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(createLogin.password, saltOrRounds);
        const newUser = new this.loginModel({ ...createLogin, password: hash });

        return await newUser.save();
    }

    async update(id_user: string, updateLogin: UpdateLogin) {
        try {
            if (updateLogin.password) {
                const saltOrRounds = 10;
                updateLogin.password = await bcrypt.hash(updateLogin.password, saltOrRounds);
            }
            return await this.loginModel.findByIdAndUpdate(id_user, updateLogin, { new: true });
        } catch (error) {
            return null;
        }
    }
    
    async findAll() {
        return await this.loginModel.find();
    }

    async findOne(id_user: string) {
        return await this.loginModel.findById(id_user);
    }

    async delete(id_user: string) {
        return await this.loginModel.findByIdAndDelete(id_user);
    }

    async forgotPassword(email: string) {
        // Buscar usuario por email
        const user = await this.loginModel.findOne({ email });
        if (!user) {
            throw new NotFoundException('No existe una cuenta con ese correo electrónico');
        }

        // Generar token único
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(resetToken, 10);

        // Guardar token en BD con expiración de 30 minutos
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30);

        await this.passwordResetTokenModel.create({
            token: hashedToken,
            userId: user._id,
            expiresAt,
            used: false,
        });

        // Enviar email
        await this.emailService.sendPasswordResetEmail(user.email, resetToken);

        return {
            message: 'Se ha enviado un correo de recuperación a tu email',
            success: true,
        };
    }

    async resetPassword(token: string, newPassword: string) {
        // Buscar todos los tokens no usados y no expirados
        const resetTokens = await this.passwordResetTokenModel.find({
            used: false,
            expiresAt: { $gt: new Date() },
        });

        // Verificar si alguno coincide con el token proporcionado
        let validToken = null;
        for (const tokenDoc of resetTokens) {
            const isValid = await bcrypt.compare(token, tokenDoc.token);
            if (isValid) {
                validToken = tokenDoc;
                break;
            }
        }

        if (!validToken) {
            throw new BadRequestException('Token inválido o expirado');
        }

        // Marcar token como usado
        validToken.used = true;
        await validToken.save();

        // Actualizar contraseña del usuario
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);

        await this.loginModel.findByIdAndUpdate(validToken.userId, {
            password: hashedPassword,
        });

        return {
            message: 'Contraseña actualizada exitosamente',
            success: true,
        };
    }

    async googleLogin(user: any, res: Response) {
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
        }

        // Generar JWT token
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            username: user.username,
            rol: user.rol
        };
        const token = this.jwtService.sign(payload);

        // Preparar datos del usuario sin password
        const userObject = user.toObject ? user.toObject() : user;
        const userData = {
            ...userObject,
            token,
            password: undefined
        };

        // Redirigir al frontend con el token y datos del usuario
        const userDataEncoded = encodeURIComponent(JSON.stringify(userData));
        return res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?user=${userDataEncoded}`);
    }
}