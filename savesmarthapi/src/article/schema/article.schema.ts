import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum ArticleType {
    Tip = 'tip',
    Noticia = 'noticia',
    Guia = 'guia',
}

export enum ArticleCategory {
    Ahorro = 'Ahorro',
    Inversión = 'Inversión',
    Presupuesto = 'Presupuesto',
    Deudas = 'Deudas',
    General = 'General',
}

export enum ArticleLevel {
    Principiante = 'principiante',
    Intermedio = 'intermedio',
    Avanzado = 'avanzado',
}

@Schema()
export class Article extends Document {

    @Prop({ required: true })
    title: string;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop()
    excerpt?: string;

    @Prop({ required: true })
    content: string;

    @Prop({ enum: ArticleType, required: true })
    type: ArticleType;

    @Prop({ enum: ArticleCategory, required: true })
    category: ArticleCategory;

    @Prop()
    coverImage?: string;

    @Prop({ type: [String], default: [] })
    tags?: string[];

    @Prop({ required: true })
    author: string;

    @Prop()
    authorId?: string;

    @Prop()
    readingTime?: number;

    @Prop({ default: true })
    isOwnContent?: boolean;

    @Prop()
    externalUrl?: string;

    @Prop()
    source?: string;

    @Prop({ default: true })
    isPublished?: boolean;

    @Prop({ default: false })
    isFeatured?: boolean;

    @Prop({ type: Date, default: Date.now })
    publishedAt?: Date;

    @Prop({ default: 0 })
    order?: number;

    @Prop({ default: 0 })
    views?: number;

    @Prop({ enum: ArticleLevel, default: ArticleLevel.Principiante })
    level?: ArticleLevel;

    @Prop({ type: Date, default: Date.now })
    createdAt?: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt?: Date;

    @Prop({ type: Date, default: null })
    deletedAt?: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

// Índices
ArticleSchema.index({ slug: 1 }, { unique: true });
ArticleSchema.index({ category: 1, isPublished: 1 });
ArticleSchema.index({ publishedAt: -1 });
