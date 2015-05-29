/**
 * Created by woaitzy on 2015/5/27 0027.
 */
var express = require('express');
var app = express();
var db = require('./lib/db');
var config = require('./config.json')[app.get('env')];
var mongoose = require('mongoose');
var User = require('./models/user');
var Note = require('./models/note');
var routes = require('./routes');

var methodOverride = require('method-override');
var bodyParser = require('bodt-parser');

db.connect(config.mongoUrl);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride(function (req, res) {
    if(req.body&&typeof req.body==='object'&&'_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use(function (req, res, next) {
    req.User = User;
    req.Note = Note;
    next();
});
app.get('/users/:username',routes.user.show);
app.post('/users', routes.user.create);
app.patch('/users/:username', routes.users.authenticate, routes.users.update);


module.exports = app;
if(!module.parent) {
    app.listen(config.port);
    console.log('(%s) app listening on port %s', app.get('env'),config.port);
}