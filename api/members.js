const express = require('express');
const memberController = require('../controller/members');

const api = express.Router();

api.get('/:organizationPk/all', ...memberController.getMembers);
api.post('/:organizationPk/invite', ...memberController.postInviteMember);
api.delete('/:organizationPk/:memberPk/remove', ...memberController.removeMember);
api.post('/:organizationPk/invitation-token', ...memberController.postInvitationToken);

module.exports = api;
