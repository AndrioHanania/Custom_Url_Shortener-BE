import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UrlService } from '../services/url.service';
import Joi from 'joi';
import { SchemaValidatorMiddleware } from '../middleware/schema-validator.middleware';
import { sendUrlSchema } from '../middleware/schema-validator.middleware';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger/dist';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';


export class UrlDTO {
  @ApiProperty({
    type: String,
  })
  url: string;
}





@ApiTags('UrlController')
@Controller("/url")
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @ApiOperation({ summary: "get tiny url"})
  @ApiBody({ type: UrlDTO, description: "The original url to shorten"})
  @Post("/shortenUrl")
  @UseGuards(new SchemaValidatorMiddleware(sendUrlSchema))
  async shortenUrl(@Req() req: Request, @Res() res: Response) {
    const { url } = req.body;
    try
    {
        const shortUrl = await this.urlService.createShortUrl(url);
        res.send({value: shortUrl, err: null});
    }
    catch(err){
        console.error(err);
        if(err instanceof Error) 
            res.send({value: null, err: err.message});
        else
            res.send({value: null, err: "Failed to get shorten url."});
   }
  }

  @ApiOperation({ summary: "get original url"})
  @ApiBody({ type: UrlDTO, description: "The tiny url to get the original url from"})
  @Post("fullUrl")
  @UseGuards(new SchemaValidatorMiddleware(sendUrlSchema))
  async fullUrl(@Req() req: Request, @Res() res: Response) {
    const { url } = req.body;
    try{
    const originalUrl = await this.urlService.getOriginalUrl(url);
    res.send({value: originalUrl, err: null});
    }catch(err){
        console.error(err);
        if(err instanceof Error) 
            res.send({value: null, err: err.message});
        else
            res.send({value: null, err: "Failed to get original url."});
    }
  }
}