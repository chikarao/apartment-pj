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
  FETCH_BOOKING,
  SET_DOCUMENT_LANGUAGE_CODE
  // SELECTED_ICALENDAR_ID
} from '../actions/types';

import getListValues from '../components/forms/get_list_values'

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
  templateElements: {},
  listInitialValuesObject: {}
}, action) {
  // console.log('in documents reducer, action.payload, state: ', action.payload, state);

  // NOTE: getMappedObjectWithStringIds creates template elements object mapped with id { id: templateElement }
  // and a page object { page: { templateElement } } readable by renderTemplateElements in create_edit_document.js
  function getMappedObjectWithStringIds(elementsArray, templateEditHistory, actionCreate) {
    // console.log('in documents reducer, getMappedObjectWithStringIds, for POPULATE_TEMPLATE_ELEMENTS, elementsArray, templateEditHistory, actionCreate: ', elementsArray, templateEditHistory, actionCreate);
    // time complexity about same as calling _.mapKeys but with extra functionality
    const object = {};
    let modifiedElement = {};
    const pageObject = {};

    // IMPORTANT: updateElements Updates elements persisted in backend but edited
    // in frontend without saving (ie page accidentally refreshed)
    function updateElements(element) {
      let modifiedElem = {};
      let returnString = '';
       // each with i history array, iterate through each history array of arrays of objects
       // (created in setTemplateHistoryArray fucntion in create_edit_document.js);
       // Lookes like [[ { id: 1, width: 10, o_width: 9, action: 'update' }], [ {}, {}...]]
      _.each(templateEditHistory.templateEditHistoryArray, (eachEditArray, i) => {
        // Do until this.state.historyIndex is greater than or equal to i;
        // So if user has undone or redone, stop there
        if (i <= templateEditHistory.historyIndex) {
          // Iterate through each array of objects; object looks like  { id: 1, width: 10, o_width: 9, action: 'update' }
          _.each(eachEditArray, eachEditObject => {
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
      console.log('in documents reducer, getMappedObjectWithStringIds, for POPULATE_TEMPLATE_ELEMENTS, updateElements element, returnString, templateEditHistory: ', element, returnString, templateEditHistory);
      return returnString || 'ok';
    }
    // Iterate through each element persisted as agreement.document_fields
    _.each(elementsArray, eachElement => {
      // Assign to modified
      modifiedElement = eachElement;
      // Id to string so later code works with temporary ids (eg '1a')
      modifiedElement.id = eachElement.id.toString();

      console.log('in documents reducer, getMappedObjectWithStringIds, for POPULATE_TEMPLATE_ELEMENTS, in each elementArray modifiedElement: ', modifiedElement);

      object[modifiedElement.id.toString()] = modifiedElement;
      // Assign create so redo and undo of create works in undoRedoAction
      if (actionCreate) modifiedElement.action = 'create';
      // If there is history for this agreement template elements, update elements along with map keys
      if (templateEditHistory) {
        // update elements returns null, delete or ok; if ok,
        // put modifeid object in in mapped object
        if (updateElements(modifiedElement) === 'ok') {
          console.log('in documents reducer, getMappedObjectWithStringIds, for POPULATE_TEMPLATE_ELEMENTS, in each elementArray if templateEditHistory updateElements ok modifiedElement: ', modifiedElement);
          object[modifiedElement.id.toString()] = modifiedElement;
          // put into pageObject
          if (pageObject[modifiedElement.page]) {
            // if (!pageObject[modifiedElement.page][modifiedElement.id]) {
            pageObject[modifiedElement.page][modifiedElement.id] = modifiedElement;
            // }
          } else {
            pageObject[modifiedElement.page] = {};
            pageObject[modifiedElement.page][modifiedElement.id] = modifiedElement;
          }
        }
      } else { // else for if templateEditHistory
        // if no templateEditHistory, just put into the mapped object
        // if returned
        console.log('in documents reducer, getMappedObjectWithStringIds, for POPULATE_TEMPLATE_ELEMENTS, in if (modifiedElement.document_field_choices modifiedElement: ', modifiedElement);

        if (pageObject[modifiedElement.page]) {
          // if (!pageObject[modifiedElement.page][modifiedElement.id]) {
            pageObject[modifiedElement.page][modifiedElement.id] = modifiedElement;
            // }
          } else {
            pageObject[modifiedElement.page] = {};
            pageObject[modifiedElement.page][modifiedElement.id] = modifiedElement;
          }
      } // end of else if templateEditHistory
    }); // end of each

    return { object, pageObject };
  }

  function addToTemplateElementsByPage(newElement) {
    const newObject = { ...state.templateElementsByPage };
    if (newObject[newElement.page]) {
      newObject[newElement.page][newElement.id] = newElement;
    } else {
      newObject[newElement.page] = {};
      newObject[newElement.page][newElement.id] = newElement;
    }
    return newObject;
  }

  function getDocumentChoicesObject(mappedElements, choicesAction) {
    // mappedElements looks like { 1: { id: 1, width: 10, ...}}
    let returnObject = {};
    if (choicesAction === 'create') {
      // if action is to create, existing object from state
      returnObject = { ...state.templateDocumentChoicesObject };
    }

    let object = {};
    let page = null;
    let name = null;
    let element = null;
    let count = 0;
    _.each(Object.keys(mappedElements), eachIdKey => {
      element = mappedElements[eachIdKey];
      page = element.page;
      // console.log('in documents reducer, getDocumentChoicesObject, element: ', element);

      object = {
        name: element.name,
        component: element.component,
        borderColor: element.border_color,
        // top: element.top,
        // left: element.left,
        // width: element.width,
        // height: element.height,
        choices: {
          0: {
            params: {
              val: element.input_type === 'string' || element.input_type === 'text' ? 'inputFieldValue' : '',
              top: element.top,
              left: element.left,
              width: element.width,
              height: element.height,
              font_size: element.font_size,
              font_family: element.font_family,
              font_style: element.font_style,
              font_weight: element.font_weight,
              // change from input componnet use document-rectange
              // class_name: 'document-rectangle',
              class_name: element.class_name,
              input_type: element.input_type,
              element_id: element.id
            } // end of params
          } // end of one choice
        }, // end of choices
        required: false
      }; // end of object

      if (element.document_field_choices) {
        const { document_field_choices } = element;
        const choices = {};
        // const choiceObject = {};
        // console.log('in documents reducer, getDocumentChoicesObject, element, document_field_choices: ', element, document_field_choices);
        _.each(Object.keys(document_field_choices), eachKey => {
          // console.log('in documents reducer, getDocumentChoicesObject, element, document_field_choices, eachKey: ', element, document_field_choices, eachKey);
          choices[eachKey] = {};
          if (element.input_type === 'boolean') {
            choices[eachKey].valName = document_field_choices[eachKey].val ? 'Y' : 'N'
          }

          choices[eachKey].params = {
              val: element.input_type === 'string' || element.input_type === 'text' ? 'inputFieldValue' : document_field_choices[eachKey].val,
              // top: document_field_choices[eachKey].top,
              // left: document_field_choices[eachKey].left,
              // width: document_field_choices[eachKey].width,
              // height: document_field_choices[eachKey].height,
              font_size: document_field_choices[eachKey].font_size,
              font_family: document_field_choices[eachKey].font_family,
              font_style: document_field_choices[eachKey].font_style,
              font_weight: document_field_choices[eachKey].font_weight,
              // change from input componnet use document-rectange
              // class_name: 'document-rectangle',
              class_name: document_field_choices[eachKey].class_name,
              // !!! height works only with px
              input_type: document_field_choices[eachKey].input_type,
              element_id: element.id
            }; // end of params

          // choices[eachKey] = choices;
        }); // end of each
        object.choices = choices;
      }
      // Enable multiple names on same page
      if (returnObject[page]) {
        // To enable multiple elements with the same name (assigned in this.props.initialValues)
        // if element.name is already on the page, increment count and
        // and change name like so { name: {}, name-1: {}, name-2: {}}
        // Use dash in stead of underscore so that names with underscore don't get cauth
        //(ie flat_id)
        console.log('in documents reducer, getDocumentChoicesObject, element.name: ', element.name);
        if (returnObject[page][element.name]) {
          count = 1;
          let splitEach = null;
          _.each(Object.keys(returnObject[page]), each => {
            splitEach = each.split('-');
            console.log('in documents reducer, getDocumentChoicesObject, returnObject[page], each, splitEach: ', returnObject[page], each, splitEach);
            if (splitEach[0] === element.name && splitEach.length > 1) {
              if (splitEach[1] >= count) count = parseInt(splitEach[1]) + 1;
            }
          }); // end of each
          // count++;
          name = `${element.name}-${count}`;
        } else {
          name = element.name;
        }

        returnObject[page][name] = object;
      } else { // else of if returnObject[page]
        console.log('in documents reducer, getDocumentChoicesObject, element.name: ', element.name);
        returnObject[page] = {};

        count = 0;
        name = element.name;
        returnObject[page][name] = object;
      }
      object.elementName = name;
    }); // end of each

    console.log('in documents reducer, getDocumentChoicesObject, returnObject: ', returnObject);
    return returnObject;
  } // end of function

  switch (action.type) {
    // Populate template elememts to get document_fields from agreement and combine with
    // local template elements retrieved from localStorage
    case SET_DOCUMENT_LANGUAGE_CODE: {
      return { ...state,
        documentLanguageCode: action.payload
      };
    }
    case FETCH_BOOKING: {
      return { ...state,
        fixedTermRentalContractBilingualAll: JSON.parse(action.payload.fixed_term_rental_contract_bilingual_all),
        importantPointsExplanationBilingualAll: JSON.parse(action.payload.important_points_explanation_bilingual_all),
        templateMappingObjects: {
          fixed_term_rental_contract_bilingual: JSON.parse(action.payload.template_mapping_object_fixed),
          important_points_explanation_bilingual: JSON.parse(action.payload.template_mapping_object_important_points)
        },
        flat: action.payload.flat,
        agreements: action.payload.agreements
      };
    }

    case POPULATE_TEMPLATE_ELEMENTS_LOCALLY: {
      console.log('in documents reducer, state, POPULATE_TEMPLATE_ELEMENTS, action.payload, state.templateElements, state.templateMappingObjects: ', action.payload, state.templateElements, state.templateMappingObjects);
      const newObject = {};

      // const listValues = getListValues({ listElement: action.payload, flat: state.flat, templateMappingObjects: state.templateMappingObjects })

      // Rather than calling _.mapKeys, do the same thing
      // and turn ids into strings and assign action: create
      const mergedObject = _.merge(newObject, state.templateElements, action.payload.array);
      // gets object with string ids and a pageObject { 1: { id: element }}
      const mapKeysObject = getMappedObjectWithStringIds(mergedObject, action.payload.templateEditHistory, true);
      // const initialValuesObject = { ...state.initialValuesObject };
      // Keep object with original values for elements persisted in backend to check for changes
      // const originalPersistedTemplateElements = mapKeysObject;
      // // REFERENCE: https://stackoverflow.com/questions/19965844/lodash-difference-between-extend-assign-and-merge
      // // Use lodash merge to get elements in mapped object { 1: {}, 2: {} }
      // const mergedObject = _.merge(newObject, state.templateElements, mapKeysObject.object);

      // const templateDocumentChoicesObject = getDocumentChoicesObject(mergedObject, null);
      console.log('in documents reducer, state, POPULATE_TEMPLATE_ELEMENTS, mergedObject, mapKeysObject: ', mergedObject, mapKeysObject);

      return { ...state,
        templateElements: mapKeysObject.object,
        templateElementsByPage: mapKeysObject.pageObject,
        // initialValuesObject
      };
    }

    case SAVE_TEMPLATE_DOCUMENT_FIELDS: {
      console.log('in documents reducer, state, SAVE_TEMPLATE_DOCUMENT_FIELDS, action.payload: ', action.payload);
      // Rather than calling _.mapKeys, do the same thing while
      // creating page object in one iteration to templateElements
      // and turn ids into strings and assign action: create
      const mapKeysObject = getMappedObjectWithStringIds(action.payload.document_fields, true);
      console.log('in documents reducer, state, SAVE_TEMPLATE_DOCUMENT_FIELDS, mapKeysObject: ', mapKeysObject);

      return { ...state, templateElements: mapKeysObject.object, templateElementsByPage: mapKeysObject.pageObject };
    }

    case CREATE_DOCUMENT_ELEMENT_LOCALLY: {
      console.log('in documents reducer, state, CREATE_DOCUMENT_ELEMENT_LOCALLY, action.payload, state.templateElements, state.templateMappingObjects: ', action.payload, state.templateElements, state.templateMappingObjects);
      const newObject = {}
      // REFERENCE: https://stackoverflow.com/questions/19965844/lodash-difference-between-extend-assign-and-merge
      // Use lodash merge to get elements in mapped object { 1: {}, 2: {} }
      const createdObject = { [action.payload.id]: action.payload };
      let initialValuesObject = { ...state.initialValuesObject };
      let listValues = '';
      if (action.payload.list_parameters) {
        listValues = getListValues({ listElement: action.payload, flat: state.flat, templateMappingObjects: state.templateMappingObjects, agreements: state.agreements, documentLanguageCode: state.documentLanguageCode });
        console.log('in documents reducer, state, CREATE_DOCUMENT_ELEMENT_LOCALLY, action.payload, listValues, initialValuesObject, state first: ', action.payload, listValues, initialValuesObject, state);
        initialValuesObject = { [action.payload.name]: listValues }
      }
      console.log('in documents reducer, state, CREATE_DOCUMENT_ELEMENT_LOCALLY, action.payload, listValues, initialValuesObject, state: ', action.payload, listValues, initialValuesObject, state);
      const templateElementsByPage = addToTemplateElementsByPage(action.payload);
      const mergedObject = _.merge(newObject, state.templateElements, createdObject);
      // const someOtherObject = { amenities_list: 'hello' };
      // IMPORTANT: Somehow, initialValuesObject passed to mapStateToProps becomes undefined;
      // So, created listInitialValuesObject which gets passed fine, so merge them with initialValuesObject in mapStateToProps
      return { ...state,
        templateElements: mergedObject,
        templateElementsByPage,
        // initialValuesObject,
        listInitialValuesObject: listValues ? { ...state.listInitialValuesObject, [action.payload.name]: listValues } : { ...state.listInitialValuesObject }
        // templateDocumentChoicesObject
      };
    }

    case DELETE_DOCUMENT_ELEMENT_LOCALLY: {
      console.log('in documents reducer, state, DELETE_DOCUMENT_ELEMENT_LOCALLY, action.payload: ', action.payload);
      // Get shallow copy of template elements in new object
      // Needs to be new object so redux will find a new updated state.
      const newDeleteObject = _.merge({}, state.templateElements);
      const templateElementsByPage = { ...state.templateElementsByPage };
      // iterate through each element id in action payload
      // and delete id: elementObj in state.templateElements (object)
      let element;
      _.each(action.payload, (eachElementId) => {
        // delete key in templateElements copy object
        delete newDeleteObject[eachElementId];
        element = state.templateElements[eachElementId];
        delete templateElementsByPage[element.page][eachElementId];
      });

      // const templateDocumentChoicesObject = getDocumentChoicesObject(newDeleteObject, null);
      // fontAttributeObject = getElementFontAttributes(newDeleteObject);
      // onlyFontAttributeObject = getOnlyFontAttributes(fontAttributeObject);

      return { ...state,
        templateElements: newDeleteObject,
        templateElementsByPage
        // templateDocumentChoicesObject
      };
    }

    case UPDATE_DOCUMENT_ELEMENT_LOCALLY: {
      console.log('in documents reducer, UPDATE_DOCUMENT_ELEMENT_LOCALLY action.payload: ', action.payload);
      // Get mapped array of action payload;
      // before: [{element}, {element}], after: { id: {element}, id: {element}}
      const templateElementsByPage = { ...state.templateElementsByPage };
      // let element;
      const actionPayloadMapped = _.mapKeys(action.payload, 'id');
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

        // if (actionPayloadMapped[eachElementId].document_field_choices) {
        //   const newChoiceObject = {};
        //   // let newO = {}
        //   _.each(Object.keys(actionPayloadMapped[eachElementId].document_field_choices), eachIndex => {
        //     // newChoiceObject[eachIndex] = { ...actionPayloadMapped[eachElementId].document_field_choices[eachIndex] };
        //     newChoiceObject[eachIndex] = {};
        //     _.each(Object.keys(actionPayloadMapped[eachElementId].document_field_choices[eachIndex]), key => {
        //       console.log('in documents reducer, UPDATE_DOCUMENT_ELEMENT_LOCALLY actionPayloadMapped[eachElementId], eachIndex, key: ', actionPayloadMapped[eachElementId], eachIndex, key);
        //       newChoiceObject[eachIndex][key] = actionPayloadMapped[eachElementId].document_field_choices[eachIndex][key];
        //     })
        //   });
        //   newObj.document_field_choices = newChoiceObject;
        // }
        // assign the new object to shallow copy of state.templateElements
        // Needs to be new object so redux will find a new updated state.
        // ie cannot be ...state.templateElements
        newUpdateObject[eachElementId] = newObj;
        templateElementsByPage[newObj.page][newObj.id] = newObj;
      }); // end of each Object.keys actionPayloadMapped

      console.log('in documents reducer, UPDATE_DOCUMENT_ELEMENT_LOCALLY action.payload, newUpdateObject: ', action.payload, newUpdateObject);
      // fontAttributeObject = getElementFontAttributes(newUpdateObject)
      // onlyFontAttributeObject = getOnlyFontAttributes(fontAttributeObject);
      // const templateDocumentChoicesObject = getDocumentChoicesObject(newUpdateObject, null);

      return { ...state,
        templateElements: newUpdateObject,
        templateElementsByPage,
        // templateDocumentChoicesObject
      };
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
