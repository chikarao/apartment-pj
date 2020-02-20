import _ from 'lodash';
import {
  CREATE_DOCUMENT_ELEMENT_LOCALLY,
  UPDATE_DOCUMENT_ELEMENT_LOCALLY,
  DELETE_DOCUMENT_ELEMENT_LOCALLY,
  POPULATE_TEMPLATE_ELEMENTS_LOCALLY,
  SET_CREATE_DOCUMENT_KEY,
  SET_INITIAL_VALUES_OBJECT,
  EDIT_HISTORY,
  EDIT_AGREEMENT_FIELDS,
  FETCH_DOCUMENT_TRANSLATION,
  SAVE_TEMPLATE_DOCUMENT_FIELDS,
  // SELECTED_ICALENDAR_ID
} from '../actions/types';

export default function (state = {
  initialValuesObject: {},
  overlappedkeysMapped: {},
  allFields: [],
  editHistoryArray: [],
  dirtyObject: {},
  dirtyFieldExists: false,
  agreementMappedById: {},
  agreementMappedByName: {},
  documentTranslations: {},
  templateElements: {}
}, action) {
  // console.log('in documents reducer, action.payload: ', action.payload);
  const fontObject = { fontFamily: {}, fontSize: {}, fontStyle: {}, fontWeight: {} };

  function getElementFontAttributes(elements) {
    // Get a map of the attributes font family, size style and weight used
    // in the document
    console.log('in create_edit_document, getElementFontAttributes, elements: ', elements);
    // Go through each element and each of the keys in fontObject
    _.each(Object.keys(elements), eachElementKey => {
      // If the element is a text or string element place in object with an array with element ids
      if (elements[eachElementKey].type === 'text' || elements[eachElementKey].type === 'string') {
        console.log('in create_edit_document, getElementFontAttributes, eachElementKey: ', eachElementKey);
        _.each(Object.keys(fontObject), eachKey => {
          if (!fontObject[eachKey][elements[eachElementKey][eachKey]]) {
            fontObject[eachKey][elements[eachElementKey][eachKey]] = [elements[eachElementKey].id];
          } else {
            fontObject[eachKey][elements[eachElementKey][eachKey]].push(elements[eachElementKey].id);
          }
        });
      }
    });
    // Looks like { fontFamily: { arial: [1, 2, 3] }, fontSize: { 12px: [1, 2, 3] }... }
    return fontObject;
  }

  function getOnlyFontAttributes(object) {
    // Get the font attribute that is the only attribute for document
    const returnObject = {};
    _.each(Object.keys(fontObject), eachKey => {
      if (Object.keys(object[eachKey]).length === 1) {
        returnObject[eachKey] = Object.keys(object[eachKey])[0];
      } else {
        returnObject[eachKey] = null;
      }
    });
    return returnObject;
  }

  function getMappedObjectWithStringIds(elementsArray, templateEditHistory, actionCreate) {
    // console.log('in documents reducer, getMappedObjectWithStringIds, for POPULATE_TEMPLATE_ELEMENTS, elementsArray, templateEditHistory, actionCreate: ', elementsArray, templateEditHistory, actionCreate);
    // time complexity about same as calling _.mapKeys but with extra functionality
    const object = {};
    let modifiedElement = {};

    function updateElements(element) {
      let modifiedElem = {};
      let returnString = '';
      console.log('in documents reducer, getMappedObjectWithStringIds, for POPULATE_TEMPLATE_ELEMENTS, updateElements element, templateEditHistory: ', element, templateEditHistory);
       // each with i history array, iterate through each history array of arrays of objects;
       // Lookes like [[ { id: 1, width: 10, o_width: 9, action: 'update' }], [ {}, {}...]]
      _.each(templateEditHistory.templateEditHistoryArray, (eachEditArray, i) => {
        // Do until this.state.historyIndex is greater than or equal to i;
        // So if user has undone or redone, stop there
        if (i <= templateEditHistory.historyIndex) {
          // Iterate through each array of objects; object looks like  { id: 1, width: 10, o_width: 9, action: 'update' }
          _.each(eachEditArray, eachEditObject => {
            console.log('in documents reducer, getMappedObjectWithStringIds, for POPULATE_TEMPLATE_ELEMENTS, updateElements element, eachEditObject, eachEditObject.action, eachEditObject.action === delete: ', element, eachEditObject, eachEditObject.action, eachEditObject.action === 'delete');
            // if object id is equal to id of element in backend, do
            if (eachEditObject.id === element.id.toString()) {
              // if object action is delete, assign delete to returnstring to be returned
              if (eachEditObject.action === 'delete') returnString = 'deleted';
              // Iterate through each attribute in object ie { width, font_style ...}
              _.each(Object.keys(eachEditObject), eachKey => {
                if (element[eachKey] !== eachEditObject[eachKey] && eachKey !== 'action') {
                  modifiedElem = element;
                  modifiedElem[eachKey] = eachEditObject[eachKey];
                }
              }); // end of third each
            }
          }); // end of second each
        } // end of if
      }); // end of first each
      // return null, delete or ok; if ok, the element is placed in this.props.templateElements
      return returnString || 'ok';
    }
    // Iterate through each element persisted as agreement.document_fields
    _.each(elementsArray, eachElement => {
      // Assign to modified
      modifiedElement = eachElement;
      // Id to string so later code works with temporary ids (eg '1a')
      modifiedElement.id = eachElement.id.toString();
      // Assign create so redo and undo of create works in undoRedoAction
      if (actionCreate) modifiedElement.action = 'create';
      // If there is history for this agreement template elements, update elements along with map keys
      if (templateEditHistory) {
        // update elements returns null, delete or ok; if ok,
        // put modifeid object in in mapped object
        if (updateElements(modifiedElement) === 'ok') {
          object[modifiedElement.id.toString()] = modifiedElement;
        }
      } else { // else for if templateEditHistory
        // if no templateEditHistory, just put into the mapped object
        object[modifiedElement.id.toString()] = modifiedElement;
      }
    }); // end of each

    return object;
  }

  let fontAttributeObject = null;
  let onlyFontAttributeObject = null;

  switch (action.type) {
    // Populate template elememts to get document_fields from agreement and combine with
    // local template elements retrieved from localStorage
    case POPULATE_TEMPLATE_ELEMENTS_LOCALLY: {
      console.log('in documents reducer, state, POPULATE_TEMPLATE_ELEMENTS, action.payload, state.templateElements: ', action.payload, state.templateElements);
      const newObject = {};
      // Rather than calling _.mapKeys, do the same thing
      // and turn ids into strings and assign action: create
      const mapKeysObject = getMappedObjectWithStringIds(action.payload.array, action.payload.templateEditHistory, true);
      // Keep object with original values for elements persisted in backend to check for changes
      const originalPersistedTemplateElements = mapKeysObject;
      // // REFERENCE: https://stackoverflow.com/questions/19965844/lodash-difference-between-extend-assign-and-merge
      // // Use lodash merge to get elements in mapped object { 1: {}, 2: {} }
      const mergedObject = _.merge(newObject, state.templateElements, mapKeysObject);

      return { ...state, templateElements: mergedObject, fontAttributeObject, onlyFontAttributeObject, originalPersistedTemplateElements };
    }

    case SAVE_TEMPLATE_DOCUMENT_FIELDS: {
      console.log('in documents reducer, state, SAVE_TEMPLATE_DOCUMENT_FIELDS, action.payload: ', action.payload);
      // const newObject = {}
      // const mergedObject = _.merge(newObject, state.templateElements, { [action.payload.id]: action.payload });
      fontAttributeObject = getElementFontAttributes(action.payload.agreement.document_fields);
      onlyFontAttributeObject = getOnlyFontAttributes(fontAttributeObject);
      // Rather than calling _.mapKeys, do the same thing
      // and turn ids into strings and assign action: create
      const mapKeysObject = getMappedObjectWithStringIds(action.payload.agreement.document_fields, true);

      return { ...state, templateElements: mapKeysObject, fontAttributeObject, onlyFontAttributeObject };
    }

    case CREATE_DOCUMENT_ELEMENT_LOCALLY: {
      console.log('in documents reducer, state, CREATE_DOCUMENT_ELEMENT_LOCALLY, action.payload, state.templateElements: ', action.payload, state.templateElements);
      const newObject = {}
      // REFERENCE: https://stackoverflow.com/questions/19965844/lodash-difference-between-extend-assign-and-merge
      // Use lodash merge to get elements in mapped object { 1: {}, 2: {} }
      const mergedObject = _.merge(newObject, state.templateElements, { [action.payload.id]: action.payload });
      fontAttributeObject = getElementFontAttributes(mergedObject);
      onlyFontAttributeObject = getOnlyFontAttributes(fontAttributeObject);

      return { ...state, templateElements: mergedObject, fontAttributeObject, onlyFontAttributeObject };
    }

    case DELETE_DOCUMENT_ELEMENT_LOCALLY: {
      console.log('in documents reducer, state, DELETE_DOCUMENT_ELEMENT_LOCALLY, action.payload: ', action.payload);
      // Get shallow copy of template elements in new object
      // Needs to be new object so redux will find a new updated state.
      const newDeleteObject = _.merge({}, state.templateElements);
      // iterate through each element id in action payload
      // and delete id: elementObj in state.templateElements (object)
      _.each(action.payload, (eachElementId) => {
        // delete key in templateElements copy object
        delete newDeleteObject[eachElementId]
      });

      fontAttributeObject = getElementFontAttributes(newDeleteObject);
      onlyFontAttributeObject = getOnlyFontAttributes(fontAttributeObject);

      return { ...state, templateElements: newDeleteObject, fontAttributeObject, onlyFontAttributeObject };
    }

    case UPDATE_DOCUMENT_ELEMENT_LOCALLY: {
      console.log('in documents reducer, UPDATE_DOCUMENT_ELEMENT_LOCALLY action.payload: ', action.payload);
      // Get mapped array of action payload;
      // before: [{element}, {element}], after: { id: {element}, id: {element}}
      const actionPayloadMapped = _.mapKeys(action.payload, 'id')
      // get shallow copy of template elements
      const newUpdateObject = _.merge({}, state.templateElements);
      // Iterate through each of the elements in action payload
      _.each(Object.keys(actionPayloadMapped), eachElementId => {
        // Get the element in app state with the sent id
        const obj = state.templateElements[eachElementId];
        const newObj = {};
        // Iterate through each key in the element to be updated in app state
        _.each(Object.keys(obj), eachKey => {
          // if the key (eg width, height) is in element sent in action.payload
          if (eachKey in actionPayloadMapped[eachElementId]) {
            // update that key with the new value
            newObj[eachKey] = actionPayloadMapped[eachElementId][eachKey];
          } else {
            // else keep the same value to the key in element in app state
            newObj[eachKey] = obj[eachKey];
          }
        });
        // assign the new object to shallow copy of state.templateElements
        // Needs to be new object so redux will find a new updated state.
        // ie cannot be ...state.templateElements
        newUpdateObject[eachElementId] = newObj;
      }); // end of each Object.keys actionPayloadMapped

      fontAttributeObject = getElementFontAttributes(newUpdateObject)
      onlyFontAttributeObject = getOnlyFontAttributes(fontAttributeObject);

      return { ...state, templateElements: newUpdateObject, fontAttributeObject, onlyFontAttributeObject };
    }

    case SET_CREATE_DOCUMENT_KEY:
      // console.log('in documents reducer, state: ', state);
      return { ...state, createDocumentKey: action.payload };

    case SET_INITIAL_VALUES_OBJECT:
    // console.log('in documents reducer, action.payload: ', action.payload);
      return {
        ...state,
        initialValuesObject: action.payload.initialValuesObject,
        overlappedkeysMapped: action.payload.overlappedkeysMapped,
        allFields: action.payload.allFields,
        agreementMappedById: action.payload.agreementMappedById,
        agreementMappedByName: action.payload.agreementMappedByName,
        mainInsertFieldsObject: action.payload.mainInsertFieldsObject,
      };

    case EDIT_HISTORY:
    console.log('in reducer, case EDIT_HISTORY_ARRAY, action.payload: ', action.payload);
      let array = [...state.editHistoryArray];
      const object = { ...state.dirtyFields };
      if (action.payload.action == 'add') {
        array = [...state.editHistoryArray, action.payload.newEditHistoryItem];
      } else if (action.payload.action == 'clear') {
        array = [];
        // array = [];
      } else if (action.payload.action == 'flipDirtyField') {
        object[action.payload.name] = action.payload.dirty;
      }
      // else if (action.payload.action == 'dirtyFieldExists') {
      //   const count = action.payload.dirtyCount;
      // }
      return { ...state, editHistoryArray: array, dirtyObject: object };

    case EDIT_AGREEMENT_FIELDS:
    // console.log('in documents reducer, state: ', state);
    return { ...state, editHistoryArray: [] };

    case FETCH_DOCUMENT_TRANSLATION:
    // console.log('in documents reducer, fetch document translation action.payload: ', action.payload);
    return { ...state, documentTranslations: JSON.parse(action.payload) };

    default:
      return state;
  }
}
