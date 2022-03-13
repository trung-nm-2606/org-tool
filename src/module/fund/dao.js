const db = require('../../shared/db');
const dateUtils = require('../../shared/date_utils');
const DaoError = require('../../model/error/DaoError');

const Dao = {};

Dao.findFundsByOrganizationPk = async (origanizationPk) => {
  try {
    const query = `select * from funds where organization_pk = ?`;
    const [funds] = await db.execute(query, [origanizationPk]);
    return funds;
  } catch (e) {
    throw new DaoError(`Cannot find funds for group(${origanizationPk})`, e);
  }
};

Dao.createFund = async (origanizationPk, fund, userPk) => {
  const { name, description, currency  } = fund;

  try {
    const query = `insert into funds(name, description, organization_pk, currency, created_by, updated_by)
    values(?,?,?,?,?,?)`;
    const [result] = await db.execute(query, [
      name, description, origanizationPk, currency, userPk, userPk
    ])
    return result.insertId > 0;
  } catch (e) {
    throw new DaoError(`Cannot create fund for group(${origanizationPk})`, e);
  }
};

Dao.deleteFund = async (fundPk) => {
  try {
    const query = `delete from funds where pk = ?`;
    await db.execute(query, [fundPk]);
    return true;
  } catch (e) {
    throw new DaoError(`Cannot find funds for group(${origanizationPk})`, e);
  }
};

Dao.findFundEventsByFundPk = async (fundPk) => {
  try {
    const query = `select * from fund_events where fund_pk = ?`;
    const [fundEvents] = await db.execute(query, [fundPk]);
    return fundEvents;
  } catch (e) {
    throw new DaoError(`Cannot find funds for group(${origanizationPk})`, e);
  }
};

Dao.createFundEvent = async (fundPk, fundEvent, userPk) => {
  const { name, description, amountPerMember } = fundEvent;

  try {
    const query = `insert into fund_events(name, description, fund_pk, amount_per_member, created_by, updated_by)
    values(?,?,?,?,?,?)`;
    const [result] = await db.execute(query, [
      name, description, fundPk, amountPerMember, userPk, userPk
    ])
    return result.insertId > 0;
  } catch (e) {
    throw new DaoError(`Cannot create fund event fund(${fundPk})`, e);
  }
};

Dao.archiveFundEventByPk = async (fundEventPk, reason) => {
  try {
    const query = `update fund_events set status = 'archived', status_reason = ? where pk = ?`;
    await db.execute(query, [reason, fundEventPk]);
    return true;
  } catch (e) {
    throw new DaoError(`Cannot archive fund event(${fundEventPk})`, e);
  }
};

Dao.createTransaction = async (fundPk, transaction, userPk) => {
  const { message, amount, type, status, fundEventPk, proof,  } = transaction;
  let conn, query;

  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    query = `insert into transactions(fund_pk, message, amount, type, status, fund_event_pk, proof, created_by, updated_pk)
    values(?,?,?,?,?,?,?,?,?)`;
    await conn.execute(query, [fundPk, message, amount, type, status, fundEventPk, proof, userPk, userPk]);

    if (status === 'confirmed') {
      const calc = type === 'withdrawal' ? `(balance - ${amount})` : `(balance + ${amount})`;
      query = `update funds set balance = ${calc}, updated_by = ?, updated_at = ? where pk = ?`;
      await conn.execute(query, [
        userPk,
        dateUtils.getMariaDbCurrentTimestamp(),
        fundPk
      ]);
    }


    await conn.commit();
  } catch (e) {
    if (conn) await conn.rollback();
    throw new DaoError(`Cannot create transaction for fund(${fundPk})`, e);
  } finally {
    if (conn) conn.release();
  }
};

Dao.markTransactionPaid = async (fundPk, transactionPk, userPk) => {
  let conn, query;

  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    await conn.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');

    await conn.execute(`select * from transactions where pk = ? for update`, [transactionPk]);
    await conn.execute(`select * from funds where pk = ? for update`, [fundPk]);

    query = `update transactions set status = 'confirmed' where pk = ?`;
    await conn.execute(query, [transactionPk]);

    query = `select * from transactions where pk = ?`;
    const [transaction] = await conn.execute(query, [transactionPk]);
    const { type, amount } = transaction;

    const calc = type === 'withdrawal' ? `(balance - ${amount})` : `(balance + ${amount})`;
    query = `update funds set balance = ${calc}, updated_by = ?, updated_at = ? where pk = ?`;
    await conn.execute(query, [
      userPk,
      dateUtils.getMariaDbCurrentTimestamp(),
      fundPk
    ]);

    await conn.commit();
  } catch (e) {
    if (conn) await conn.rollback();
    throw new DaoError(`Cannot create transaction for fund(${fundPk})`, e);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = Dao;
