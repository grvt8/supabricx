import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/database/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/me (GET) returns 401 without token', () => {
    return request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('/auth/logout (POST) returns 401 without token', () => {
    return request(app.getHttpServer()).post('/auth/logout').expect(401);
  });

  it('/users/credits (GET) returns 401 without token', () => {
    return request(app.getHttpServer()).get('/users/credits').expect(401);
  });

  it('/diagrams (GET) returns 401 without token', () => {
    return request(app.getHttpServer()).get('/diagrams').expect(401);
  });

  it('/ai/chat (POST) returns 401 without token', () => {
    return request(app.getHttpServer()).post('/ai/chat').expect(401);
  });

  it('/billing/usage (GET) returns 401 without token', () => {
    return request(app.getHttpServer()).get('/billing/usage').expect(401);
  });
});
