const db = require('../../shared/db');
const dateUtils = require('../../shared/date_utils');
const DaoError = require('../../model/error/DaoError');

const Dao = {};

Dao.findInitialTransactionByOrganizationPk = async (organizationPk) => {
  const query = 'select * from organization_transactions where organization_pk = ? and type = ?';

  try {
    const [organizations] = await db.execute(query, [organizationPk, 'init']);
    return organizations[0];
  } catch (e) {
    throw new DaoError(`Cannot find initial transcation of group(${organizationPk})`, e);
  }
};

Dao.createTransaction = async ({
  organization_pk,
  changes,
  value_before,
  description,
  created_by,
  updated_by
}) => {
  const query = `insert into organization_transactions(organization_pk, changes, value_before, description, created_by, updated_by)
  values(?,?,?,?,?,?)`;

  try {
    await db.execute(query, [
      organization_pk,
      changes,
      value_before,
      description,
      created_by,
      updated_by
    ]);
  } catch (e) {
    new DaoError(`Cannot create new transaction for group(${organization_pk})`, e);
  }

  return true;
};

Dao.getLatestTransactionByOrganization = async (organizationPk) => {
  const query = 'select * from organization_transactions order by created_at desc limit 1';

  try {
    const [transactions] = await db.execute(query, [organizationPk]);
    return transactions[0];
  } catch (e) {
    throw new DaoError(`Cannot get latest transaction of group(${organizationPk})`, e);
  }
};

module.exports = Dao;
