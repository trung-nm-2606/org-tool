const express = require('express');
const session = require('../../shared/session');
const Response = require('../../shared/Response');
const organizationRepo = require('../../repo/organizations');

const organizationValidator = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage(`[${req.method === 'PUT' ? 'UpdateGroup' : 'NewGroup'}.Validation]: Group name is missing`);
    res.status(400).json(resp);
    return;
  }
  const { organizationPk } = req.params;
  if (req.method === 'PUT' && (!organizationPk || +organizationPk <= 0)) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[UpdateGroup.Validation]: Group Not found');
    res.status(404).json(resp);
    return;
  }
  next();
};

const organizationOwnerValidator = async (req, res, next) => {
  const { organizationPk } = req.params;
  const organization = await organizationRepo.findOrganizationByPk(organizationPk);
  if (!organization) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[DeleteGroup.Validation]: Group Not found');
    res.status(404).json(resp);
    return;
  }

  const authenticatedUser = session.getAuthenticatedUser(req);
  if (organization.created_by !== authenticatedUser.pk) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[DeleteGroup.Validation]: Cannot delete group you did not create');
    res.status(403).json(resp);
    return;
  }

  next();
};

const postNewGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const authenticatedUser = session.getAuthenticatedUser(req);
    const success = await organizationRepo.createOrganization(name, description, authenticatedUser);
    if (success) {
      const resp = new Response();
      resp.setPayload({ name, description });
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
    const authenticatedUser = session.getAuthenticatedUser(req);
    const organizations = await organizationRepo.findOrganizationsByUserPk(authenticatedUser.pk);
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

const putUpdateGroup = async (req, res) => {
  try {
    const { organizationPk } = req.params;
    const { name, description } = req.body;
    const authenticatedUser = session.getAuthenticatedUser(req);
    const success = await organizationRepo.updateOrganization(organizationPk, authenticatedUser.pk, { name, description });
    if (success) {
      const resp = new Response();
      resp.setPayload({ pk: organizationPk, name, description });
      res.json(resp);
    } else {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage(`[UpdateGroup]: Cannot update group`);
      res.json(resp);
    }
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[UpdateGroup]: Internal Server Error');
    res.status(500).json(resp);
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { organizationPk } = req.params;
    const success = await organizationRepo.deleteOrganization(organizationPk);
    if (success) {
      const resp = new Response();
      resp.setPayload({ pk: organizationPk });
      res.json(resp);
    } else {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage(`[DeleteGroup]: Cannot delete group`);
      res.json(resp);
    }
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[DeleteGroup]: Internal Server Error');
    res.status(500).json(resp);
  }
};

const api = express.Router();
api.post('/new', session.authenticateUser, organizationValidator, postNewGroup);
api.put('/:organizationPk/update', session.authenticateUser, organizationValidator, putUpdateGroup);
api.delete('/:organizationPk/delete', session.authenticateUser, organizationOwnerValidator, deleteGroup);
api.get('/all', session.authenticateUser, getOrganizations);

module.exports = api;
