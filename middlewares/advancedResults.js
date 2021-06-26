import { Category } from '../models';

const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  if (req.query.search) {
    const search = req.query.search
      ? {
          $or: [
            {
              title: {
                $regex: req.query.search,
                $options: 'i',
              },
            },
            {
              description: {
                $regex: req.query.search,
                $options: 'i',
              },
            },
          ],
        }
      : {};
    queryStr = JSON.parse(queryStr);
    queryStr = { ...queryStr, ...search };
  } else {
    queryStr = JSON.parse(queryStr);
  }

  if (req.user) {
    queryStr = { ...queryStr, user: req.user._id };
  }

  // Finding resource
  query = model.find(queryStr);

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const total = await model.countDocuments(queryStr);

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  let categoryName = await Category.findById(queryStr.category);

  if (categoryName) {
    if (categoryName.active) {
      res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results,
        total,
        category: categoryName,
      };
    } else {
      res.advancedResults = {
        success: true,
        count: 0,
        pagination,
        data: [],
        total: 0,
        category: null,
      };
    }
  } else {
    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
      total,
      category: categoryName,
    };
  }

  next();
};

export { advancedResults };
