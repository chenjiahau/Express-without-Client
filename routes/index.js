var express = require('express');
var router = express.Router();

var todoList = [
]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Text mode' });
});

router.get('/express-test', function(req, res, next) {
  res.send({ message: 'Your express is connected to react!' });
});

/* API */
router.get('/api/todo', function(req, res, next) {
  res.send({
    code: 200,
    data: todoList
  });
});

router.post('/api/todo', function(req, res, next) {
  todoList.push({
    todo: req.body.todo,
    timestamp: new Date().getTime()
  });

  res.send({ 
    code: 200
  });
});

router.delete('/api/todo/:timestamp', function (req, res, next) {
  const timestamp = +req.params.timestamp
  todoList = todoList.filter(todo => todo.timestamp !== timestamp)

  res.send({ 
    code: 200
  });
});

module.exports = router;
