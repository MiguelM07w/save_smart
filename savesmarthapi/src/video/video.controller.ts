import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ValidationPipe,
    Patch
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideo } from './dto/createvideo.dto';
import { UpdateVideo } from './dto/updatevideo.dto';

@Controller('video')
export class VideoController {

    constructor(private videoService: VideoService) {}

    @Post()
    async create(@Body(new ValidationPipe()) createVideo: CreateVideo) {
        return await this.videoService.create(createVideo);
    }

    @Get()
    async findAll() {
        return await this.videoService.findAll();
    }

    @Get('published')
    async findPublished() {
        return await this.videoService.findPublished();
    }

    @Get('category/:category')
    async findByCategory(@Param('category') category: string) {
        return await this.videoService.findByCategory(category);
    }

    @Get('featured')
    async findFeatured() {
        return await this.videoService.findFeatured();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.videoService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body(new ValidationPipe()) updateVideo: UpdateVideo
    ) {
        return await this.videoService.update(id, updateVideo);
    }

    @Patch(':id/view')
    async incrementViews(@Param('id') id: string) {
        return await this.videoService.incrementViews(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.videoService.delete(id);
    }

    @Patch(':id/restore')
    async restore(@Param('id') id: string) {
        return await this.videoService.restore(id);
    }
}
