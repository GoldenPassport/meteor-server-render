/* eslint-disable no-console */
const updateElementValue = (
  pElement,
  pValue,
  pUpdateType,
  pUpdateAttribute,
  pSearchAttribute,
  pSearchAttributeValue
) => {
  const element = pElement;

  if (!pValue) {
    element.parentElement.removeChild(element);
  } else if (pUpdateAttribute) {
    if (pSearchAttribute && pSearchAttributeValue) {
      element.setAttribute(pSearchAttribute, pSearchAttributeValue);
    }
    element.setAttribute(pUpdateAttribute, pValue);
  } else if (pUpdateType === 'prepend') {
    element.innerHTML = pValue + element.innerHTML;
  } else if (pUpdateType === 'append') {
    element.innerHTML += pValue;
  } else {
    element.innerHTML = pValue;
  }

  return element;
};

export class ClientSink {
  constructor() {
    this.isoError = ClientSink.isoError;
    this.updateHeadElementByTag = ClientSink.updateHeadElementByTag;
    this.updateBodyElementById = ClientSink.updateBodyElementById;
  }

  static isoError(pMethod) {
    console.error(`sink.${pMethod} was called on the client when
      it should only be called on the server.`);
  }

  // TODO use queryselector
  static updateHeadElementByTag(
    pTag,
    pValue,
    pUpdateType = 'replace',
    pUpdateAttribute,
    pSearchAttribute,
    pSearchAttributeValue
  ) {
    if (pTag) {
      const head = document.getElementsByTagName('head')[0];
      let updatedElement;

      const elements = head.getElementsByTagName(pTag);
      for (let elementsIndex = 0; elementsIndex < elements.length; elementsIndex += 1) {
        const element = elements[elementsIndex];

        if (
          !pSearchAttribute ||
          !pSearchAttributeValue ||
          element.getAttribute(pSearchAttribute) === pSearchAttributeValue
        ) {
          updatedElement = updateElementValue(element, pValue, pUpdateType, pUpdateAttribute);
        }
      }

      if (!updatedElement) {
        const newElement = document.createElement(pTag);
        updatedElement = updateElementValue(
          newElement,
          pValue,
          pUpdateType,
          pUpdateAttribute,
          pSearchAttribute,
          pSearchAttributeValue
        );
        head.appendChild(updatedElement);
      }
    }
  }

  static updateBodyElementById(pId, pValue, pUpdateType = 'replace', pUpdateAttribute) {
    if (pId) {
      const { body } = document;

      const elements = body.getElementsById(pId);
      for (let elementsIndex = 0; elementsIndex < elements.length; elementsIndex += 1) {
        const element = elements[elementsIndex];
        updateElementValue(element, pValue, pUpdateType, pUpdateAttribute);
      }
    }
  }

  static redirect(pLocation) {
    // code can't be set on the client
    window.location = pLocation;
  }

  //
  // server only methods
  //

  setStatusCode() {
    this.isoError('setStatusCode');
  }

  setHeader() {
    this.isoError('setHeader');
  }

  getHeaders() {
    this.isoError('getHeaders');
  }

  getCookies() {
    this.isoError('getCookies');
  }
}

export default ClientSink;
