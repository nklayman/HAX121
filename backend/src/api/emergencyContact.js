const express = require('express');
// const Sequelize = require('sequelize');

const db = require('../models/index');

const router = express.Router();

router.get('/', (req, res) => {
  db.EmergencyContact.findAll({
    where: req.postgres.where,
    attributes: req.postgres.attributes
      ? req.postgres.attributes
      : db.EmergencyContact.getAttributes(),
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
  db.EmergencyContact.findOne({
    where: { id: req.params.id },
    attributes: req.postgres.attributes
      ? req.postgres.attributes
      : db.EmergencyContact.getAttributes(),
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
  db.EmergencyContact.create(req.body)
    .then((resObj) => {
      if (resObj) {
        const r = resObj.get({ plain: true });
        res.send(r);
      } else res.send({});
    })
    .catch(err => res.status(400).send(err));
});

router.patch('/:id', (req, res) => {
  db.EmergencyContact.findOne({
    where: { id: req.params.id },
  })
    .then((resObj) => {
      if (resObj) {
        resObj
          .update(req.body)
          .then(() => res.send({ message: 'Success' }))
          .catch(err => res.status(400).send(err));
      } else res.send({});
    })
    .catch(err => res.status(400).send(err));
});

// router.delete('/:id', (req, res) => {});

module.exports = router;
