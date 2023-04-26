import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from '../entities/url.entity';
import * as tinyurl from 'tinyurl';
import { isURL } from 'class-validator';//I wouldn't recommend my worst enemies to use a dns library

@Injectable()
export class UrlService {
    private readonly tinyurlToken = "z3MIRLCp876cUAIiRQfRjLbtsWh2POkpyFTtVZPU85wOhGosJKZeV4xQOLgB";
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {
  }

 async findAll(): Promise<Url[]> {
    return await this.urlRepository.find();
  }

  async myShorten(url): Promise<string>
  {
    try
    {
        let res = await tinyurl.shorten(url, {
            token: this.tinyurlToken,
        });
        if(res === "Error")
            throw new Error('');
        return res;
    }
    catch(err)
    {
        throw new Error('cant short url now...');
    }
  }


  async createShortUrl(originalUrl: string): Promise<string>
  {
    try 
    {
        if(!isURL(originalUrl))
            throw new Error('The url is not valid');

        const url = await this.urlRepository.findOne({
            where:{ 'originalUrl':originalUrl },
        });
        if(url)
            return url.shortUrl;

        let shortUrl = this.myShorten(originalUrl);
        const newUrlE = new Url(originalUrl, (await shortUrl).toString());
        await this.urlRepository.save(newUrlE);
        return shortUrl;
    } 
    catch(err) 
    {
        throw err;
    }
  }
  
  async getOriginalUrl(shortUrl: string): Promise<string>
   {
    const url = await this.urlRepository.findOne({
        where: { shortUrl:shortUrl }
    });
    if(url !== null)
        return url.originalUrl;

    throw new Error("Short url not found in the db");
  }
}