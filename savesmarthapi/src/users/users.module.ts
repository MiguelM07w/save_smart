import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Login, LoginSchema } from '../login/schema/login.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Login.name,
                schema: LoginSchema,
            }
        ]),
    ],
    providers: [UsersService],
    controllers: [UsersController]
})
export class UsersModule {}