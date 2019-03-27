const { getNote } = require('../dataHelpers');

const app = require('../../lib/app');
const request = require('supertest');

describe('notes routes', () => {
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

  it('get a list of notes', () => {
    return request(app)
      .get('/notes')
      .then(res => {
        expect(res.ok).toBeTruthy();
        expect(res.body).toHaveLength(5);
      });
  });

  it('get a note by id', async() => {
    const { _id } = await getNote();

    return request(app)
      .get(`/notes/${_id}`)
      .then(res => {
        expect(res.ok).toBeTruthy();
        expect(res.body).toEqual({
          _id,
          title: 'My Note0',
          body: 'My Note 0',
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
          title: 'New Note Title',
          body: 'New Note Body'
        });
      });
  });

});
