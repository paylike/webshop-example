'use strict';

var jade = require('jade');
var bind = require('component-bind');
var formatAmount = require('./format-amount');

module.exports = render;

var $tmp = document.createElement('div')
$tmp.innerHTML = jade.renderFile(__dirname + '/partials/popup.jade');

var $popupTemplate = $tmp.childNodes[0];

var listeners = [];

function render( $basket, basket, locale, currency, onIncrease, onCheckout ){
	renderBasketCount($basket, $basket.querySelector('span.count'), basket.count());
	renderBasketPopup($basket, basket, locale, currency, onIncrease, onCheckout);
}

function renderBasketCount( $basket, $basketCount, count ){
	if (count) {
		$basket.classList.remove('empty');
	} else {
		$basket.classList.add('empty');
		$basket.classList.add('closed');
	}

	$basketCount.textContent = count;
}

function renderBasketPopup( $basket, basket, locale, currency, onIncrease, onCheckout ){
	listeners = listeners.filter(function( listener ){
		listener.$.removeEventListener(listener.type, listener.fn);
	});

	var $popup = $popupTemplate.cloneNode(true);

	var $lineTemplate = $popupTemplate.querySelector('ul.lines > li');

	var $lines = $popupTemplate.querySelector('ul.lines').cloneNode(false);

	basket.lines.forEach(function( line ){
		var $line = $lineTemplate.cloneNode(true);

		$line.querySelector('img').setAttribute('src', line.image);
		$line.querySelector('h1').textContent = line.name;
		$line.querySelector('input.quantity').value = line.quantity;

		$line.querySelector('p.amount').textContent = formatAmount(line.price * line.quantity);

		listen($line.querySelector('button.less'), 'click', bind(null, onIncrease, line, -1));
		listen($line.querySelector('button.more'), 'click', bind(null, onIncrease, line, 1));
		listen($line.querySelector('input.quantity'), 'blur', bind(null, onSetQuantity, onIncrease, line));

		$lines.appendChild($line);
	});

	replaceNode($popup.querySelector('ul.lines'), $lines);

	$popup.querySelector('div.summary p.amount').textContent = formatAmount(basket.total());

	listen($popup.querySelector('button.checkout'), 'click', onCheckout);

	$basket.replaceChild($popup, $basket.querySelector('div.popup'));
}

function replaceNode( $replace, $with ){
	$replace.parentNode.replaceChild($with, $replace);
}

function onSetQuantity( onIncrease, line, e ){
	onIncrease(line, e.target.value - line.quantity);
}

function listen( $, type, fn ){
	$.addEventListener(type, fn);

	listeners.push({ $: $, type: type, fn: fn });
}
