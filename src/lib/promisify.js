'use strict';

const RSVP = require('rsvp');

const slice = [].slice;

module.exports = (func) => {
  return function (/* args... */) {
    const args = slice.call(arguments);
    return new RSVP.Promise((resolve, reject) => {
      return func.apply(null, args.concat([function (error /*, args... */) {
        if (error) return reject(error);
        return resolve.apply(null, slice.call(arguments, 1));
      }]));
    });
  };
};
