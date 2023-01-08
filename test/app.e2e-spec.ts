import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';

describe('App e2e', () => {
  let app: INestApplication;
  // creating module from the prisma db (prisma module)
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // creating a nestjs testing application
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
  });

  // closing the application after the test
  afterAll(() => {
    app.close();
  });
  it.todo('should pass');
});
