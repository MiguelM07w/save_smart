import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class NewsService {
  private readonly newsApiKey = process.env.NEWS_API_KEY;
  private readonly baseUrl = 'https://newsapi.org/v2';

  async getFinancialNews(page = 1, pageSize = 10) {
    try {
      const query = 'finanzas OR ahorro OR inversión OR "finanzas personales"';
      const url = `${this.baseUrl}/everything?` +
        `q=${encodeURIComponent(query)}&` +
        `language=es&` +
        `sortBy=publishedAt&` +
        `pageSize=${pageSize}&` +
        `page=${page}&` +
        `apiKey=${this.newsApiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'error') {
        throw new HttpException(data.message, HttpStatus.BAD_REQUEST);
      }

      return {
        articles: data.articles.map(article => ({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: article.source.name,
          author: article.author,
        })),
        totalResults: data.totalResults,
        page,
        pageSize,
      };
    } catch (error) {
      throw new HttpException(
        'Error al obtener noticias financieras',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBusinessNews(country = 'mx', pageSize = 10) {
    try {
      const url = `${this.baseUrl}/top-headlines?` +
        `category=business&` +
        `country=${country}&` +
        `pageSize=${pageSize}&` +
        `apiKey=${this.newsApiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'error') {
        throw new HttpException(data.message, HttpStatus.BAD_REQUEST);
      }

      return {
        articles: data.articles.map(article => ({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: article.source.name,
          author: article.author,
        })),
        totalResults: data.totalResults,
      };
    } catch (error) {
      throw new HttpException(
        'Error al obtener noticias de negocios',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchNews(query: string, page = 1, pageSize = 10) {
    try {
      const url = `${this.baseUrl}/everything?` +
        `q=${encodeURIComponent(query)}&` +
        `language=es&` +
        `sortBy=publishedAt&` +
        `pageSize=${pageSize}&` +
        `page=${page}&` +
        `apiKey=${this.newsApiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'error') {
        throw new HttpException(data.message, HttpStatus.BAD_REQUEST);
      }

      return {
        articles: data.articles.map(article => ({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: article.source.name,
          author: article.author,
        })),
        totalResults: data.totalResults,
        page,
        pageSize,
      };
    } catch (error) {
      throw new HttpException(
        'Error al buscar noticias',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
