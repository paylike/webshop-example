'use strict';

module.exports = add;

add.q = [];

add.l = Date.now();

if (typeof window !== 'undefined') {
	window.GoogleAnalyticsObject = 'ga';

	if (!window.ga)
		window.ga = add;
}

function add(){
	if (window.ga === add)
		add.q.push(arguments);
	else
		window.ga.apply(ga, arguments);
}
