'use strict';

const { Schema, model } = require('mongoose');

const DeviceSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  version: {
    type: Date,
    required: true
  },
  thresholdHumidity: {
    required: true,
    type: String
  },
  thresholdTemperature: {
    required: true,
    type: String
  },
  deviceId: {
    unique: true,
    required: true,
    type: String
  }
});

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  device: {
    type: DeviceSchema,
    required: true
  }
}, {
  timestamps: true,
  strict: false
});

module.exports =  {
  User: model('users', UserSchema)
};