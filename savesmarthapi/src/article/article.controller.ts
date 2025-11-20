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
import { ArticleService } from './article.service';
import { CreateArticle } from './dto/createarticle.dto';
import { UpdateArticle } from './dto/updatearticle.dto';

@Controller('article')
export class ArticleController {

    constructor(private articleService: ArticleService) {}

    @Post()
    async create(@Body(new ValidationPipe()) createArticle: CreateArticle) {
        return await this.articleService.create(createArticle);
    }

    @Get()
    async findAll() {
        return await this.articleService.findAll();
    }

    @Get('published')
    async findPublished() {
        return await this.articleService.findPublished();
    }

    @Get('type/:type')
    async findByType(@Param('type') type: string) {
        return await this.articleService.findByType(type);
    }

    @Get('category/:category')
    async findByCategory(@Param('category') category: string) {
        return await this.articleService.findByCategory(category);
    }

    @Get('featured')
    async findFeatured() {
        return await this.articleService.findFeatured();
    }

    @Get('slug/:slug')
    async findBySlug(@Param('slug') slug: string) {
        return await this.articleService.findBySlug(slug);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.articleService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body(new ValidationPipe()) updateArticle: UpdateArticle
    ) {
        return await this.articleService.update(id, updateArticle);
    }

    @Patch(':id/view')
    async incrementViews(@Param('id') id: string) {
        return await this.articleService.incrementViews(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.articleService.delete(id);
    }

    @Patch(':id/restore')
    async restore(@Param('id') id: string) {
        return await this.articleService.restore(id);
    }
}
