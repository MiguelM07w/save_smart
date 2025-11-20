import { Injectable } from '@nestjs/common';
import { Login } from '../login/schema/login.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUser } from './dto/createuser.dto';
import { UpdateUser } from './dto/updateuser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel( Login.name ) private loginModel : Model<Login>
    ){}

    async create( user: CreateUser ){
        // Hash password si existe
        if (user.password) {
            const saltOrRounds = 10;
            user.password = await bcrypt.hash(user.password, saltOrRounds);
        }

        const createdUser = new this.loginModel( user );
        return createdUser.save();
    }

    async update( id: string, user: UpdateUser ){
        // Hash password si existe y se está actualizando
        if (user.password) {
            const saltOrRounds = 10;
            user.password = await bcrypt.hash(user.password, saltOrRounds);
        }

        return this.loginModel.findByIdAndUpdate( id, user, {
            new: true,
        })
        .exec();
    }

    async findOne( id: string ){
        return this.loginModel.findById( id ).exec();
    }

    async findAll(){
        return this.loginModel.find().exec();
    }

    async delete( id: string ){
        return this.loginModel.findByIdAndDelete( id ).exec();
    }
}