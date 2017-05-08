var request = require('supertest');
const Request = require('request')
var expect = require('expect');
const {app} = require('../server')
const {Todo} = require('../models/todos');
const {ObjectID} = require('mongodb');

const user1ID = new ObjectID()
const user2ID = new ObjectID()

const todos = [
    {
        _id: new ObjectID(),
        text:"First test todo",
        completed:false,
        completedAt: null,
        _creator: user1ID
    },
    {
        _id: new ObjectID(),
        text:"seconds test todo",
        completed:true,
        completedAt: 333,
        _creator: user1ID
    },
    {
        _id: new ObjectID(),
        text:"third test todo",
        _creator: user2ID
    }
]


var options = { method: 'POST',
  url: 'https://smbtodos.auth0.com/oauth/ro',
  headers: { 'content-type': 'application/json' },
  body: 
   { client_id: 'HfHVZS2aB0TLT8Z6Bny5kawCTrcuoWOt',
     username: 'test@gmail.com',
     password: 'test',
     connection: 'Username-Password-Authentication',
     grant_type: 'client_credentials',
     scope: 'openid' },
  json: true };

let auth = {
    token_id: '',
    type: '',
    access_token:'',
    user_id: ''
}

before((done) => {
    Request(options, function (error, response, body) {
        if (error) throw new Error(error);

        auth.token_id = body.id_token
        auth.type = body.token_type
        auth.access_token = body.access_token

        const authString = auth.type + ' ' + auth.access_token


        Request({ 
            method: 'GET',
            url: 'https://smbtodos.auth0.com/userinfo',
            headers: { 
                Authorization: authString
            },
            json: true 
        }, 
        function (error, response, body) {
            if (error) throw new Error(error);

            // console.log(body);
            auth.user_id = body.user_id
            done();
        });
    });
})

beforeEach((done) => {
    //empty DB before each test
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(()=>done())
})

describe('POST /todos', ()=> {

    it('Should create a new todo update', (done) => {
        var todo = {
            text: 'test text todo 5/8',
            _id: auth.user_id
        }
        request(app)
            .post('/todos')
            .set('Authorization', 'Bearer ' + auth.token_id)
            .send(todo)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(todo.text)
            })
            .end((err, res)=>{
                if(err){
                    return done(err);
                }

                // Only find todos with the matching text object
                Todo.find(todo.text).then((todos) => {
                    expect(todos.length).toBe(4)
                    expect(todos[3].text).toBe(todo.text)
                    done()
                }).catch(e => done(e))
            })

    })

    it('Should not create Todo with invalid Data', (done)=>{
        request(app)
        .post('/todos')
        .set('Authorization', 'Bearer ' + auth.token_id)
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