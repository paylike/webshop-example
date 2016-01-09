# Simple static webshop

This is meant to get you up and running with a webshop as fast as possible and
with minimal or no costs at all.

## Install

```
git clone git@github.com:paylike/webshop-example.git
cd webshop-example
npm install
```

## Develop

```
npm run dev
```

Open http://127.0.0.1:8000 in your browser.

## Deploy to static host

```
npm run build
```

Copy the content of the `/dist` folder to your web server host (e.g. an Amazon
(AWS) S3 bucket).

## Deploy server

With Heroku and similar services, this should work out-of-the-box by pushing
this repository.

```
npm start
```
