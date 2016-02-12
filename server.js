var express = require("express");
var _ = require("lodash");
var bodyParser = require("body-parser");

var app = express();
var PORT = process.env.PORT || 3000;
var todos =[];
var todoNextId = 1;

app.use(bodyParser.json())

app.get('/todos', function(req, res) {
    res.json(todos)
});

app.get('/todos/:id', function(req,res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.find(todos, {id: todoId});
    
    if(matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
    
});

//POST /todos

app.post('/todos', function(req, res) {
    var body = _.pick(req.body, ['completed', 'description']);
    body.description = body.description.trim();
    
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.length === 0) {
        return res.status(400).send();
    }
   
    body.id = todoNextId++; 
    todos.push(body);
    
    res.json(body);
});

// DELETE /todos/:id

app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.find(todos, {id: todoId});
    
    if(!matchedTodo) {
        res.status(404).json({"error" : "No todo found with that id"});
    } else {
        todos=_.without(todos, matchedTodo);
        res.json(matchedTodo);
    }
});

app.listen(PORT, function() {
   console.log("Express listening on port " + PORT + "!"); 
});
