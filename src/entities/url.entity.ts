import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'Url',
  })
export class Url {
    @PrimaryGeneratedColumn()
    id: string;

  @Column({
    name: 'originalUrl', 
    type: 'varchar',
  })
  //@Index({ unique: true })
  originalUrl: string;

  @Column({
    name: 'shortUrl',
    type: 'varchar',
  })
  //@Index({ unique: true })
  shortUrl: string;

  constructor(originalUrl: string, shortUrl: string) {
    this.originalUrl = originalUrl;
    this.shortUrl = shortUrl;
}
}