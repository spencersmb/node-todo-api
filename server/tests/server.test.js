var request = require('supertest');
var expect = require('expect');
const {app} = require('../server')
const {Todo} = require('../models/todos');
const {ObjectID} = require('mongodb');

const todos = [
    {
        _id: new ObjectID(),
        text:"First test todo",
        completed:false,
        completedAt: null
    },
    {
        _id: new ObjectID(),
        text:"seconds test todo",
        completed:true,
        completedAt: 333
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

describe('DELETE /todos:ID', () => {

    it('Should remove a todo', (done)=>{
        const hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect(res => {
                //expect the todo returned was the same one in the db
                expect(res.body.todo.text).toBe(todos[1].text)

            })
            .end((err, res) => {
                if(err){
                    return done(err)
                }

                // match the final array count
                Todo.findById(hexId).then(todo => {
                    expect(todo).toNotExist();
                    done();
                }).catch(e => done(e))
            })
    })

    it('Should return 404 if todo not found', (done)=>{

        request(app)
            .delete('/todos/5906bf84968aa210bc879d05')
            .expect(404)
            .end(done)

    })

    it('Should return 404 if objectID is invalid', (done)=>{

        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done)

    })

})

describe('PATCH /todos:ID', () => {

    

    it('Should update the TODO', (done)=>{

        const id = todos[0]._id

        const updatedTodo = {
            text: "Updated text from Test",
            completed: true
        }

        //Make patch request
        request(app)
            .patch(`/todos/${id}`)
            .send(updatedTodo)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(updatedTodo.text)
                expect(res.body.todo.completed).toBe(true)
                expect(res.body.todo.completedAt).toBeA("number")
            })
            .end(done)
    })

    it('Should clear completedAt when todo is not completed', (done)=>{
        const id = todos[1]._id.toHexString()
        const updatedTodo = {
            completed: false
        }
        request(app)
            .patch(`/todos/${id}`)
            .send(updatedTodo)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toNotExist()
            })
            .end(done)
    })

} )