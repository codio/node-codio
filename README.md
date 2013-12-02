# Node Codio

API to connect to [codio/server] from a node.js client.



## Usage

```js
var API = require('api');

var api = new API(options);

api.projectStructureManager.getFile('hello.txt', auth, function (err, data) {
  if (err) return console.error(err);
  console.log('Got data: ', data);
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


### ProjectManager

* `getProjectByName`
* `checkPermissionForUser`
* `checkPermissionForProject`

### ProjectStructureManager

* `getFile`
* `updateFile`
* `removePath`
* `createFile`
* `moveItem`
* `copyItem`
* `makeDirectory`

[codio/server]: https://github.com/codio/server
