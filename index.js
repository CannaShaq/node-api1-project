const { response } = require('express');
const express = require('express');
const shortid = require('shortid');

const server = express();
server.use(express.json());



//user array stuff here
let users = [];

//CREATE-post user data
server.post('/api/users', (request, response) => {
    const userInfo = request.body;

    userInfo.id = shortid.generate();
    userInfo.name = "";
    userInfo.bio = "";
    users.push(userInfo);

    response.status(201).json(userInfo);
})

//READ- get user array 
server.get('api/users', (request, response) => {
    response.status(200).json(users);
})

//UPDATE
//  1a. put user data
server.put('/api/users/:id', (request, response) => {
    const {id} = request.params;
    const changes = request.body;

    let index = users.findIndex(user => user.id === id);

    if(index !== -1){
        changes.id = id;
        users[index] = changes;
        response.status(200).json(users[index])
    }else{
        response.status(404).json({messge: "user with specified id does not exist."})
    }
})

//  1b. patch user data
server.patch('/api/users/:id', (request, response) => {
    const {id} = request.params;
    const changes = response.body;

    let found = users.find(user => user.id === id)

    if(found){
        Object.assign(found, changes);
        response.status(200).json(found)
    }else{
        response.status(404).json({message: "id not found"})
    }
})

//DELETE - delete user obj
server.delete('/api/users/:id', (request, response) => {
    const {id} = request.params;

    const deleted = users.find(user => user.id === id);

    if(deleted){
        users = users.filter(user => user.id !== id);
        response.status(200).json(deleted)
    }else{
        response.status(500).json({message: "ERROR while deleting object"})
    }
})

server.get('/', (request, response) => {
    response.json({message: "test!"});
})


const PORT = 5000;
server.listen(PORT, () => {
    console.log(`***LISTENING ON PORT: ${PORT}`)
});