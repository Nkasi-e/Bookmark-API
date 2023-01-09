import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateAuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto } from './../src/bookmark/dto/bookmark.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
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
    await app.listen(3333); // starting the server
    pactum.request.setBaseUrl('http://localhost:3333');

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
  });

  // closing the application after the test
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: CreateAuthDto = {
      email: 'test@gmail.com',
      password: 'test',
      firstname: 'test',
      lastname: 'testing',
    };

    describe('Signup', () => {
      it('should throw errow if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: '',
            password: dto.password,
            firstName: dto.firstname,
            lastName: dto.lastname,
          })
          .expectStatus(400);
      });

      it('should throw errow if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            firstName: dto.firstname,
            lastName: dto.lastname,
          })
          .expectStatus(400);
      });

      it('should throw errow if firstname is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            password: dto.password,
            lastName: dto.lastname,
          })
          .expectStatus(400);
      });

      it('should throw errow if lastname is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            firstName: dto.firstname,
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should signup user', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('should throw error if password is incorrect', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
            password: 'wrong1',
          })
          .expectStatus(403);
      });

      it('should throw error if email is incorrect', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'wrong1@gmail.com',
            password: dto.password,
          })
          .expectStatus(403);
      });

      it('should signin user', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email, password: dto.password })
          .expectStatus(200)
          .stores('userAt', 'access_token'); // saving access token in pactum store
      });
    });
  });

  describe('Users', () => {
    describe('Get Profile', () => {
      it('should throw unauthorize if access_token is not present', () => {
        return pactum.spec().get('/user/myprofile').expectStatus(401);
      });

      it('should get user profile', () => {
        return pactum
          .spec()
          .get('/user/myprofile')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // accessing the token with pactum syntax
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user details', () => {
        const dto: EditUserDto = {
          firstname: 'John',
          lastname: 'Doe',
        };
        return pactum
          .spec()
          .patch('/user/edit-profile')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // accessing the token with pactum syntax
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstname)
          .expectBodyContains(dto.lastname);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty BookMark', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create BookMark', () => {
      const dto: CreateBookmarkDto = {
        title: 'Avatar bend',
        description: 'The last airbender',
        link: 'http://youtube.com/watch?v=avatar',
      };
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
    });

    describe('Get BookMark', () => {});

    describe('Get BookMark By id', () => {});

    describe('Edit BookMark By id', () => {});

    describe('Delete BookMark By id', () => {});
  });
});
