# serverless-package-node-native-aws-lambda

Small serverless plugin which uses
[awslambda-npm-install](https://github.com/iopipe/awslambda-npm-install)
to package functions with with native module for deployment on AWS
Lambda.

### Installation

This package assumes you have Docker installed and have setup
[awslambda-npm-install](https://github.com/iopipe/awslambda-npm-install).

```
npm i serverless-package-node-native-aws-lambda --save-dev
```

### Usage

```yml
service: service-name

plugins:
  - serverless-package-node-native-aws-lambda

functions:
  # Your functions here

custom:
  nativeModuleImageTag: v8
  nativeModules:
    - node-webcrypto-ossl
```

#### Licensing

serverless-package-external is licensed under the [MIT License](./LICENSE.txt).
