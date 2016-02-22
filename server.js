var express = require("express");
var _ = require("lodash");
var bodyParser = require("body-parser");
var db = require('./db');

var app = express();
var PORT = process.env.PORT || 3000;
var todos =[];
var todoNextId = 1;

app.use(bodyParser.json())

// GET /todos?completed=true&q=work
app.get('/todos', function(req, res) {
    var queryParams = req.query;
    var filteredTodos = todos;
    
    if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.filter(filteredTodos, {'completed' : true})
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos= _.filter(filteredTodos, {'completed' : false})
    }
    
    if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function(item) {
            return item.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        });
    }
    
    res.json(filteredTodos);
});

app.get('/todos/:id', function(req,res) {
    var todoId = parseInt(req.params.id, 10);
    
    db.todo.findById(todoId).then(function(todo) {
      if (todo) {
        res.json(todo.toJSON());
      }
        res.status(404).send();
      }, function(err) {
        res.status(500).send(err);
        //500 is a server error
      });
    // var matchedTodo = _.find(todos, {id: todoId});
    
    // if(matchedTodo) {
    //     res.json(matchedTodo);
    // } else {
    //     res.status(404).send();
    // }
    
});

//POST /todos

app.post('/todos', function(req, res) {
    var body = _.pick(req.body, ['completed', 'description']);
  
    db.todo.create(body).then(function(todo) {
      res.json(todo.toJSON());
      //toJSON, is becasue todo object in sequelize has other sequelize related methods on it
    }, function(err) {
      res.status(400).send(err);
    })
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

// PUT  - to update /todos:id

app.put('/todos/:id', function(req, res) {
    var body = _.pick(req.body, ['completed', 'description']);
    var validAttributes = {};
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.find(todos, {id: todoId});
    
    if (!matchedTodo) {
        return res.status(404).send();
    }
    // validation for body.completed
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    } 
    
    // validation for body.description
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res .status(404).send();
    } 
    
    _.assign(matchedTodo, validAttributes);
    res.json(matchedTodo);

});

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("Express listening on port " + PORT + "!"); 
  });
});


