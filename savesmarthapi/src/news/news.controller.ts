import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('financial')
  async getFinancialNews(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 10;
    return this.newsService.getFinancialNews(pageNum, pageSizeNum);
  }

  @Get('business')
  async getBusinessNews(
    @Query('country') country?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 10;
    return this.newsService.getBusinessNews(country || 'mx', pageSizeNum);
  }

  @Get('search')
  async searchNews(
    @Query('q') query: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 10;
    return this.newsService.searchNews(query, pageNum, pageSizeNum);
  }
}
