import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Login extends Document {

    @Prop()
    photo?: string;

    @Prop({unique:true, sparse: true})
    username?: string;

    @Prop({unique:true})
    email?: string;

    @Prop()
    password?: string;

    @Prop()
    rol?: string;

    @Prop({ unique: true, sparse: true })
    googleId?: string;

    @Prop({ default: 'local' })
    authProvider?: string; // 'local' | 'google'

    @Prop({ type: Date, default: Date.now })
    update?: Date;

}

export const LoginSchema = SchemaFactory.createForClass(Login);
