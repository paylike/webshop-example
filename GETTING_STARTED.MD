# Guide to setting up your first webshop

## Step-by-step

#### 1. Get a free account
Signup at [Paylike](https://app.paylike.io) to get a free merchant account.

#### 2. Download Node.js
If you already has this installed, skip this step.

Go to [Node.js](https://nodejs.org/en/download/) and download the latest version of Node.js. Follow the wizard to install Node.js on your machine.

#### 3. Download and extract the webshop
Download and extract the files found here as either [.zip](https://github.com/paylike/webshop-example/archive/v1.0.0.zip) or [tar.gz](https://github.com/paylike/webshop-example/archive/v1.0.0.tar.gz).

#### 4. Setup configuration
Navigate to the extracted folder, and rename `conf.example.json` to `conf.json`.

Right click the renamed file `conf.json`, and open it with any text editor.

Configure the following, and save the file (don't close it):

```
{
	"name": 				(name of the webshop),
	"paylike-public-key": 	(public key found in Paylike dashboard),
	"locale": 				(payment popup locale),
	"currency": 			(site currency),
	"[google-analytics]": 	(google analytics account id) *optional,
	"amounts": {
		"before": 			(prefix before the amount text)
		"after": 			(prefix after the amount text)
		"decimal": 			(decimal seperator)
		"thousands": 		(thousand seperator)
		"fractions": 		(number of fractions in a decimal number)
	},
	"checkout-fields":		(fields shown in the payment popup)
	"footer": 				(text shown in footer)
	"email": 				(contact email)
}
```


#### 5. Adding products
Copy product photos to the folder located at `/dist/images/products`.

Now in the `conf.json` file you have open, add your products.

```
{
	"products": [				(array of product objects)
		{
			"name": 			(product name),
			"sku": 				(product sku),
			"price": 			(product price in minor units),
			"priceFormatted": 	(product price in text),
			"image": 			(product image '"/images/products/"')
		},
	],
}
```

#### 6. Building the deployment files
Navigate to the folder `/bin` and double click the build file.
This will build all files needed for deployment in the `/dist` folder.

#### 7. Review
Double click the `/dist/index.html` file to see your website.

#### 8. Deploy
You can now deploy your webshop to any static site host.

#### 9. Manage transactions
Every time a product is sold on the website, a transaction will be created in the [Paylike Dashboard](https://app.paylike.io).
Capture the transaction when you ship the product.
