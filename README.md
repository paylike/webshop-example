# Simple static webshop

This is meant to get you up and running with a webshop as fast as possible and
with minimal or no costs at all.

- No backend
- Compiles to static HTML, CSS and JavaScript
- Runs with any hosting
- Simple, unobtrusive and easy to get started

Instead of its own backend, the webshop relies on the [Paylike
dashboard](https://app.paylike.io) for handling transactions.

Prerequisites:

- [Node.js](https://nodejs.org/en/download/) for development and building
- A host such as [Amazon Web services](https://aws.amazon.com/s3/) or [Heroku](https://www.heroku.com) (any web server, Node.js not required)
- SSL/TLS certificate (https) for secure access (any website should, especially ecommerce)
- [A merchant account at Paylike (free)](https://app.paylike.io)

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

## Deploy to static host (e.g. Amazon S3)

```
PAYLIKE_KEY=your-public-key npm run build
```

Copy the content of the `/dist` folder to your web server (e.g. an Amazon
(AWS) S3 bucket).

If your using a VPS or a dedicated server with [Nginx](http://nginx.org), you
need a configuration file along the lines of
[nginx.sample.conf](nginx.sample.conf).

## Deploy server

With [Heroku](https://www.heroku.com) and similar services, this should work
out-of-the-box by pushing this repository.

```
npm start
```
