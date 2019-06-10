const bodyParserLib = require('body-parser');
const cors = require('cors');

const db = require('./models/index');

module.exports.bodyParserJSON = bodyParserLib.json();

module.exports.bodyParserURLEncoded = bodyParserLib.urlencoded({
  extended: false,
});

module.exports.cors = cors();

module.exports.returnType = (req, res, next) => {
  const type = req.query.format;
  if (type === 'plain' || type === 'text') {
    res.header('Content-Type', 'text/plain');
  } else if (type === 'json') {
    res.header('Content-Type', 'application/json');
  }
  next();
};

module.exports.processQuery = (req, res, next) => {
  // QUERY STRUCTURE

  req.postgres = {};

  // DISABLED - USE ELASTICSEARCH FOR QUERIES
  // // Pagination
  // if (req.query.offset !== undefined && req.query.limit !== undefined) {
  //   req.postgres.offset = parseInt(req.query.offset, 10);
  //   req.postgres.limit = req.query.limit;
  // }

  // // Sort
  // if (req.query.sort !== undefined && req.query.order !== undefined) {
  //   req.postgres.order = [];
  //   req.postgres.order.push([req.query.sort, req.query.order]);
  // }

  // // Should not be an issue
  // if (req.method === 'PATCH') {
  //   const toChange = [];
  //   Object.keys(req.body).forEach((k) => {
  //     if (k.toLowerCase() !== k) {
  //       toChange.push(k);
  //     }
  //   });
  //   for (let i = 0; i < toChange.length; i += 1) {
  //     req.body[toChange[i].toLowerCase()] = req.body[toChange[i]];
  //     delete req.body[toChange[i]];
  //   }
  // }

  // Project (Return Fields)
  let fields = []; // list of raw fields
  const attributes = []; // postgres attribute obj
  const includeWrap = { include: [] }; // postgres associations/includes obj w/wrapper
  if (req.query.fields !== undefined) {
    fields = req.query.fields.split(',');
  }

  if (fields.length !== 0) {
    // Iterate through each field specified
    for (let i = 0; i < fields.length; i += 1) {
      // Check if it is nested field
      if (fields[i].indexOf('.') !== -1) {
        // Split into components and start recursion
        const nests = fields[i].split('.');

        // eslint-disable-next-line no-loop-func
        nests.reduce((acc, cur, idx, arr) => {
          // Checks if at last el
          if (idx === arr.length - 1) {
            if (acc.attributes === undefined) {
              acc.attributes = [];
            }

            // Check if is lowercase
            if (cur.toLowerCase() !== cur) {
              acc.attributes.push([cur.toLowerCase(), cur]);
            } else if (cur === '*') {
              acc.attributes = acc.model.getAttributes();
            } else {
              acc.attributes.push(cur);
            }

            // check if query exists
            if (req.query[fields[i]]) {
              if (acc.where === undefined) acc.where = {};
              acc.where = { ...acc.where, [cur]: req.query[fields[i]] };
              delete req.query[fields[i]];
            }

            return 0;
          }

          // makes empty include arr b/c there is more than 1 lvl left
          if (acc.include === undefined) {
            acc.include = [];
          }

          // Finds object index
          const objIdx = acc.include.findIndex(el => el.as === cur);

          // Object already exists
          if (objIdx !== -1) {
            return acc.include[objIdx];
          }

          // Creates new 'includes' obj
          const newIncludeObj = { as: cur };

          // determine model based on name
          if (cur.indexOf('student') !== -1) {
            newIncludeObj.model = db.Student;
          } else if (cur.indexOf('team') !== -1) {
            newIncludeObj.model = db.Team;
          }

          acc.include.push(newIncludeObj);
          // returns next layer down of include
          return acc.include[acc.include.length - 1];
        }, includeWrap);
      } else if (fields[i].toLowerCase() !== fields[i]) {
        // If field is camelCase
        attributes.push([fields[i].toLowerCase(), fields[i]]);
      } else {
        attributes.push(fields[i]);
      }
    }

    if (includeWrap.include.length !== 0) {
      req.postgres.include = includeWrap.include;
    }
    if (attributes.length !== 0 && attributes.indexOf('*') === -1) {
      req.postgres.attributes = attributes;
    }
  }

  // Search by fields
  req.postgres.where = req.query;
  delete req.postgres.where.offset;
  delete req.postgres.where.limit;
  delete req.postgres.where.sort;
  delete req.postgres.where.order;
  delete req.postgres.where.fields;
  delete req.postgres.where.ignore_fields;
  delete req.postgres.where.format;

  next();
};
