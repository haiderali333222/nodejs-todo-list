import _ from 'lodash';
import listSchemaKeysAndTypes from 'utils/schema';

export const isNonEmptyArray = (arr) => _.isArray(arr) && arr.length;

export async function parseResponse(promise) {
  return promise.then((result) => ({ result })).catch((error) => ({ error }));
}

export function removeEmptyProps(obj) {
  return _.pickBy(obj, (value) => {
    if (_.isArray(value)) return !_.isEmpty(value);
    if (!_.isPlainObject(value)) return !_.isNil(value);

    const cleaned = removeEmptyProps(value);
    return !_.isEmpty(cleaned);
  });
}

export function cleanText(txt = '') {
  return txt.replace(/[\s\n]+/g, ' ').trim();
}
export function dbCollection(db, collectionName) {
  return db.collectionName(collectionName);
}
export function addTimestamps(obj) {
  const date = new Date();
  return { ...obj, createdAt: date, updatedAt: date };
}
export function addUpdateTimestamps(obj) {
  const date = new Date();
  if (obj.createdAt) delete obj.createdAt;
  return { ...obj, updatedAt: date };
}

export function formatFields(obj, schema) {
  const keysAndTypes = listSchemaKeysAndTypes(schema); // Get the schema keys and their types
  const formattedObj = {};

  // Iterate over the keys in the input object (obj)
  Object.keys(obj).forEach((key) => {
    const fieldType = keysAndTypes[key]; // Get the type from the schema for this field
    let value = obj[key];

    // Format the value based on its type from the schema
    if (fieldType) {
      switch (fieldType) {
        case 'string':
          // Ensure the value is a string (trim whitespace)
          formattedObj[key] = value ? String(value).trim() : '';
          break;

        case 'number':
          // Convert the value to a number, default to 0 if invalid
          formattedObj[key] = value ? Number(value) : 0;
          break;

        case 'date':
          // Convert the value to a Date object (if valid), else null
          formattedObj[key] = value ? new Date(value) : null;
          break;

        case 'boolean':
          // Convert the value to a boolean (check 'true' string or true)
          formattedObj[key] = value === 'true' || value === true;
          break;

        default:
          // Default case: just use the value as is (no formatting)
          formattedObj[key] = value;
      }
    } else {
      // If no schema type is found for this key, keep the value as is
      formattedObj[key] = value;
    }
  });

  return formattedObj;
}
