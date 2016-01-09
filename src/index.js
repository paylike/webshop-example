'use strict';

var Basket = require('./basket');
var renderBasket = require('./basket-view');

var shopName = document.title;
var key = 'e9f468a8-4b63-46a5-aaf3-0911312bae27';
var locale = 'en';
var currency = 'EUR';

var paylike = global.Paylike(key);

run(window.localStorage, window.document.documentElement);

function run( storage, $root ){
	var state = load(storage);

	var $basket = $root.querySelector('div.basket');
	var $basketLink = $root.querySelector('div.basket > a');

	$basketLink.addEventListener('click', function(){
		if ($basket.classList.contains('closed'))
			$basket.classList.remove('closed');
		else
			$basket.classList.add('closed');
	});

	$basket.addEventListener('click', function( e ){
		e.stopPropagation();
	})

	$root.addEventListener('click', function(){
		$basket.classList.add('closed');
	});

	renderBasket($basket, state.basket, locale, currency, onIncrease, onCheckout);

	var $products = $root.querySelectorAll('ul.products li');

	if ($products) {
		Array.prototype.forEach.call($products, function( $li ){
			var $name = $li.querySelector('h1');
			var $price = $li.querySelector('p.price');
			var $buy = $li.querySelector('a.buy');
			var $sku = $li.querySelector('p.sku');
			var $image = $li.querySelector('img');

			if (!$name || !$price || !$buy)
				return;

			$buy.addEventListener('click', function( e ){
				e.preventDefault();

				state.basket.add({
					name: $name.textContent,
					image: $image.src,
					price: +$price.textContent.match(/[0-9]/g).join(''),
					sku: $sku && $sku.textContent,
					quantity: 1,
				});

				renderBasket($basket, state.basket, locale, currency, onIncrease, onCheckout);
				save(storage, state);
			});
		});
	}

	function onIncrease( line, quantity ){
		state.basket.increase(line, quantity);
		renderBasket($basket, state.basket, locale, currency, onIncrease, onCheckout);
		save(storage, state);
	}

	function onCheckout(){
		paylike.popup({
			locale: locale,
			currency: currency,
			amount: state.basket.total(),

			title: shopName,
			description: state.basket.summary(),

			custom: state.basket.toJSON(),

			fields: [
				{
					name: 'E-mail',
					placeholder: 'example@domain.com',
					required: true,
				},
				{
					name: 'Name',
					placeholder: 'Enter your full name',
					required: true,
				},
				{
					name: 'Address',
					placeholder: 'Street, no., floor, apt.',
					required: true,
				},
				{
					name: 'ZIP and city',
					placeholder: '0000 City name',
					required: true,
				},
				{
					name: 'Country',
					placeholder: 'Enter country',
					required: true,
				},
			],
		}, function( err ){
			if (err)
				return;

			state.basket.empty();
			renderBasket($basket, state.basket, locale, currency, onIncrease, onCheckout);
			save(storage, state);

			window.location = '/thanks.html';
		});
	}
}

function save( storage, state ){
	if (!storage)
		return;

	storage.setItem('basket', JSON.stringify(state.basket));
}

function load( storage ){
	if (!storage)
		return;

	var storedBasket = storage.getItem('basket');

	return {
		basket: storedBasket && Basket.fromJSON(JSON.parse(storedBasket)) || new Basket(),
	};
}
