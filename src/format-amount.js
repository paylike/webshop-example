'use strict';

var configuration = require('../conf.json');

var amounts = configuration.amounts;

module.exports = formatAmount;

function formatAmount( amount ){
	var major = amount / 100;
	var separated = major.toFixed(amounts.fractions || 2).split('.');

	var integers = separated[0];
	var fractions = separated[1];
	var formatted = [ amounts.fractions ? (amounts.decimal + fractions) : '' ];

	var length = integers.length;

	for (var i = 0;i < length;i++) {
		if (i > 0 && i % 3 === 0)
			formatted.unshift('.')

		formatted.unshift(integers[length - i - 1]);
	}

	return amounts.before
		+formatted.join('')
		+amounts.after;
}
