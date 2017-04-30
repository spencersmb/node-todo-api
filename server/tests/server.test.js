var request = require('supertest');
var expect = require('expect');
const {app} = require('../server')
const {Todo} = require('../models/todos');

beforeEach((done) => {
    //empty DB before each test
    Todo.remove({}).then(() => done())
})

describe('POST /todos', ()=> {

    it('Should create a new todo update repeat', (done) => {

        var text = "worked again";
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res)=>{
                if(err){
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch(e => done(e))
            })

    })

    it('Should not create Todo with invalid Data', (done)=>{
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end( (err, res) => {
            if(err){
                return done(err);
            }

             Todo.find().then((todos) => {
                expect(todos.length).toBe(0)
                done()
            }).catch(e => done(e))
        })
    })
})