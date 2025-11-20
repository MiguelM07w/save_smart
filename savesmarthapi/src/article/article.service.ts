import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './schema/article.schema';
import { CreateArticle } from './dto/createarticle.dto';
import { UpdateArticle } from './dto/updatearticle.dto';

@Injectable()
export class ArticleService {
    constructor(
        @InjectModel(Article.name) private articleModel: Model<Article>
    ) {}

    async create(createArticle: CreateArticle): Promise<Article> {
        const newArticle = new this.articleModel(createArticle);
        return await newArticle.save();
    }

    async findAll(): Promise<Article[]> {
        return await this.articleModel.find({ deletedAt: null }).exec();
    }

    async findPublished(): Promise<Article[]> {
        return await this.articleModel
            .find({ isPublished: true, deletedAt: null })
            .sort({ publishedAt: -1 })
            .exec();
    }

    async findByType(type: string): Promise<Article[]> {
        return await this.articleModel
            .find({ type, isPublished: true, deletedAt: null })
            .sort({ publishedAt: -1 })
            .exec();
    }

    async findByCategory(category: string): Promise<Article[]> {
        return await this.articleModel
            .find({ category, isPublished: true, deletedAt: null })
            .sort({ publishedAt: -1 })
            .exec();
    }

    async findFeatured(): Promise<Article[]> {
        return await this.articleModel
            .find({ isFeatured: true, isPublished: true, deletedAt: null })
            .sort({ order: 1 })
            .exec();
    }

    async findBySlug(slug: string): Promise<Article> {
        const article = await this.articleModel.findOne({ slug, deletedAt: null }).exec();
        if (!article) {
            throw new NotFoundException(`Article with slug ${slug} not found`);
        }
        return article;
    }

    async findOne(id: string): Promise<Article> {
        const article = await this.articleModel.findById(id).exec();
        if (!article || article.deletedAt) {
            throw new NotFoundException(`Article with ID ${id} not found`);
        }
        return article;
    }

    async update(id: string, updateArticle: UpdateArticle): Promise<Article> {
        const article = await this.articleModel.findById(id).exec();
        if (!article || article.deletedAt) {
            throw new NotFoundException(`Article with ID ${id} not found`);
        }

        Object.assign(article, updateArticle);
        article.updatedAt = new Date();
        return await article.save();
    }

    async incrementViews(id: string): Promise<Article> {
        const article = await this.articleModel.findById(id).exec();
        if (!article || article.deletedAt) {
            throw new NotFoundException(`Article with ID ${id} not found`);
        }

        article.views = (article.views || 0) + 1;
        return await article.save();
    }

    async delete(id: string): Promise<Article> {
        const article = await this.articleModel.findById(id).exec();
        if (!article || article.deletedAt) {
            throw new NotFoundException(`Article with ID ${id} not found`);
        }

        article.deletedAt = new Date();
        return await article.save();
    }

    async restore(id: string): Promise<Article> {
        const article = await this.articleModel.findById(id).exec();
        if (!article) {
            throw new NotFoundException(`Article with ID ${id} not found`);
        }

        article.deletedAt = null;
        return await article.save();
    }
}
