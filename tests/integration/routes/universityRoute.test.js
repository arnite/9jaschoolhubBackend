import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../../app.js';
import universityModel from '../../../models/universityModel.js';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await universityModel.deleteMany();
});


// universityRouter.post('/', API_KEY, universityController.createUniversity);
describe('POST /universityRoute', () => {
    const validUniversity = {
        university_name: 'Test University',
        website: 'https://testuniv.edu',
        email: 'info@testuniv.edu',
        address: 'Test City',
        notable_programs: ['Engineering', 'Medicine'],
  };

    const API_KEY = 'test-api-key';

  beforeAll(() => {
    process.env.API_KEY = API_KEY;
  });

  it('should create a new university', async () => {
    const res = await request(app)
      .post('/universityRoute')
      .set('API_KEY', API_KEY)
      .send(validUniversity)
      .expect(201);

    expect(res.body.status).toBe('success');
    expect(res.body.data.newUniversity.university_name).toBe('Test University');
  });

  it('should return 401 if API_KEY is missing or invalid', async () => {
    const res = await request(app)
      .post('/universityRoute')
      .send(validUniversity)
      .expect(401);
  });


  it('should return 400 if university already exists', async () => {
    await universityModel.create(validUniversity);

    const res = await request(app)
      .post('/universityRoute')
      .set('API_KEY', API_KEY)
      .send(validUniversity)
      .expect(400);

    expect(res.body.message).toMatch(/university already exists/i);
  });
});

// universityRouter.get('/', universityController.getAllUniversities);

describe('GET - /universityRoute', () => {

  beforeEach(async () => {
    await universityModel.deleteMany({});
    await universityModel.create([
      { university_name: 'University of Jos', email: 'unijos@edu.com', website: 'https://unijos.edu' },
      { university_name: 'University of Ibadan', email: 'uni-ibadan@edu.com', website: 'https://uni-ib.edu' }
    ])
  })

  afterEach(() => {
    jest.clearAllMocks();

  })

  it('it should get all universities', async () => {

    const res = await request(app)
      .get('/universityRoute')
      .expect(200)

    expect(res.body.status).toBe('success')
    expect(res.body.count).toBe(2)
    expect(res.body.data.doc.length).toBe(2);
    expect(res.body.data.doc[0]).toHaveProperty('university_name');
  });

  it('should return 400 if no university is found', async () => {
    await universityModel.deleteMany();

    const res = await request(app).get('/universityRoute').expect(404)

    expect(res.body.status).toBe('fail');
    expect(res.body.message).toBe('No university found');
  })
})

// universityRouter.get('/:id', universityController.getUniversityById);
describe('GET - /universityRoute/:id', () => {
  let inserted;

  beforeEach(async () => {
    await universityModel.deleteMany({});

    inserted = await universityModel.create({
      university_name: 'University of Jos',
      email: 'unijos@edu.com',
      website: 'https://unijos.edu'
    });
  });

  it('should get university by id', async () => {
    const res = await request(app)
      .get(`/universityRoute/${inserted._id}`)
      .expect(200);

    expect(res.body.status).toBe('success');
    expect(res.body.data.university).toHaveProperty('university_name', 'University of Jos');
  });

  it('should return 404 if university does not exist', async () => {
    await universityModel.deleteMany();

    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/universityRoute/${fakeId}`)
      .expect(404);

    expect(res.body.status).toBe('fail');
    expect(res.body.message).toBe('University does not exist...');
  });
});

describe('PATCH - /universityRoute/:id', () => {
  let inserted;

  beforeEach(async () => {
    await universityModel.deleteMany({});
    
    inserted = await universityModel.create({
      university_name: 'University of Jos',
      email: 'unijos@edu.com',
      website: 'https://unijos.edu',
    });
  });

  const API_KEY = 'test-api-key';

  it('should update university and return updated data', async () => {
    const res = await request(app)
      .patch(`/universityRoute/${inserted._id}`)
      .set('API_KEY', API_KEY)
      .send({
        university_name: 'University of Jos Updated',
        website: 'https://updated-unijos.edu',
      })
      .expect(200);

    expect(res.body.status).toBe('success');
    expect(res.body.data.updatedUniversity).toHaveProperty(
      'university_name',
      'University of Jos Updated'
    );
    expect(res.body.data.updatedUniversity).toHaveProperty(
      'website',
      'https://updated-unijos.edu'
    );
  });

  it('should return 404 if university does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/universityRoute/${fakeId}`)
      .set('API_KEY', API_KEY)
      .send({ university_name: 'Nonexistent Uni' })
      .expect(404);

    expect(res.body.status).toBe('fail');
    expect(res.body.message).toBe('University do not exist....');
  });

  it('should return 400 if update violates validation', async () => {
    const res = await request(app)
      .patch(`/universityRoute/${inserted._id}`)
      .set('API_KEY', API_KEY)
      .send({ email: 'not-an-email' })
      .expect(500);

    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/email/i);
  });
});

describe('DELETE - /universityRoute/:id', () => {
  let inserted;

  beforeEach(async () => {
    await universityModel.deleteMany({});
    
    inserted = await universityModel.create({
      university_name: 'University of Jos',
      email: 'unijos@edu.com',
      website: 'https://unijos.edu',
    });
  });

  const API_KEY = 'test-api-key';

  it('should delete university and return 204', async () => {
    await request(app)
      .delete(`/universityRoute/${inserted._id}`)
      .set('API_KEY', API_KEY)
      .expect(204);

    // Verify the university was actually deleted
    const deletedUniversity = await universityModel.findById(inserted._id);
    expect(deletedUniversity).toBeNull();
  });

  it('should return 404 if university does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/universityRoute/${fakeId}`)
      .set('API_KEY', API_KEY)
      .expect(404);

    expect(res.body.status).toBe('fail');
    expect(res.body.message).toBe('University do not exist....');
  });
});