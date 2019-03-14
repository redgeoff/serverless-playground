# Testing

## 100% Coverage

This project requires 100% test coverage as this allows us to:
  1. Use tools like [greenkeeper](https://greenkeeper.io)
  2. Refactor/optimize without breaking anything

## Run tests and analyze coverage:

    $ yarn test:coverage

You can then use your browser to view the detailed coverage report at `coverage/lcov-report/index.html`

## Run just the unit tests and watch for changes:

This command should probably be your default way of running tests as it is very fast; due to the fact, that it does not instantiate the server routine. Moreover, it will allow you to automatically rerun tests whenever you save changes to your files.

    $ yarn test:unit:watch

Note: even with NFS syncing, vagrant is not 100% reliable at communicating changes to your files when changes are made to your files in the host. If you notice that a change is not picked up by the watch routine, run `yarn touch`.

## Run just the integration tests and watch for changes:

    $ yarn test:integration:watch

## Validate swagger definition

    $ yarn test:swagger