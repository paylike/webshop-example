'use strict';

var find = require('array-find');

module.exports = Basket;

function Basket( lines ){
	this.lines = lines || [];
}

Basket.fromJSON = function( lines ){
	return new Basket(lines);
};

Basket.prototype.add = function( product ){
	var existing = product.sku && find(this.lines, function( existing ){
		return product.sku === existing.sku;
	});

	if (existing)
		existing.quantity += product.quantity;
	else
		this.lines.push(product);
};

Basket.prototype.count = function(){
	return this.lines.reduce(sumQuantity, 0);
};

Basket.prototype.total = function(){
	return this.lines.reduce(sumPrice, 0);
};

Basket.prototype.increase = function( product, quantity ){
	var existing = product.sku && find(this.lines, function( existing ){
		return product.sku === existing.sku;
	});

	if (!existing)
		throw new Error('Trying to increase an unknown basket line');

	existing.quantity += quantity;

	if (existing.quantity <= 0)
		this.lines = this.lines.filter(function( product ){
			return product !== existing;
		});
};

Basket.prototype.summary = function(){
	return this.lines.map(function( line ){
		return line.quantity+'x '+line.name+' ('+line.sku+')';
	}).join(', ');
};

Basket.prototype.empty = function(){
	this.lines = [];
};

Basket.prototype.toJSON = function(){
	return this.lines;
};

function sumQuantity( curr, product ){
	return curr + product.quantity;
}

function sumPrice( curr, product ){
	return curr + product.price * product.quantity;
}
