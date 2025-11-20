import {
    Controller,
    Post,
    Get,
    Delete,
    Put,
    Body,
    ValidationPipe,
    Param,
    UseGuards,
    Req,
    Res
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { LoginService } from './login.service';
import { CreateLogin } from './dto/createlogin.dto';
import { UpdateLogin } from './dto/updatelogin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


    @Controller('login')
    export class LoginController {
        
        constructor(
           private loginService: LoginService
        ) {}
    
        @Post()
        async login(@Body(new ValidationPipe()) updateLogin: UpdateLogin) {
            return await this.loginService.login(updateLogin);
        }
    
        @Post('register')
        async create(@Body(new ValidationPipe()) createLogin: CreateLogin) {
            return await this.loginService.create(createLogin);
        }
    
        // Actualización con PUT, ya que es una operación de modificación
        @Put('update/:id_user')  // Cambié de POST a PUT
        async update(
            @Param('id_user') id_user: string,  // Asegurando que el id es un string
            @Body(new ValidationPipe()) updateLogin: UpdateLogin
        ) {
            return await this.loginService.update(id_user, updateLogin);
        }
    
      
    
        @Get('')
        async findAll() {
            return await this.loginService.findAll();
        }
    
        @Get('find/:id_user')
        async findOne(@Param('id_user') id_user: string) {
            return await this.loginService.findOne(id_user);
        }


    
        // Perfil actualizado también con PUT
        @Put('update/:id')  // Cambié de POST a PUT
        async updateProfile(
            @Param('id') id: string,
            @Body() updateLogin: UpdateLogin
        ) {
            return await this.loginService.update(id, updateLogin);
        }
    
        @Delete('delete/:id_user')
        async delete(@Param('id_user') id_user: string) {
            return await this.loginService.delete(id_user);
        }

        @Post('forgot-password')
        async forgotPassword(@Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto) {
            return await this.loginService.forgotPassword(forgotPasswordDto.email);
        }

        @Post('reset-password')
        async resetPassword(@Body(new ValidationPipe()) resetPasswordDto: ResetPasswordDto) {
            return await this.loginService.resetPassword(
                resetPasswordDto.token,
                resetPasswordDto.newPassword
            );
        }

        @Get('google')
        @UseGuards(AuthGuard('google'))
        async googleAuth() {
            // Guard redirects to Google
        }

        @Get('google/callback')
        @UseGuards(AuthGuard('google'))
        async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
            return this.loginService.googleLogin(req.user, res);
        }
    }
    

