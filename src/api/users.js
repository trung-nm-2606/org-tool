const express = require('express');
const Response = require('../shared/Response');
const userRepo = require('../../repo/users');
const session = require('../shared/session');

const update = async (req, res) => {
  const { userPk } = req.params;
  const { name, fullName } = req.body;

  try {
    const success = await userRepo.updateUser(userPk, { name, fullName });
    if (success) {
      const resp = new Response();
      resp.setPayload({ name, fullName });
      res.json(resp);
    } else {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage(`[UpdateUser]: Cannot update user`);
      res.json(resp);
    }
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[UpdateUser]: Internal Server Error');
    res.status(500).json(resp);
  }
};

const api = express.Router();
api.post('/:userPk/update', session.authenticateUser, update);

module.exports = api;
