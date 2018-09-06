export class ServerSink {
  constructor(pRequest, pArch) {
    this.request = pRequest;
    this.arch = pArch;
    this.headHtmlByTag = [];
    this.bodyHtmlById = [];
    this.maybeMadeChanges = false;
    this.statusCode = null;
    this.responseHeaders = {};
  }

  updateHeadElementByTag(
    pTag,
    pValue,
    pUpdateType = 'replace',
    pUpdateAttribute,
    pSearchAttribute,
    pSearchAttributeValue
  ) {
    if (pTag) {
      this.headHtmlByTag.push({
        tag: pTag,
        value: pValue,
        updateType: pUpdateType,
        updateAttribute: pUpdateAttribute,
        searchAttribute: pSearchAttribute,
        searchAttributeValue: pSearchAttributeValue
      });
      this.maybeMadeChanges = true;
    }
  }

  updateBodyElementById(pId, pValue, pUpdateType = 'replace', pUpdateAttribute) {
    if (pId) {
      this.bodyHtmlById.push({
        id: pId,
        value: pValue,
        updateType: pUpdateType,
        updateAttribute: pUpdateAttribute
      });
      this.maybeMadeChanges = true;
    }
  }

  redirect(pLocation, pCode = 301) {
    this.maybeMadeChanges = true;
    this.statusCode = pCode;
    this.responseHeaders.Location = pLocation;
  }

  //
  // server only methods
  //
  setStatusCode(pCode) {
    this.maybeMadeChanges = true;
    this.statusCode = pCode;
  }

  setHeader(pKey, pValue) {
    this.maybeMadeChanges = true;
    this.responseHeaders[pKey] = pValue;
  }

  getHeaders() {
    return this.request.headers;
  }

  getCookies() {
    return this.request.cookies;
  }
}

export default ServerSink;
