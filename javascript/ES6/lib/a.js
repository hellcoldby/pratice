"use strict";

var babelConfig = require('../babel.config');

require('@babel/register')(babelConfig);

module.exports = require('./test');