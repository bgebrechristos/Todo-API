var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    'dialect': 'postgres'
  });
} else {
  sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect':'sqlite',
    'storage': __dirname + '/data/dev-todo-api.sqlite'
});
}

var db = {};
//attach the properties and export it from db.js

db.todo = sequelize.import(__dirname + '/models/todo.js');
//lets you load in already created models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;