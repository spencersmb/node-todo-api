var request = require('supertest');
var expect = require('expect');
const {app} = require('../server')
const {Todo} = require('../models/todos');
const {ObjectID} = require('mongodb');

const todos = [
    {
        _id: new ObjectID(),
        text:"First test todo"
    },
    {
        _id: new ObjectID(),
        text:"seconds test todo"
    },
    {
        _id: new ObjectID(),
        text:"third test todo"
    }
]

beforeEach((done) => {
    //empty DB before each test
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(()=>done())
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

                // Only find todos with the matching text object
                Todo.find({text}).then((todos) => {
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
                expect(todos.length).toBe(todos.length)
                done()
            }).catch(e => done(e))
        })
    })
})

describe('GET /todos', ()=> {

    it('Should GET all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(todos.length)
            })
            .end(done)
    })

})

describe('GET /todos/:id', () => {
    
    it('Should return a valid todo item', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`) //using id from our todos seed data
            .expect(200)
            .expect(res => {
                //match our first todo in the seed array
                expect(res.body.todo.text).toBe(todos[0].text) 
            })
            .end(done)
    })

    it('Should return a 404 if todo not found', (done) => {

        const fakeId = new ObjectID();

        request(app)
            .get(`/todos/${fakeId.toHexString()}`) //using id from our todos seed data
            .expect(404)
            .end(done)
       
    })

    it('Should return a 404 for an invalid Id', (done) => {
        request(app)
            .get(`/todos/123`) //using id from our todos seed data
            .expect(404)
            .end(done)
    })

})