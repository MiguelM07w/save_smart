import {
    IsString,
    IsEnum,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsArray,
    IsDateString
} from "class-validator";
import { ArticleType, ArticleCategory, ArticleLevel } from "../schema/article.schema";

export class CreateArticle {

    @IsString()
    title: string;

    @IsString()
    slug: string;

    @IsString()
    @IsOptional()
    excerpt?: string;

    @IsString()
    content: string;

    @IsEnum(ArticleType)
    type: ArticleType;

    @IsEnum(ArticleCategory)
    category: ArticleCategory;

    @IsString()
    @IsOptional()
    coverImage?: string;

    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsString()
    author: string;

    @IsString()
    @IsOptional()
    authorId?: string;

    @IsNumber()
    @IsOptional()
    readingTime?: number;

    @IsBoolean()
    @IsOptional()
    isOwnContent?: boolean;

    @IsString()
    @IsOptional()
    externalUrl?: string;

    @IsString()
    @IsOptional()
    source?: string;

    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;

    @IsDateString()
    @IsOptional()
    publishedAt?: Date;

    @IsNumber()
    @IsOptional()
    order?: number;

    @IsEnum(ArticleLevel)
    @IsOptional()
    level?: ArticleLevel;
}
