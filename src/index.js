'use strict';

var Basket = require('./basket');
var ga = require('./ga');
var renderBasket = require('./basket-view');
var configuration = require('../conf.json');

var shopName = configuration.name;
var key = configuration['paylike-public-key'];
var locale = configuration.locale;
var currency = configuration.currency;
var checkoutFields = configuration['checkout-fields'];
var products = configuration.products;
var trackingId = configuration.googleAnalytics;

var paylike = global.Paylike(key);

run(window.localStorage, window.document.documentElement);

function run( storage, $root ){
	if (trackingId) {
		ga('create', trackingId, 'auto');
		ga('send', 'pageview');
	}

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
			var $buy = $li.querySelector('a.buy');

			if (!$buy)
				return;

			$buy.addEventListener('click', function( e ){
				e.preventDefault();
				e.stopPropagation();

				var product = products[+$li.getAttribute('data-n')];

				state.basket.add({
					name: product.name,
					image: product.image,
					price: product.price,
					sku: product.sku,
					quantity: 1,
				});

				renderBasket($basket, state.basket, locale, currency, onIncrease, onCheckout);
				save(storage, state);

				$basket.classList.remove('closed');

				if ($basket.scrollIntoViewIfNeeded)
					$basket.scrollIntoViewIfNeeded({ behavior: 'smooth' });
				else if ($basket.scrollIntoView)
					$basket.scrollIntoView({ behavior: 'smooth' });

				track('basket', 'add');
			});
		});
	}

	function onIncrease( line, quantity ){
		state.basket.increase(line, quantity);
		renderBasket($basket, state.basket, locale, currency, onIncrease, onCheckout);
		save(storage, state);
		track('basket', quantity > 0 ? 'increase' : 'decrease');
	}

	function onCheckout(){
		paylike.popup({
			locale: locale,
			currency: currency,
			amount: state.basket.total(),

			title: shopName,
			description: state.basket.summary(),

			custom: state.basket.toJSON(),

			fields: checkoutFields,
		}, function( err ){
			if (err){
				track('checkout', 'close');

				return;
			}

			state.basket.empty();
			renderBasket($basket, state.basket, locale, currency, onIncrease, onCheckout);
			save(storage, state);

			window.location = '/thanks.html';
		});

		track('checkout', 'open');
	}
}

function track( category, action ){
	if (trackingId)
		ga('send', 'event', category, action);
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
