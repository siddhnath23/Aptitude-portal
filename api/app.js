var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors=require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var UserController=require('./routes/UserController.js')
var QuestionController=require('./routes/QuestionController')
const postgres = require('./model/PostgreDB');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// postgres.CreateDatabase();
// postgres.CreateTable();
// postgres.AddAdmin({"fullname":"admin","email":"admin","password":"admin"}) //this func create will create default admin
// postgres.AddQuestions();  //uncomment while adding questions

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register',UserController.register);
app.use('/login',UserController.login)
app.use('/checkApplied',UserController.checkApplied);
app.use('/getUsers',UserController.getUser);
app.use('/delUser',UserController.delUser);
app.use('/addAdmin',UserController.addAdmin);
app.use('/resetExam',UserController.resetExam);

app.use('/getQuestions',QuestionController.getQuestions)
app.use('/checkAns',QuestionController.checkAns)
app.use('/getAllQuestions',QuestionController.getAllQuestions);
app.use('/setQuestion',QuestionController.setQuestion)
app.use('/delQuestion',QuestionController.delQuestion)
app.use('/updateQuestion',QuestionController.updateQuestion)
app.use('/bulkQuestions',QuestionController.bulkQuestions)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
