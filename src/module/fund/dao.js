const db = require('../../shared/db');

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
  const { name, description, balance, currency  } = fund;

  try {
    const query = `insert into funds(name, description, organization_pk, balance, currency, created_by, updated_by)
    values(?,?,?,?,?,?,?)`;
    const [result] = await db.execute(query, [
      name, description, origanizationPk, balance, currency, userPk, userPk
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
    await db.execute(query, [fundEventPk, reason]);
    return true;
  } catch (e) {
    throw new DaoError(`Cannot archive fund event(${fundEventPk})`, e);
  }
};

module.exports = Dao;
