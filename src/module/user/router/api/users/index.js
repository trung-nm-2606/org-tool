const express = require('express');
const session = require('../../../../../shared/session');
const ApiView = require('../../../../base/apiView');
const BaseController = require('../../../../base/controller');
const Controller = require('../../../controller');
const OrganizationDao = require('../../../../organization/dao');

const usersRouter = express.Router();

usersRouter.put('/self/update', [
  ApiView.api,
  session.authenticateUser,
  Controller.updateUser,
  BaseController.render
]);

usersRouter.get('/ping-auth', session.authenticateUser, async (req, res) => {
  const { pk, name } = session.getAuthenticatedUser(req)
  let organization;
  try {
    organization = await OrganizationDao.findActiveGroupByUserPk(pk);
  } catch (e) {
    console.log(e);
  }
  res.json({ pk, name, activeGroup: {
    pk: organization?.pk,
    name: organization?.name
  } }); // Specially here only
});

module.exports = usersRouter;
