# Auth Service
[![Circle CI](https://circleci.com/gh/redgeoff/serverless-playground.svg?style=svg&circle-token=5f684c9e9a78dbc10266a08bb3fcf6226df4165e)](https://circleci.com/gh/redgeoff/serverless-playground)

2nd Generation Identity Service

## Install

```bash
yarn install
```

## Run Locally

```bash
yarn serve
```

## Deploy Remotely

Assuming you've already set up your default AWS credentials (or have set a different AWS profile via [the profile field](serverless.yml#L25)):

```bash
yarn deploy
```

`yarn deploy` will deploy to "dev" environment. You can deploy to `stage` or `production`
with:

```bash
yarn deploy:stage

# -- or --

yarn deploy:production
```

After you've deployed, the output of the deploy script will give you the API endpoint
for your deployed function(s), so you should be able to test the deployed API via that URL.

## Swagger Docs

The [API Docs](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/redgeoff/serverless-playground/master/swagger.yml) are automatically generated using swagger.io and the [swagger.yml](swagger.yml) definition

You may find it useful to visualize the Swagger definition with [Swagger Editor](http://editor.swagger.io/)

## [Testing](TESTING.md)

## [Contributing](CONTRIBUTING.md)
