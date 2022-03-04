const BadRequestError = require("../../model/error/BadRequestError");

const Validator = {};

Validator.validateNewOrganizationForm = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    next(new BadRequestError('Email or password is missing'));
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

Validator.validateUpdateOrganizationForm = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    next(new BadRequestError('Email or password is missing'));
    return;
  }

  const { organizationPk } = req.params;
  if (req.method === 'PUT' && (!organizationPk || +organizationPk <= 0)) {
    next(new BadRequestError('Target group is missing'));
    return;
  }

  next();
};

module.exports = Validator;
