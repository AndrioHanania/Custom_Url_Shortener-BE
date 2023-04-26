import { Test } from '@nestjs/testing';
import { UrlService } from '../url.service';
import { Url } from '../../entities/url.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

//create a mock repository for testing purposes (meaning: we don't use the real db)
const mockRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  });

  //set up the testing module with the mock repository
describe('UrlService', () => {
    let urlService: UrlService;
    let urlRepository;
  
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [
          UrlService,
          {
            provide: getRepositoryToken(Url),
            useFactory: mockRepository,
          },
        ],
    }).compile();
  
    urlService = module.get<UrlService>(UrlService);
    urlRepository = module.get<Repository<Url>>(getRepositoryToken(Url));
    });
  
    // Test cases:
    it("findAll", async () => {
        console.log("Test goal: findAll should return a list of urls");
        const urls: Url[] = [new Url('https://example.com', 'https://tinyurl.com/peakb')];

        urlRepository.find.mockResolvedValue(urls);
        const result = await urlService.findAll();
        expect(result).toEqual(urls);
    });

    it("createShortUrl", async () => {
        console.log("Test goal: createShortUrl should return a short url");
        const originalUrl = 'https://example.com';
        const shortUrl = 'https://tinyurl.com/peakb';

        urlRepository.findOne.mockResolvedValue(null);
        const result = await urlService.createShortUrl(originalUrl);
        expect(result).toEqual(shortUrl);
        expect(urlRepository.save).toHaveBeenCalled();
    });

    it("createShortUrlWithInvalidUrl", async () => {
        console.log("Test goal: createShortUrl should throw an error if the url is invalid");
        const invalidUrl = 'invalid-url';
        await expect(urlService.createShortUrl(invalidUrl)).rejects.toThrow("The url is not valid");
    });

    it("getOriginalUrl", async () => {
        console.log("Test goal: getOriginalUrl should return the original url");
        const originalUrl = 'https://example.com';
        const shortUrl = 'https://tinyurl.com/peakb';
        const url = new Url(originalUrl, shortUrl);

        urlRepository.findOne.mockResolvedValue(url);
        const result = await urlService.getOriginalUrl(shortUrl);
        expect(result).toEqual(originalUrl);
    });

    it("getOriginalUrlWithInvalidShortUrl", async () => {
        console.log("Test goal: getOriginalUrl should throw an error if the url is not in db");
        const shortUrlInValid = 'shortUrl not in db';
        urlRepository.findOne.mockResolvedValue(null);
        await expect(urlService.getOriginalUrl(shortUrlInValid)).rejects.toThrow("Short url not found in the db");
    });
});