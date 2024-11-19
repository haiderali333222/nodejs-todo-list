
export default function listSchemaKeysAndTypes(schema) {
  const description = schema.describe();
  const keysAndTypes = {};

  // Recursively parse the schema description to extract keys and types
  function extractKeys(description, prefix = '') {
    for (const key in description.keys) {
      const field = description.keys[key];
      const fullPath = prefix ? `${prefix}.${key}` : key;

      // Add the key and its type to the result object
      if (field.type) {
        keysAndTypes[fullPath] = field.type;
      }

      // Handle nested objects (e.g., if the field is a Joi.object())
      if (field.schema && field.schema.describe) {
        extractKeys(field.schema.describe(), fullPath);
      }
    }
  }

  extractKeys(description);

  return keysAndTypes;
}
