var express = require("express");
var app = express();

var PORT = process.env.PORT || 3000;

var todos = [{
    id: 1,
    description: 'Meet mom for lunch',
    completed: false
}, {
    id: 2,
    description: "Go to market",
    completed: false
}, {
    id:3,
    description: "Last exerscice trial",
    completed:true
}];

app.get('/', function(req, res) {
    res.send("Todo API Root");
});

app.get('/todos', function(req, res) {
    res.json(todos)
});
//need to covert to JSON since we can only pass text back and forth, instead of JSON.stringif or parse we can use res.json

app.get('/todos/:id', function(req,res) {
    var todoId = parseInt(req.params.id, 10);
    //req.params.id is always a number so change it to string
    //10 is the base, always use 10 unless you use binary or hexadecimal
    var matchedTodo;
    
    todos.forEach(function (item) {
        if(item.id === todoId) {
            matchedTodo = item;
        } 
    });
    if(matchedTodo) {
        res.json(matchedTodo)
    } else {
        res.status(404).send();
    }
    
});

app.listen(PORT, function() {
   console.log("Express listening on port " + PORT + "!"); 
});

//GET request- /todos