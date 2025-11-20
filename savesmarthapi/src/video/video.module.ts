import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { Video, VideoSchema } from './schema/video.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Video.name, schema: VideoSchema }
        ])
    ],
    controllers: [VideoController],
    providers: [VideoService],
    exports: [VideoService]
})
export class VideoModule {}
