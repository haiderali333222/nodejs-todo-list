import _ from 'lodash';
import { ObjectId } from 'mongodb';

import taskSchema from 'schema/task';
import {
  addTimestamps,
  addUpdateTimestamps,
  formatFields,
} from 'utils/helpers';
import MongoOperations from 'utils/MongoDb/dbOperations';
import documentExists from 'utils/MongoDb/documentExists';
import parseFilters from 'utils/MongoDb/parseFilter';
import parseError from 'utils/parseError';

const TABLE = 'tasks';

async function createTask(req, res, next) {
  try {
    const db = new MongoOperations();
    const bodyData = _.get(req, 'body');
    const taskData = addTimestamps(bodyData);
    const cleanedData = formatFields(taskData, taskSchema);

    await taskSchema.validateAsync(cleanedData);
    if (cleanedData.projectId) {
      cleanedData.projectId = new ObjectId(cleanedData.projectId);
      const projectExists = await documentExists('projects', {
        _id: cleanedData.projectId,
      });
      if (!projectExists)
        return res.status(500).json({
          success: 'false',
          message: 'project does not exists',
        });
    }
    const { startDate, dueDate } = cleanedData;
    if (startDate && dueDate) {
      if (startDate > dueDate)
        return res.status(500).json({
          success: false,
          message: 'start date should be smaller than due date',
          data: [],
        });
    }
    const results = await db.insertOne(TABLE, cleanedData);

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: parseError(err),
    });
  }
}
async function getTask(req, res, next) {
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
      error: parseError(err),
    });
  }
}

async function getAllTask(req, res, next) {
  try {
    const db = new MongoOperations();
    const { query, options } = parseFilters(_.get(req, 'body'), taskSchema);

    const results = await db.getMany(TABLE, query, options);

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: parseError(err),
    });
  }
}
async function updateTask(req, res, next) {
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
    const taskData = addUpdateTimestamps(bodyData);
    const cleanedData = formatFields(taskData, taskSchema);
    const { startDate, dueDate } = cleanedData;
    if (startDate && dueDate) {
      if (startDate > dueDate)
        return res.status(500).json({
          success: false,
          message: 'start date should be smaller than due date',
          data: [],
        });
    }
    await taskSchema.validateAsync(cleanedData);

    const results = await db.updateOne(TABLE, query, cleanedData);

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: parseError(err),
    });
  }
}
async function updateTaskStatus(req, res, next) {
  try {
    const db = new MongoOperations();
    const status = _.get(req, 'body.data.status');
    const query = { _id: new ObjectId(_.get(req, 'body.query.id')) };

    if (!query._id || !status)
      return res.status(422).json({
        success: 'false',
        message: 'params are missing query.id and status in data required',
      });

    const oldDocument = await db.getOne(TABLE, query);
    if (!_.get(oldDocument, '_id'))
      return res.status(500).json({
        success: 'false',
        message: 'document with this id does not exists',
      });
    if (status !== 'to-do' && status !== 'done')
      return res.status(422).json({
        success: 'false',
        message: 'status is required and allowed values are [to-do,done]',
      });
    if (oldDocument.status === status)
      return res
        .status(200)
        .json({ success: true, data: 'Document already upto date' });
    const updateDocument = {
      status,
      doneDate: status === 'done' ? new Date() : '',
    };
    if (status != 'done') updateDocument.startDate = new Date();

    const results = await db.updateOne(TABLE, query, updateDocument);

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: parseError(err),
    });
  }
}
async function assignProject(req, res, next) {
  try {
    const db = new MongoOperations();
    const projectId = _.get(req, 'body.data.projectId');
    const query = { _id: new ObjectId(_.get(req, 'body.query.id')) };

    if (!query._id || !projectId)
      return res.status(422).json({
        success: 'false',
        message: 'params are missing query.id and status in data required',
      });

    const oldDocument = await db.getOne(TABLE, query);
    const projectExists = await documentExists('projects', {
      _id: new ObjectId(projectId),
    });

    if (!_.get(oldDocument, '_id'))
      return res.status(500).json({
        success: 'false',
        message: 'document with this id does not exists',
      });
    if (!projectExists)
      return res.status(500).json({
        success: 'false',
        message: 'project does not exists',
      });

    const results = await db.updateOne(TABLE, query, {
      projectId: new ObjectId(projectId),
    });

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: parseError(err),
    });
  }
}
async function deleteTask(req, res, next) {
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
  createTask,
  getAllTask,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  assignProject,
};
