/* eslint-disable no-global-assign, no-param-reassign, import/no-cycle */
import cheerio from 'cheerio';
import { ServerSink } from './server-sink';
import { onPageLoad } from './server';

function updateContent(pData, pSection, pSelector, pItemArray) {
  let reallyMadeChanges = false;
  const content = pSection === 'head' ? `<head>${pData.head}</head>` : `<body>${pData.body}</body>`;
  const cheerioLoad = cheerio.load(content, { xmlMode: false });

  for (let itemArrayIndex = 0; itemArrayIndex < pItemArray.length; itemArrayIndex += 1) {
    const item = pItemArray[itemArrayIndex];

    // For html attributes
    if (pSection === 'head' && item.tag === 'html') {
      pData.htmlAttributes[item.updateAttribute] = item.value;
    } else {
      // For head / body updates
      let searchField = '';
      if (pSelector === 'id') {
        searchField = `#${item.id}`;
      } else {
        searchField =
          item.searchAttribute && item.searchAttributeValue
            ? `${item.tag}[${item.searchAttribute}=${item.searchAttributeValue}]`
            : item.tag;
      }
      if (!item.value) {
        cheerioLoad(searchField).remove();
      } else if (item.updateAttribute) {
        cheerioLoad(searchField).attr(item.updateAttribute, item.value);
      } else if (item.updateType === 'prepend') {
        cheerioLoad(searchField).prepend(item.value);
      } else if (item.updateType === 'append') {
        cheerioLoad(searchField).append(item.value);
      } else {
        cheerioLoad(searchField).html(item.value);
      }
    }

    reallyMadeChanges = true;
  }

  if (reallyMadeChanges) {
    pData[pSection] = cheerioLoad(pSection).html();
  }

  return reallyMadeChanges;
}

WebAppInternals.registerBoilerplateDataCallback(
  'meteor/goldenpassport:server-render',
  (pRequest, pData, pArch) => {
    const sink = new ServerSink(pRequest, pArch);

    return onPageLoad.chain((callback) => callback(sink, pRequest)).then(() => {
      if (!sink.maybeMadeChanges) {
        return false;
      }

      let reallyMadeChanges = false;

      if (sink.headHtmlByTag) {
        reallyMadeChanges = updateContent(pData, 'head', 'tag', sink.headHtmlByTag);
      }

      if (sink.bodyHtmlById) {
        reallyMadeChanges = updateContent(pData, 'body', 'id', sink.bodyHtmlById);
      }

      if (sink.statusCode) {
        pData.statusCode = sink.statusCode;
        reallyMadeChanges = true;
      }

      if (Object.keys(sink.responseHeaders)) {
        pData.headers = sink.responseHeaders;
        reallyMadeChanges = true;
      }

      return reallyMadeChanges;
    });
  }
);
