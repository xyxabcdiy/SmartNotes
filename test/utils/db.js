/**
 * Created by woaitzy on 2015/5/27 0027.
 */
var config = require('../../config.json');
var db = require('../../lib/db');
var async = require('async');
var Note = require('../../models/note');
var User = require('../../models/user');
var userFixtures = require('../fixtures/users.json');
var notesFixtures = require('../fixtures/notes.json');

exports.connect = function (callback) {
    db.connect(config.test.mongoUrl, callback);
};
exports.reset = function (callback) {
    async.parallel([
        function emptyNotesCollection(cb) {
            Note.remove({}, cb);
        },
        function emptyUserCollection(cb) {
            User.remove({}, cb);
        }
    ], callback);
};
exports.populate = function (callback) {
    async.each(userFixtures, function (data, next) {
        User.register(new User({
            username: data.username,
            email: data.email,
            name: data.name
        }), data.password, next);
    }, function (err) {
        if(err) {
            return callback(err);
        }
        User.findOne({username:'johndoe'}, function (err,user) {
            if(err) {
                return callback(err);
            }
            async.each(notesFixtures, function (data, next) {
                var note = new Note(data);
                note.userId = user._id;
                note.save(next);
            },callback);
        })
    });
};
exports.setupDatabase = function(callback) {
    var resetAndPopulate = function(err) {
        if (err) { return callback(err); }

        exports.reset(function(err) {
            if (err) { return callback(err); }

            exports.populate(callback);
        });
    };

    if (mongoose.connection.db) {
        return resetAndPopulate();
    } else {
        exports.connect();
    }
};