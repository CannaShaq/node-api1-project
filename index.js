const { response, request } = require('express');
const express = require('express');
const shortid = require('shortid');

const server = express();
server.use(express.json());


// Uncle Ben's quote,
const quote = "With great power comes great responisibility -Uncle Ben";


//user array stuff here
let users = [{
    id: "randomNumbers",
    name: "Peter Parker",
    bio: `${quote}`
}];

//CREATE-post user data
server.post('/api/users', (request, response) => {
    const user = request.body;

    //if user doesnt have name or bio throw error
    if(!user.name || !user.bio){
        response.status(400).json({errorMessage: "Please provide user name and bio."})
    }
        //check if user name is in use 
        try{
            const possibleUser = users.find(user => {
                user.name === request.body.name;
            });
            if(!possibleUser){
                //generate user id
                user.id = shortid.generate();
                //add user object to user array
                users.push(user);
                //return success code: 201, display user object
                response.status(201).json(user);
            }else{
                //return error code: 400, display error message
                response.status(400).json({errorMessage: "User name is in use."})
            }
        // If server error saving user return server error code: 500, display error message
        }catch{
            response.status(500).json({ errrorMessage: "There was an error while saving user"})
        }
});

//READ- get user array 
server.get('/api/users', (request, response) => {
    try{
        response.status(200).json(users);
    }catch{
        response.status(500).json({ errorMessage: "The user information could not be retrieved."})
    }
    
})


//get user by ID
server.get('/api/users/:id', (request, response) => {
    const { id } = request.params.id;

    //search user id
    try{
        const confirmed = users.find(user => user.id === id);
        //if id is confirmed as real return status(200), display object
        if(confirmed){
            response.status.apply(200).json(confirmed);
        }else{
            response.status(404).json({errorMessage: "Id not found."});
        }
    }catch{
        //if server error return status(500), display message
        response.status(500).json({errorMessage: "User info could not be retrieved, try again later."})
    }
});


//UPDATE
//  1a. put user data
server.put('/api/users/:id', (request, response) => {
    const { id } = request.params;
    const changes = request.body;
    
    let index = users.findIndex(user => user.id == id);
    //validate data
    if(!changes.name || !changes.bio){
        response.status(400).json({errorMessage: "Please provide name and bio for user."});
    }
    //search and update user
    try{
        
        if(index !== -1){
            changes.id = id;
            users[index] = changes;
            response.status(200).json(users[index]);
        }else{
            response.status(404).json({errorMessage: "The user with specified ID does not exist."});
        }
    }catch{
        response.status(500).json({errorMessage: "User information could not be modified."})
    }
});

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
    response.json(users);
})


const PORT = 5000;
server.listen(PORT, () => {
    console.log(`***LISTENING ON PORT: ${PORT}`)
});