import MongoOperations from 'utils/MongoDb/dbOperations';

const TABLE = 'tasks';

export default async function getProjectofTaskDueToday(req, res, next) {
  try {
    const db = new MongoOperations();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Aggregation pipeline
    const pipeline = [
      {
        $match: {
          dueDate: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'projectDetails',
        },
      },
      {
        $unwind: '$projectDetails',
      },
      {
        $project: {
          projectName: '$projectDetails.name',
          startDate: '$projectDetails.startDate',
          dueDate: '$projectDetails.dueDate',
        },
      },
    ];

    // Execute the aggregation pipeline
    const results = await db.aggregate(TABLE, pipeline);

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: parseError(err),
    });
  }
}

export async function getTasksOfProjectDueToday(req, res, next) {
  try {
    const db = new MongoOperations();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'projectDetails',
        },
      },
      {
        $unwind: '$projectDetails',
      },
      {
        $match: {
          'projectDetails.dueDate': { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $project: {
          taskName: '$name',
          status: 1,
          dueDate: 1,
          projectName: '$projectDetails.name',
          projectDueDate: '$projectDetails.dueDate',
        },
      },
    ];

    // Execute the aggregation pipeline
    const results = await db.aggregate(TABLE, pipeline);

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: parseError(err),
    });
  }
}
