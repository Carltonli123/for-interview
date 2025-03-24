var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var checkoutRouter = require('./routes/checkout');

var request = require('request');

var bodyParser = require('body-parser')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/checkout', checkoutRouter);

//get payment link
app.post('/createPaymentLink', function (req, res) {

  console.log("/createPaymentLink has been called")

  console.log(req.body);
  console.log(JSON.stringify(req.headers));

  var options = {
    'method': 'POST',
    'url': 'https://checkout-test.adyen.com/v70/sessions',
    'headers': {
      'Content-Type': 'application/json',
      'X-API-Key': req.body.ApiKey
    },
    body: JSON.stringify({
      "merchantAccount": "AdyenTechSupport_CarltonTest_TEST",
      "amount": {
        "value": req.body.price,
        "currency": "USD"
      },
      "mode": "hosted",
      "themeId": "62f89c0e-f35d-44ca-be12-132495b997ff",
      "returnUrl": "http://localhost:3001/",
      "reference": "YOUR_PAYMENT_REFERENCE",
      "countryCode": "NL"
    })

  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log("it has come to the end");
    console.log(response.body);
    res.send(response.body);
  });
  
})

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
