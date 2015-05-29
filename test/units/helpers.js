/**
 * Created by woaitzy on 2015/5/27 0027.
 */
var sinon = require('sinon');
var should = require('should');
var validator = require('../../lib/validator');

exports.getMongooseStub = function () {
    var mongoose = {};
    mongoose.Schema = sinon.stub();
    mongoose.Schema.ObjectId = 'ObjectId';
    mongoose.Schema.prototype.plugin = sinon.stub();
    mongoose.model = sinon.stub();

    return mongoose;
};

exports.shouldDefineSchemaProperty = function (Schema, property) {
    sinon.assert.called(Schema.withArgs(sinon.match(property)));
};

exports.shouldBeRequired = function (Schema,property) {
    var obj = {};
    obj[property] = {
        required: true
    };
    exports.shouldDefineSchemaProperty(Schema, obj);
};
exports.shouldBeUnique = function (Schema, property) {
    var obj = {};
    obj[property] = {
        unique: true
    };
    exports.shouldDefineSchemaProperty(Schema, obj);
};

exports.shouldBeA = function (Schema,property,type) {
    var obj = {};
    obj[property] = {
        type: type
    };
    exports.shouldDefineSchemaProperty(Schema, obj);
};

exports.shouldDefaultTo = function (Schema, property, defultValue) {
    var obj = {};
    obj[property] = {
        defult: defultValue
    };
    exports.shouldDefineSchemaProperty(Schema, obj);
};

exports.shouldBeBetween = function (Schema,proprty,opts) {
    var obj = {};
    obj[proprty] = {
        min: opts.min,
        max:opts.max
    };
    exports.shouldDefineSchemaProperty(Schema, obj);
};

exports.shouldValidateThat = function (Schema,property) {
    var args = Array.prototype.slice.call(arguments, 2);
    var obj = {};
    obj[property] = {
        validate:validator.validate.apply(validator,args)
    };
    exports.shouldDefineSchemaProperty(Schema, obj);
};

exports.shouldValidateMany = function (Schema,property,validation1,validation2) {
    var obj = {};
    obj[property] = {
        validate:[{
            validator:validator.validate.apply(validator,validation1.args),
            msg:validation1.msg
        },{
            validator:validator.validate.apply(validator,validation2.args),
            msg:validation2.msg
        }]
    };
    exports.shouldDefineSchemaProperty(Schema,obj);
};

exports.shouldRegisterSchema = function (Model,Schema,name) {
    Model.calledWith(name).should.be.true;
    Model.args[0][1].should.be.an.instanceOf(Schema);
};

exports.shouldLoadPlugin = function (Schema,plugin) {
    sinon.assert.called(Schema.prototype.plugin.withArgs(plugin));
};