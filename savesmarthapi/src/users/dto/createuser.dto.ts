import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateUser {
    @IsString()
    @IsOptional()
    photo?: string;

    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    rol?: string; // Usuario, Administrador, etc.
}
