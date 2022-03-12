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
    const query = `insert into fund(name, description, organization_pk, balance, currency, created_by, updated_by)
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

module.exports = Dao;
