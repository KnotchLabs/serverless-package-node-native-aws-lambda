'use strict';

const path = require('path');
const cproc = require('child_process');

class PackageNodeNativeAwsLambda {
  constructor(serverless, options) {
    const { config: { servicePath } } = serverless;

    this.servicePath = servicePath;
    this.modulesPath = path.join(servicePath, 'node_modules');

    this.serverless = serverless;
    this.hooks = {
      'before:package:createDeploymentArtifacts': () => this.beforeDeploy(),
      'after:package:finalize': () => this.afterFinalize()
    };

    this.handleExit();
  }

  get nativeModules() {
    return this.serverless.service.custom.nativeModules;
  }

  get nativeModuleImageTag() {
    return this.serverless.service.custom.nativeModuleImageTag || 'latest';
  }

  get nativeModuleImage() {
    return 'iopipe/awslambda-npm-install';
  }

  beforeDeploy() {
    const image = `${this.nativeModuleImage}:${this.nativeModuleImageTag}`;
    const baseCmd = `docker run -v ${this.servicePath}:/var/task ${image}`;

    return Promise.all(this.nativeModules.map(module => {
      return new Promise((resolve, reject) => {
        // Install native module with awslambda-npm-install (via Docker)
        cproc.exec(`${baseCmd} ${module}`, error => { error ? reject(error) : resolve() });
      });
    }));
  }

  afterFinalize() {
    return Promise.all(this.nativeModules.map(module => {
      return new Promise((resolve, reject) => {
        // Rebuild native module with local node
        cproc.exec(`npm rebuild ${module}`, error => { error ? reject(error) : resolve() });
      });
    }));
  }

  handleExit() {
    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(
      signal => process.on(signal, () => { this.afterFinalize(); })
    );
  }
}

module.exports = PackageNodeNativeAwsLambda;
