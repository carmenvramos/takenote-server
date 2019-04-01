const { getNote } = require('../dataHelpers');

const app = require('../../lib/app');
const request = require('supertest');

jest.mock('../../lib/middleware/ensureAuth.js');
jest.mock('../../lib/services/auth.js');

describe('notes routes', () => {
  it('can create a new note', () => {
    return request(app)
      .post('/notes')
      .send({ title: 'New Note', body: 'I write this note to celebrate the awesomeness of this day!' })
      .then(res => {
        expect(res.ok).toBeTruthy();
        expect(res.body).toEqual({
          _id: expect.any(String),
          author: 'test.user',
          title: 'New Note',
          body: 'I write this note to celebrate the awesomeness of this day!',
          __v: 0
        });        
      });
  });

  it('get a list of notes', () => {
    return request(app)
      .get('/notes')
      .then(res => {
        expect(res.ok).toBeTruthy();
        expect(res.body).toHaveLength(10);
      });
  });

  it('get a note by id', async() => {
    const { _id } = await getNote();
    console.log('ID:', _id);
    return request(app)
      .get(`/notes/${_id}`)
      .then(res => {
        expect(res.ok).toBeTruthy();
        expect(res.body).toEqual({
          _id,
          author: {
            nickname: 'test.user',
            email: 'test@test.com',
            sub: '11'
          },  
          title: expect.any(String),
          body: expect.any(String),
          __v: 0
        });
      });
  });

  it('updates a note by id', async() => {
    const note = await getNote();

    return request(app)
      .put(`/notes/${note._id}`)
      .send({ title: 'New Note Title', body: 'New Note Body' })
      .then(res => {
        expect(res.ok).toBeTruthy();
        expect(res.body).toEqual({
          ...note,
          author: 'test.user',
          title: 'New Note Title',
          body: 'New Note Body'
        });
      });
  });
  
});
