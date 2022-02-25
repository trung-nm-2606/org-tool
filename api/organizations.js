const express = require('express');
const session = require('../shared/session');
const Response = require('../shared/Response');
const organizationRepo = require('../repo/organizations');

const organizationValidator = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[NewGroup.Validation]: Group name is missing');
    res.status(400).json(resp);
    return;
  }
  next();
};

const postNew = async (req, res) => {
  try {
    const { name, desc } = req.body;
    const authenticateUser = session.getAuthenticatedUser(req);
    const success = await organizationRepo.createOrganization(name, desc, authenticateUser);
    if (success) {
      const resp = new Response();
      resp.setPayload({ name, desc });
      res.json(resp);
    } else {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage(`[NewGroup]: Cannot create new group`);
      res.json(resp);
    }
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[NewGroup]: Internal Server Error');
    res.status(500).json(resp);
  }
};

const getOrganizations = async (req, res) => {
  try {
    const authenticateUser = session.getAuthenticatedUser(req);
    const organizations = await organizationRepo.findOrganizationsByUserPk(authenticateUser.pk);
    const resp = new Response();
    resp.setPayload(organizations);
    res.json(resp);
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[GetGroups]: Internal Server Error');
    res.status(500).json(resp);
  }
};

const api = express.Router();
api.post('/new', session.authenticateUser, organizationValidator, postNew);
api.get('/all', session.authenticateUser, getOrganizations);

module.exports = api;
