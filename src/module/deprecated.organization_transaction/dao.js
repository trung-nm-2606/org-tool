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

Dao.initTransaction = async ({
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

Dao.createTransaction = async ({
  organization_pk,
  changes,
  description,
  unit,
  type,
  personal
}, authenticatedUser) => {
  const query = `insert into organization_transactions(
    organization_pk, changes, value_before, description,
    ref_pk, ref_table, unit, proof_url,
    type, personal, created_by, updated_by
  ) values (?,?,?,?,?,?,?,?,?,?,?,?)`;
  let conn;

  try {
    conn = await db.getConnection();
    conn.beginTransaction();

    await conn.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');

    await conn.execute(`select * from organization_transactions
    where organization_pk = ? and type = ? order by created_at desc limit 1 for update`, [
      organization_pk,
      type
    ]);

    const [transactions] = await conn.execute(`select * from organization_transactions
    where organization_pk = ? and (type = ? or type = 'init') order by created_at desc limit 1`, [
      organization_pk,
      type
    ]);
    const transaction = transactions[0];
    if (!transaction) {
      throw `Latest transaction of group(${organization_pk}) with type(${type}) is not found`;
    }

    const { changes: latestChanges, value_before: valueBefore } = transaction;
    const newValueBefore = transaction.type === 'deposit' ? valueBefore + latestChanges : valueBefore - latestChanges;

    await conn.execute(query, [
      organization_pk, changes, newValueBefore, description,
      null, null, unit, null,
      type, personal,
      authenticatedUser.pk,
      authenticatedUser.pk
    ]);

    await conn.commit();

    return true;
  } catch (e) {
    if (conn) conn.rollback();
    throw new DaoError(`Cannot create new transaction for group(${organization_pk})`, e);
  } finally {
    if (conn) conn.release();
  }
};

Dao.getLatestTransactionByOrganizationPkAndType = async (organizationPk, type = 'deposit') => {
  const query = `select *,
  (organization_transactions.value_before + organization_transactions.changes)as current_balance
  from organization_transactions order by created_at desc limit 1`;

  try {
    const [transactions] = await db.execute(query, [organizationPk]);
    return transactions[0];
  } catch (e) {
    throw new DaoError(`Cannot get latest transaction of group(${organizationPk})`, e);
  }
};

module.exports = Dao;
