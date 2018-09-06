<p align="center">
  <a href="http://goldenpassport.com" target="_blank">
    <img src="https://avatars0.githubusercontent.com/u/29756034?v=4&s=100">
  </a>
</p>


# server-render

This package implements generic support for server-side rendering in
Meteor apps, by providing a mechanism for injecting fragments of HTML into
the `<html>`, `<head>` and `<body>` of the application's initial HTML response.

This package is ideal for projects that use client-side rendering and need 
to support SSR capabilities such as SEO injection as well as pure-play SSR projects.

The package uses `Cheerio` for its high-speed DOM parsing, but if you prefer to have a 
"streaming based solution - i.e. reading the HTML source line-by-line" then 
please rather use this Meteor package (N.B. Without DOM parsing the abiility 
to inject HTML on the fly is very limiting) - [Source code of released version](https://github.com/meteor/meteor/tree/master/packages/server-render).

### Usage

To install:<br>
`meteor add meteor/goldenpassport:server-render`

This package exports a function named `onPageLoad` which takes a callback
function that will be called at page load (on the client) or whenever a
new request happens (on the server). N.B. onPageLoad will always trigger on 
the inial page load, but if you are using 3rd party routers like Vue.router then
subsequent internal app routeing may not trigger `onPageLoad`.

The callback receives a `sink` object, which is an instance of either
`ClientSink` or `ServerSink` depending on the environment.

The current interface of `{Client,Server}Sink` objects is as follows:

```js
class Sink {
  /*************************************
  *
  *  Available on both client & server
  * 
  *************************************/

  //
  // Prepend / append / replace head content by tag
  updateHeadElementByTag(tag, value, updateType, updateAttribute, searchAttribute, searchAttributeValue)

  // Prepend / append / replace body content by id
  updateBodyElementById(id, value, updateType, updateAttribute)

  // Redirects request to new location.
  redirect(location, code)


  /*************************************
  *
  *  Server only methods
  * 
  *************************************/

  // sets the status code of the response.
  setStatusCode(code)

  // sets a header of the response.
  setHeader(key, value)

  // gets request headers
  getHeaders()

  // gets request cookies
  getCookies()
}
```

The `sink` object may also expose additional properties depending on the
environment. For example, on the server, `sink.request` provides access to
the current `request` object, and `sink.arch` identifies the target
architecture of the pending HTTP response (e.g. "web.browser").

There are two primary methods called `updateHeadElementByTag` and 
`updateBodyElementById`, which can be used to update the respective `head`
and `body` sections of the html.

^ Required

| API | Parameters | Description |
| ------ | ------ | ------ |
| **updateHeadElementByTag** | [tag&nbsp;String^],<br>[value&nbsp;String],<br>[updateType&nbsp;String],<br>[updateAttribute&nbsp;String],<br>[searchAttribute&nbsp;String],<br>[searchAttributeValue&nbsp;String] |  e.g. "meta". Mandatory <br>e.g. "this is the page's description". Optional - if empty the matching element is deleted.<br>e.g. "replace" / "prepend" / "amend". Optional - defaults to "replace".<br>update attribute instead of html e.g. "name". Optional - if undefined, html is updated.<br>e.g. "name". Optional - if undefined then only tag name is used for search.<br>e.g. "description". Optional - if maintained then the searchAttribute must be used.|
| **updateBodyElementById** | [id&nbsp;String^],<br>[value&nbsp;String],<br>[updateType&nbsp;String],<br>[updateAttribute&nbsp;String] | element ID e.g. "app". Mandatory<br>value e.g. "this is the page's description". Optional - if empty the matching element is deleted.<br>e.g. "replace" / "prepend" / "amend". Optional - defaults to "replace".<br>update attribute instead of html e.g. "name". Optional - if undefined, html is updated.|


<br>
<br>
A few examples:

```js
import { onPageLoad } from 'meteor/goldenpassport:server-render';
onPageLoad(sink => {
  //
  // Head update examples
  //  

  // Maybe there isn't a title at the start so let's insert one into the head
  sink.updateHeadElementByTag('head', '<title>Awesome Site!!!</title>', 'prepend');
  // And then later update the title
  sink.updateHeadElementByTag('title', 'Awesome Site!!! - Page 1');
  // Can also update the html attributes
  sink.updateHeadElementByTag('html', 'en', 'replace', 'lang');
  // Add a description
  sink.updateHeadElementByTag('meta', 'Our website desc...', undefined, 'content', 'name', 'description');
  // Well let's delete the description meta
  sink.updateHeadElementByTag('meta', undefined, undefined, undefined, 'name', 'description');
  // Can also update the top-level <html> attributes (updateHeadElementByTag only)
  sink.updateHeadElementByTag('html', 'en', 'replace', 'lang');
  
  //
  // Body update examples (similar to the above illustrations)
  //

  // Replace something
  sink.updateBodyElementById('app', '<div>Some cool code</div>');

  // Update something
  sink.updateBodyElementById('app', '<div>Some cool code</div>', 'prepend');
});
```

Note that the `onPageLoad` callback function is allowed to return a
`Promise` if it needs to do any asynchronous work, and thus may be
implemented by an `async` function (as in the client case below).

```js
import { onPageLoad } from 'goldenpassport:server-render';

onPageLoad(sink => {
  const seo = await (await import('./seo')).default;
	sink.updateHeadElementByTag('head', await seo(sink), 'append');
});
```
