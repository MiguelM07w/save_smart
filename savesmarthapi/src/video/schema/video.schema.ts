import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum VideoCategory {
    Presupuesto = 'Presupuesto',
    Ahorro = 'Ahorro',
    Inversión = 'Inversión',
    Deudas = 'Deudas',
    EducaciónFinanciera = 'Educación Financiera',
    Tips = 'Tips',
}

export enum VideoLevel {
    Principiante = 'principiante',
    Intermedio = 'intermedio',
    Avanzado = 'avanzado',
}

@Schema()
export class Video extends Document {

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    youtubeId: string;

    @Prop()
    thumbnail?: string;

    @Prop()
    duration?: number;

    @Prop()
    durationFormatted?: string;

    @Prop({ enum: VideoCategory, required: true })
    category: VideoCategory;

    @Prop({ type: [String], default: [] })
    tags?: string[];

    @Prop({ default: false })
    isOwnContent?: boolean;

    @Prop()
    author?: string;

    @Prop({ default: 0 })
    order?: number;

    @Prop({ default: false })
    isFeatured?: boolean;

    @Prop({ default: true })
    isPublished?: boolean;

    @Prop({ enum: VideoLevel, default: VideoLevel.Principiante })
    level?: VideoLevel;

    @Prop({ default: 0 })
    views?: number;

    @Prop({ type: Date, default: Date.now })
    createdAt?: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt?: Date;

    @Prop({ type: Date, default: null })
    deletedAt?: Date;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
