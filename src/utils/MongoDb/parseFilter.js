import _ from 'lodash';
import listSchemaKeysAndTypes from 'utils/schema';

export default function parseFilters(obj, schema) {
  const finalQuery = { query: {}, options: {} };

  // Assuming 'keysAndTypes' is already defined elsewhere, which contains field names and their types
  const keysAndTypes = listSchemaKeysAndTypes(schema);

  // Check if the 'filter' object exists
  if (_.get(obj, 'filter')) {
    const filters = obj.filter;

    // Iterate through the filter object
    for (const key in filters) {
      const filterValue = filters[key];
      const fieldType = keysAndTypes[key]; // Get the field type from the schema

      // String field filter (e.g., 'name')
      if (fieldType === 'string') {
        finalQuery.query[key] = { $regex: filterValue, $options: 'i' }; // Case-insensitive search using regex
      }
      // Date field filter
      else if (fieldType === 'date') {
        const dateFilter = new Date(filterValue);
        if (!isNaN(dateFilter)) {
          finalQuery.query[key] = dateFilter; // Exact match for date
        } else {
          // Handle date range if 'start' and 'end' are provided
          if (filterValue.start && filterValue.end) {
            finalQuery.query[key] = {
              $gte: new Date(filterValue.start),
              $lte: new Date(filterValue.end),
            };
          }
        }
      }
      // Number field filter (exact match)
      else if (fieldType === 'number') {
        finalQuery.query[key] = { $eq: filterValue }; // Exact match for numbers
      }
      // Boolean field filter (exact match)
      else if (fieldType === 'boolean') {
        finalQuery.query[key] = filterValue === 'true'; // assuming 'true' or 'false' strings
      }
      // Handle other types if necessary (e.g., arrays, objects)
      else {
        finalQuery.query[key] = filterValue; // Default for any other field types
      }
    }
  }

  // Check if the 'sort' object exists
  if (_.get(obj, 'sort')) {
    const sortKey = _.get(obj, 'sort');
    const sortOrder = _.get(obj, 'order', 1); // Default to ascending if 'order' is not provided (1 = asc, -1 = desc)

    if (sortKey) {
      finalQuery.options.sort = { [sortKey]: sortOrder };
    }
  }

  console.log(finalQuery);

  return finalQuery;
}
