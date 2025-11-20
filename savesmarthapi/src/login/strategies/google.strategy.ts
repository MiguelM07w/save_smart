import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Login } from '../schema/login.schema';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectModel(Login.name)
    private loginModel: Model<Login>,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, displayName, photos } = profile;

    try {
      // Buscar usuario por googleId
      let user = await this.loginModel.findOne({ googleId: id });

      if (!user) {
        // Si no existe, buscar por email
        const email = emails[0].value;
        user = await this.loginModel.findOne({ email });

        if (user) {
          // Usuario existe con email pero sin Google vinculado
          user.googleId = id;
          user.authProvider = 'google';
          if (photos && photos.length > 0) {
            user.photo = photos[0].value;
          }
          await user.save();
        } else {
          // Crear nuevo usuario
          user = await this.loginModel.create({
            googleId: id,
            email: email,
            username: displayName || email.split('@')[0],
            photo: photos && photos.length > 0 ? photos[0].value : undefined,
            authProvider: 'google',
            rol: 'Usuario', // Rol por defecto
            // No se establece password para cuentas de Google
          });
        }
      }

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
