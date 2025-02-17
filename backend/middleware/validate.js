const validator = require('../helpers/validate');
const Joi = require('joi');

// Validation for LDS_Church_History collection
const saveChurchHistory = (req, res, next) => {
  const validationRule = {
    title: 'required|min:1|max:100|string',
    description: 'required|min:1|max:500|string',
    dateRange: {
      start: ['required', 'regex:/^(19|20)\\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/'],
      end: ['required', 'regex:/^(19|20)\\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/']
    }
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

// Validation for Temple_Dedications collection
const saveTempleDedication = (req, res, next) => {
  const validationRule = {
    temple: 'required|min:1|max:100|string',
    dedication: 'required|min:1|max:100|string',
    dedicatedBy: 'required|min:1|max:50|string'
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

// Validation for users collection
const saveUser = (req, res, next) => {
  const validationRule = {
    firstName: 'required|min:1|max:50|string',
    lastName: 'required|min:1|max:50|string',
    birthDate: ['required', 'regex:/^(19|20)\\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/'],
    email: ['required', 'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/'],
    password: 'required|min:8|max:50|string'
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

// Validation for checking MongoDB ObjectId
const checkMongoId = (req, res, next) => {
  const validationRule = {
    id: 'required|min:24|max:24|string'
  };
  validator(req.params, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

module.exports = {
  saveChurchHistory,
  saveTempleDedication,
  saveUser,
  checkMongoId
};
