# peerdep

> A warning system for peer dependencies.

`peerDependencies` may become removed from npm but that doesn't mean modules won't have peer dependencies. Any time a module accepts a plugin a peer dependency has been created. This library will help you warn users when they have not installed a compatible peer dependency.

[![NPM](https://nodei.co/npm/peerdep.png?downloads=true)](https://nodei.co/npm/peerdep/)

## usage

Install with `npm install peerdep --save` and then in your module/plugin's `package.json`, define your `peerDependencies` as normal but include this `peerdep` install script:

```json
{
  "name": "my-plugin",
  "version": "0.1.0",
  "scripts": {
    "install": "peerdep"
  },
  "peerDependencies": {
    "grunt": "~0.4.1"
  },
  "dependencies": {
    "peerdep": "~0.1.0"
  }
}
```

Now when your plugin has been installed it will run the `peerdep` script to check if a compatible version of `grunt@~0.4.1` has been installed. If it has not been installed or an incompatible version has been installed `peerdep` will log a warning to the user upon `npm install`:

```shell
WARN peerinvalid Peer my-plugin@0.1.0 wants grunt@~0.4.1 but found "grunt@0.3.0" installed.
```

### Alternative `peerDependencies` key

The first argument of the `peerdep` script is an alternate key if you want to avoid conflicts with the existing `peerDependencies` key:

```json
{
  "name": "my-plugin",
  "version": "0.1.0",
  "scripts": {
    "install": "peerdep myPeerDependencies"
  },
  "myPeerDependencies": {
    "grunt": "~0.4.1"
  },
  "dependencies": {
    "peerdep": "~0.1.0"
  }
}
```

## Release History
* 0.1.0 - initial release

## License
Copyright (c) 2014 Kyle Robinson Young  
Licensed under the MIT license.
