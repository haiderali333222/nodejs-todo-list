import _ from 'lodash';
import { ObjectId } from 'mongodb';

import projectSchema from 'schema/project';
import {
  addTimestamps,
  addUpdateTimestamps,
  formatFields,
} from 'utils/helpers';
import MongoOperations from 'utils/MongoDb/dbOperations';
import documentExists from 'utils/MongoDb/documentExists';
import parseFilters from 'utils/MongoDb/parseFilter';
import parseError from 'utils/parseError';

const TABLE = 'projects';

async function createProject(req, res, next) {
  try {
    const db = new MongoOperations();
    const bodyData = _.get(req, 'body');
    const projectData = addTimestamps(bodyData);
    const cleanedData = formatFields(projectData, projectSchema);
    const { startDate, dueDate } = cleanedData;
    if (startDate && dueDate) {
      if (startDate > dueDate)
        return res
          .status(500)
          .json({
            success: false,
            message: 'start date should be smaller than due date',
            data: [],
          });
    }
    await projectSchema.validateAsync(cleanedData);
    const results = await db.insertOne(TABLE, cleanedData);

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: parseError(err),
    });
  }
}
async function getProject(req, res, next) {
  try {
    const db = new MongoOperations();
    const { id } = _.get(req, 'query');
    if (!id)
      return res.status(422).json({
        success: 'false',
        message: 'params are missing id required',
      });
    const query = { _id: id };

    const results = await db.getOne(TABLE);

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: 'INTERNAL SERVER ERROR',
    });
  }
}

async function getAllProject(req, res, next) {
  try {
    const db = new MongoOperations();
    const { query, options } = parseFilters(_.get(req, 'body'), projectSchema);

    const results = await db.getMany(TABLE, query, options);

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: 'INTERNAL SERVER ERROR',
    });
  }
}
async function updateProject(req, res, next) {
  try {
    const db = new MongoOperations();
    const bodyData = _.get(req, 'body.data');
    const query = { _id: new ObjectId(_.get(req, 'body.query.id')) };

    if (!query._id || !_.get(_.keys(bodyData), 'length'))
      return res.status(422).json({
        success: 'false',
        message: 'params are missing query.id and fields in data required',
      });

    const exists = await documentExists(TABLE, query);
    if (!exists)
      return res.status(500).json({
        success: 'false',
        message: 'document with this id does not exists',
      });
    const projectData = addUpdateTimestamps(bodyData);
    const cleanedData = formatFields(projectData, projectSchema);
    const { startDate, dueDate } = cleanedData;
    if (startDate && dueDate) {
      if (startDate > dueDate)
        return res
          .status(500)
          .json({
            success: false,
            message: 'start date should be smaller than due date',
            data: [],
          });
    }
    await projectSchema.validateAsync(cleanedData);

    const results = await db.updateOne(TABLE, query, cleanedData);

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: parseError(err),
    });
  }
}
async function deleteProject(req, res, next) {
  try {
    const db = new MongoOperations();
    const query = { _id: new ObjectId(_.get(req, 'body.query.id')) };

    if (!query._id)
      return res.status(422).json({
        success: 'false',
        message: 'params are missing query.id  required',
      });

    const exists = await documentExists(TABLE, query);
    if (!exists)
      return res.status(500).json({
        success: 'false',
        message: 'document with this id does not exists',
      });

    const results = await db.deleteOne(TABLE, query);

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: parseError(err),
    });
  }
}

export {
  createProject,
  getAllProject,
  getProject,
  updateProject,
  deleteProject,
};
