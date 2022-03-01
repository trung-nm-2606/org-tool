const express = require('express');
const session = require('../shared/session');
const Response = require('../shared/Response');
const organizationRepo = require('../repo/organizations');

const getMembers = async (req, res) => {
  try {
    const { organizationPk } = req.params;
    const members = await organizationRepo.findMembersByOrganizationPk(organizationPk);
    const resp = new Response();
    resp.setPayload(members);
    res.json(resp);
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[GetMembers]: Internal Server Error');
    res.status(500).json(resp);
  }
};

const api = express.Router();
api.get('/:organizationPk/all', session.authenticateUser, getMembers);

module.exports = api;
