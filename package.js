Package.describe({
  name: 'goldenpassport:server-render',
  version: '0.3.2',
  summary: 'Generic support for server-side rendering in Meteor apps',
  documentation: 'README.md',
  repository: {
    type: 'git',
    url: 'https://github.com/GoldenPassport/meteor-server-render'
  }
});

Npm.depends({
  cheerio: '1.0.0-rc.2'
});

Package.onUse((pApi) => {
  pApi.use(['ecmascript@0.11.1', 'webapp@1.6.2']);
  pApi.mainModule('client.js', 'client');
  pApi.mainModule('server.js', 'server');
});

Package.onTest(() => {});
