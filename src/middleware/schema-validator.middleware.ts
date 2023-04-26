import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import Joi from 'joi';

@Injectable()
export class SchemaValidatorMiddleware implements CanActivate {
  constructor(private readonly schema: Joi.ObjectSchema) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    try 
    {
      await this.schema.validateAsync(req.body);
      return true;
    }
     catch (err) 
    {
      res.send({value: null, err: `Invalid request data: ${err.message}`});
    }
  }
}

//exporting schemas:
export const sendUrlSchema = Joi.object({
    url: Joi.string().uri().min(14).required(),
  });