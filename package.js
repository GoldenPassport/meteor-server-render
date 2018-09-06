Package.describe({
  name: 'goldenpassport:server-render',
  version: '0.3.1',
  summary: 'Generic support for server-side rendering in Meteor apps',
  documentation: 'README.md'
});

Npm.depends({
  cheerio: '1.0.0-rc.2'
});

Package.onUse((pApi) => {
  pApi.use(['ecmascript', 'webapp']);
  pApi.mainModule('client.js', 'client');
  pApi.mainModule('server.js', 'server');
});

Package.onTest(() => {});
