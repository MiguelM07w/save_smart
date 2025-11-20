import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class PasswordResetToken extends Document {

    @Prop({ required: true, unique: true })
    token: string;

    @Prop({ type: Types.ObjectId, ref: 'Login', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    expiresAt: Date;

    @Prop({ default: false })
    used: boolean;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

}

export const PasswordResetTokenSchema = SchemaFactory.createForClass(PasswordResetToken);
