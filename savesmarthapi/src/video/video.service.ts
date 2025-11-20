import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video } from './schema/video.schema';
import { CreateVideo } from './dto/createvideo.dto';
import { UpdateVideo } from './dto/updatevideo.dto';

@Injectable()
export class VideoService {
    constructor(
        @InjectModel(Video.name) private videoModel: Model<Video>
    ) {}

    async create(createVideo: CreateVideo): Promise<Video> {
        const newVideo = new this.videoModel(createVideo);
        return await newVideo.save();
    }

    async findAll(): Promise<Video[]> {
        return await this.videoModel.find({ deletedAt: null }).exec();
    }

    async findPublished(): Promise<Video[]> {
        return await this.videoModel
            .find({ isPublished: true, deletedAt: null })
            .sort({ order: 1, createdAt: -1 })
            .exec();
    }

    async findByCategory(category: string): Promise<Video[]> {
        return await this.videoModel
            .find({ category, isPublished: true, deletedAt: null })
            .sort({ order: 1, createdAt: -1 })
            .exec();
    }

    async findFeatured(): Promise<Video[]> {
        return await this.videoModel
            .find({ isFeatured: true, isPublished: true, deletedAt: null })
            .sort({ order: 1 })
            .exec();
    }

    async findOne(id: string): Promise<Video> {
        const video = await this.videoModel.findById(id).exec();
        if (!video || video.deletedAt) {
            throw new NotFoundException(`Video with ID ${id} not found`);
        }
        return video;
    }

    async update(id: string, updateVideo: UpdateVideo): Promise<Video> {
        const video = await this.videoModel.findById(id).exec();
        if (!video || video.deletedAt) {
            throw new NotFoundException(`Video with ID ${id} not found`);
        }

        Object.assign(video, updateVideo);
        video.updatedAt = new Date();
        return await video.save();
    }

    async incrementViews(id: string): Promise<Video> {
        const video = await this.videoModel.findById(id).exec();
        if (!video || video.deletedAt) {
            throw new NotFoundException(`Video with ID ${id} not found`);
        }

        video.views = (video.views || 0) + 1;
        return await video.save();
    }

    async delete(id: string): Promise<Video> {
        const video = await this.videoModel.findById(id).exec();
        if (!video || video.deletedAt) {
            throw new NotFoundException(`Video with ID ${id} not found`);
        }

        video.deletedAt = new Date();
        return await video.save();
    }

    async restore(id: string): Promise<Video> {
        const video = await this.videoModel.findById(id).exec();
        if (!video) {
            throw new NotFoundException(`Video with ID ${id} not found`);
        }

        video.deletedAt = null;
        return await video.save();
    }
}
