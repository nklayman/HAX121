const express = require('express');
// const Sequelize = require('sequelize');

const db = require('../models/index');

const router = express.Router();

router.get('/', (req, res) => {
  db.Student.findAll({
    where: req.postgres.where,
    attributes: req.postgres.attributes ? req.postgres.attributes : db.Student.getAttributes(),
    include: req.postgres.include ? req.postgres.include : [],
  })
    .then((resObjs) => {
      if (resObjs.length > 0) {
        res.send(resObjs);
      } else res.send({});
    })
    .catch(err => res.status(400).send(err));
});

router.get('/:id', (req, res) => {
  db.Student.findOne({
    where: { id: req.params.id },
    attributes: req.postgres.attributes ? req.postgres.attributes : db.Student.getAttributes(),
    include: req.postgres.include ? req.postgres.include : [],
  })
    .then((resObj) => {
      if (resObj) {
        const r = resObj.get({ plain: true });
        res.send(r);
      } else res.send({});
    })
    .catch(err => res.status(400).send(err));
});

router.post('/', (req, res) => {
  db.Student.create(req.body)
    .then((resObj) => {
      if (resObj) {
        const r = resObj.get({ plain: true });
        res.send(r);
      } else res.send({});
    })
    .catch(err => res.status(400).send(err));
});

// router.patch('/:id', (req, res) => {});

// router.delete('/:id', (req, res) => {});

module.exports = router;
