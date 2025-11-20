import {
    IsString,
    IsEnum,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsArray
} from "class-validator";
import { VideoCategory, VideoLevel } from "../schema/video.schema";

export class CreateVideo {

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    youtubeId: string;

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
    category: VideoCategory;

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
