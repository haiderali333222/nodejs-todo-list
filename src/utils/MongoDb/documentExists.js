import MongoOperations from 'utils/MongoDb/dbOperations';

export default async function documentExists(TABLE, query) {
  try {
    const db = new MongoOperations();

    const count = await db.count(TABLE, query);
    if (count > 0) return true;
    return false;
  } catch (err) {
   throw new err
  }
}
