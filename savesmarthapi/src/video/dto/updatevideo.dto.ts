import {
    IsString,
    IsEnum,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsArray
} from "class-validator";
import { VideoCategory, VideoLevel } from "../schema/video.schema";

export class UpdateVideo {

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    youtubeId?: string;

    @IsString()
    @IsOptional()
    thumbnail?: string;

    @IsNumber()
    @IsOptional()
    duration?: number;

    @IsString()
    @IsOptional()
    durationFormatted?: string;

    @IsEnum(VideoCategory)
    @IsOptional()
    category?: VideoCategory;

    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsBoolean()
    @IsOptional()
    isOwnContent?: boolean;

    @IsString()
    @IsOptional()
    author?: string;

    @IsNumber()
    @IsOptional()
    order?: number;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;

    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;

    @IsEnum(VideoLevel)
    @IsOptional()
    level?: VideoLevel;
}
