require('dotenv').config();

const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');
const app = require('../../lib/app');
const request = require('supertest');

describe('Notes Routes Tests', () => {
  beforeAll(() => {
    return connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a new note', () => {
    return request(app)
      .post('/notes')
      .send({ title: 'New Note', body: 'I write this note to celebrate the awesomeness of this day!' })
      .then(res => {
        expect(res.ok).toBeTruthy();
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'New Note',
          body: 'I write this note to celebrate the awesomeness of this day!',
          __v: 0
        });
      });
  });
});
