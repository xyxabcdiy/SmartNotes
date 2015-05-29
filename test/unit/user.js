/**
 * Created by woaitzy on 2015/5/27 0027.
 */
"use strict";

var should = require('should');
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var helpers = require('../utils/helpers');
var mongoose = helpers.getMongooseStub();

var shouldDefineSchemaProperty = helpers.shouldDefineSchemaProperty.bind(null, mongoose.Schema);
var shouldRegisterSchema = helpers.shouldRegisterSchema.bind(null, mongoose.model, mongoose.Schema);
var shouldBeRequired = helpers.shouldBeRequired.bind(null, mongoose.Schema);
var shouldBeUnique = helpers.shouldBeUnique.bind(null, mongoose.Schema);
var shouldBeA = helpers.shouldBeA.bind(null, mongoose.Schema);
var shouldDefaultTo = helpers.shouldDefaultTo.bind(null, mongoose.Schema);
var shouldBeBetween = helpers.shouldBeBetween.bind(null, mongoose.Schema);
var shouldValidateThat = helpers.shouldValidateThat.bind(null, mongoose.Schema);
var shouldValidateMany = helpers.shouldValidateMany.bind(null, mongoose.Schema);
var shouldLoadPlugin = helpers.shouldLoadPlugin.bind(null, mongoose.Schema);

describe('User', function() {
    var Note, passportLocalMongoose;

    before(function() {
        passportLocalMongoose = sinon.stub();
        Note = proxyquire('../../models/user', {
            'passport-local-mongoose': passportLocalMongoose,
            'mongoose': mongoose
        });
    });

    it('should register the Mongoose model', function() {
        shouldRegisterSchema('User');
    });

    it('should load the timestamps plugin', function() {
        shouldLoadPlugin(passportLocalMongoose);
    });

    describe('username', function() {
        it('should be required', function() {
            shouldBeRequired('username');
        });

        it('should be a string', function() {
            shouldBeA('username', String);
        });

        it('should be unique', function() {
            shouldBeUnique('username');
        });

        it('should have a length of 4-255 chars', function() {
            shouldValidateMany('username',{
                args:['isAlphanumeric'],
                msg:'username must be alphanumeric'
            },{
                args:['isLength',4,255],
                msg:'username must have 4-255 chars'
            });
        });
    });

    describe('email', function() {
        it('should be required', function() {
            shouldBeRequired('email', String);
        });

        it('should be a string', function() {
            shouldBeA('email', String);
        });

        it('should be unique', function() {
            shouldBeUnique('email');
        });

        it('should be a valid email', function() {
            shouldValidateThat('email', 'isEmail');
        });
    });

    describe('name', function() {
        it('should be a string', function() {
            shouldBeA('name', String);
        });
    });
});
