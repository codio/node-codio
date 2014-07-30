# Node Codio

[![wercker status](https://app.wercker.com/status/740b1e702348d13653d556d3ba60d11c/m/ "wercker status")](https://app.wercker.com/project/bykey/740b1e702348d13653d556d3ba60d11c)

API to connect to [codio/server] from a node.js client.



## Usage

```js
var API = require('node-codio');

var api = new API(options);

api.projectStructureManager.getFile('hello.txt', auth)
.then(function (data) {
  console.log('Got data: ', data);
})
.catch(function (err) {
  console.error(err);
});
```

## Configuration

You can pass the constructor an options object with the following properites:

* `useOrigin`: (`Boolean`) Set to true if you are running the server locally.
  Used primarily for development and testing.
* `hostname`: (`String`) Hostname of the server.
* `path`: (`String`) Path that will be appended to the hostname.
* `port`: (`Number`) Port where the server will be run.


## Available Methods

### AccountManager

* `getMyInfo`
* `get`

### ProjectManager

* `get`
* `getProjectByName`
* `getProjectForListener`
* `checkPermissionForUser`
* `checkPermissionForProject`
* `getPermissionForProject`
* `updateProject`
* `remove`

### ProjectStructureManager

* `getFile`
* `getFileForListener`
* `updateFile`
* `removePath`
* `createFile`
* `moveItem`
* `copyItem`
* `makeDirectory`

### Organization Manager

* `getById`
* `getByName`
* `createTeam`
* `getTeamByName`
* `getMyOrganizations`
* `isMemberOf`

### ContainerManager

* `start`
* `stop`
* `info`
* `getPierContainerInfo`

### TaskManager

* `getTaskStatus`
* `pingTaskStatus`

### ImportManager

* `importFromZip`
* `importFromHg`
* `importFromGit`

## Development


```bash
$ git clone https://github.com/codio/node-codio.git
$ cd node-codio
$ npm install
```

Start developing, tests can be run via `grunt test` and `grunt watch`
runs unit tests on save. Before commiting any changes make sure to run the
default `grunt` task to execute jshint and all unit tests.



[codio/server]: https://github.com/codio/server
