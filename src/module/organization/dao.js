const db = require('../../shared/db');
const dateUtils = require('../../shared/date_utils');
const DaoError = require('../../model/error/DaoError');

const Dao = {};

Dao.findOrganizationsByUserPk = async (userPk) => {
  const query = `select o.*, ou.role, tmp.members_count
  from organizations_users as ou
  left join organizations o on ou.organization_pk = o.pk
  left join (
    select ou_temp.organization_pk, count(ou_temp.user_pk) as members_count
    from organizations_users as ou_temp
    group by ou_temp.organization_pk
  ) as tmp on tmp.organization_pk = o.pk
  where ou.user_pk = ?`;

  try {
    const [organizations] = await db.execute(query, [userPk]);
    return organizations;
  } catch (e) {
    throw new DaoError(`Cannot get organizations by userPk(${userPk})`, e);
  }
};

Dao.createOrganization = async (name, desc, authenticatedUser) => {
  const errMsg = `Cannot create organization(name=${name},desc=${desc})`;
  let conn, query;
  const { pk: userPk } = authenticatedUser;

  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    query = 'insert into organizations(name, description, created_by, updated_by, status) values(?,?,?,?,?)';
    const [result] = await conn.execute(query, [name, desc, userPk, userPk, 'active']);
    const organizationPk = result.insertId;

    console.log('Last inserted id of organization: ', organizationPk);
    query = 'insert into organizations_users(organization_pk, user_pk, role) values(?,?,?)';
    await conn.execute(query, [organizationPk, userPk, 'owner']);

    await conn.commit();
  } catch (e) {
    if (conn) await conn.rollback();
    throw new DaoError(errMsg, e);
  } finally {
    if (conn) conn.release();
  }

  return true;
};

Dao.updateOrganization = async (organizationPk, userPk, updateInfo) => {
  const fields = [];
  const args = [];
  for (let key in updateInfo) {
    const field = key;
    fields.push(`${field}=COALESCE(?, ${field})`);
    args.push(updateInfo[key]);
  }
  const updateFields = fields.join(',')
  const query = `update organizations set ${updateFields}, updated_at = ?, updated_by = ? where pk = ?`;
  args.push(dateUtils.getMariaDbCurrentTimestamp());
  args.push(userPk);
  args.push(organizationPk);

  try {
    await db.execute(query, args);
  } catch (e) {
    throw new DaoError(`Cannot update organization(pk=${organizationPk})`, e);
  }

  return true;
};

Dao.deleteOrganization = async (organizationPk) => {
  const query = 'delete from organizations where pk = ?';
  try {
    await db.execute(query, [organizationPk]);
  } catch (e) {
    throw new DaoError(`Cannot delete organization(pk=${organizationPk})`, e);
  }

  return true;
};

Dao.findOrganizationByPk = async (pk) => {
  const query = `select * from organizations where pk = ?`;
  try {
    const [organizations] = await db.execute(query, [pk]);
    return organizations[0];
  } catch (e) {
    throw new DaoError(`Cannot get organization by pk(${pk})`, e);
  }
};

Dao.findMembersByOrganizationPk = async (organizationPk, memberPk = '') => {
  const query = `select ou.*, u.* from organizations_users as ou
  left join users u on ou.user_pk = u.pk
  where ou.organization_pk = ?
  ${memberPk ? ' and ou.user_pk = ?' : ''}`;
  const args = [organizationPk];
  if (memberPk) args.push(memberPk);

  try {
    const [members] = await db.execute(query, args);
    return members;
  } catch (e) {
    throw new DaoError(`Cannot get members of organization(pk=${organizationPk})`, e);
  }
}

Dao.findOrganizationsOwnedByUserPk = async (userPk) => {
  const query = `select * from organizations as o
  left join organizations_users ou on o.pk = ou.organization_pk
  where ou.role = ? and ou.user_pk = ?`;

  try {
    const [organizations] = await db.execute(query, ['owner', userPk]);
    return organizations;
  } catch (e) {
    throw new DaoError(`Cannot get organizations owned by user(pk=${userPk})`, e);
  }
};

Dao.addUserToOrganization = async (organizationPk, userPk) => {
  const query = 'insert into organizations_users(organization_pk, user_pk, role) values(?,?,?)';

  try {
    await db.execute(query, [organizationPk, userPk, 'member']);
  } catch (e) {
    throw new DaoError(`Cannot add member(pk=${userPk}) to organization(pk=${organizationPk})`, e);
  }

  return true;
};

Dao.removeUserFromOrganization = async (organizationPk, userPk) => {
  const query = 'delete from organizations_users where organization_pk = ? and user_pk = ?';

  try {
    await db.execute(query, [organizationPk, userPk]);
  } catch (e) {
    throw new DaoError(`Cannot remove member(pk=${userPk}) from organization(pk=${organizationPk})`, e);
  }

  return true;
};

module.exports = Dao;
