var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect':'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});
//two things to tell sequelize
// 1. We want which database we want to use, 'dialect'
// 2. Where we want to store the database

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

//define - to set up your model

sequelize.sync({
    force:true
    }).then(function() {
    console.log("Everything is synced");
    
    //fetch a Todo item by its ID and if you find it print it using toJSON(), turn force:true off
    
    // Todo.findById(2).then(function(todo) {
    //    if (todo) {
    //        console.log(todo.toJSON());
    //    } else {
    //        console.log("Tough luck");
    //    }
    // });
    
    //add static data for example
    Todo.create({
        description: "Take out trash",
    }).then(function(todo) {
        return Todo.create({
            description: "Clean Office"
        });
    }).then(function() {
        //return Todo.findById(1);
        return Todo.findAll({
           where: {
               description: {
                   $like: '%office%'
               }
           } 
        });
    }).then(function(todos) {
        //in this case the todo is going to be the return of Todo.findById(1)
        if(todos) {
            todos.forEach(function(item) {
                console.log(item.toJSON());
            });
        } else {
            console.log("No todo found!");
        }
    }).catch(function(err) {
        console.log(err);
    });
});

//.sync- takes the model(data) and creates a database that looks just like them
//.create is to create a new item, in this case Todo item
//it's an object that takes all the argument you want to save 


//force:true, automatically drop all the tables and recreate them in the datalabe. 
    //Eg. if you make a mistake
    //force:false, by default, it only creates the table if they don't exist