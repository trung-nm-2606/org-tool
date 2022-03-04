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
    const organizations = await db.query(query, [userPk]);
    return organizations;
  } catch (e) {
    throw new DaoError(`Cannot get organizations by userPk(${userPk})`, e);
  }
};

Dao.createOrganization = (name, desc, authenticatedUser) => {
  const errMsg = `Cannot create organization(name=${name},desc=${desc})`;
  return new Promise((resolve, reject) => {
    db.getConnection((e, conn) => {
      if (e) {
        return reject(new DaoError(errMsg, e));
      }
      conn.beginTransaction((e) => {
        if (e) {
          conn.rollback(() => {
            conn.release();
            return reject(new DaoError(errMsg, e));
          });
          return;
        }

        const query = 'insert into organizations(name1, description, created_by, updated_by, status) values(?,?,?,?,?)';
        const { pk: userPk } = authenticatedUser;
        conn.query(query, [name, desc, userPk, userPk, 'active'], (e, result) => {
          if (e) {
            conn.rollback(() => {
              conn.release();
              return reject(new DaoError(errMsg, e));
            });
            return;
          }

          const organizationPk = result.insertId;
          const query = 'insert into organizations_users(organization_pk, user_pk, role) values(?,?,?)';
          conn.query(query, [organizationPk, userPk, 'owner'], (e) => {
            if (e) {
              conn.rollback(() => {
                conn.release();
                return reject(new DaoError(errMsg, e));
              });
              return;
            }

            conn.commit((e) => {
              if (e) {
                conn.rollback(() => {
                  conn.release();
                  return reject(new DaoError(errMsg, e));
                });
                return;
              }

              conn.release();
              resolve(true);
            });
          });
        });
      });
    });
  });
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
    await db.query(query, args);
  } catch (e) {
    throw new DaoError(`Cannot update organization(pk=${organizationPk})`, e);
  }

  return true;
};

Dao.deleteOrganization = async (organizationPk) => {
  const query = 'delete from organizations where pk = ?';
  try {
    await db.query(query, [organizationPk]);
  } catch (e) {
    throw new DaoError(`Cannot delete organization(pk=${organizationPk})`, e);
  }

  return true;
};

Dao.findOrganizationByPk = async (pk) => {
  const query = `select * from organizations where pk = ?`;
  let organizations = [];

  try {
    organizations = await db.query(query, [pk]);
  } catch (e) {
    throw new DaoError(`Cannot get organization by pk(${pk})`, e);
  }

  return organizations[0];
};

Dao.findMembersByOrganizationPk = async (organizationPk, memberPk = '') => {
  const query = `select ou.*, u.* from organizations_users as ou
  left join users u on ou.user_pk = u.pk
  where ou.organization_pk = ? and u.status = 'active'
  ${memberPk ? ' and ou.user_pk = ?' : ''}`;
  const args = [organizationPk];
  if (memberPk) args.push(memberPk);

  try {
    const members = await db.query(query, args);
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
    const organizations = await db.query(query, ['owner', userPk]);
    return organizations;
  } catch (e) {
    throw new DaoError(`Cannot get organizations owned by user(pk=${userPk})`, e);
  }
};

Dao.addUserToOrganization = async (organizationPk, userPk) => {
  const query = 'insert into organizations_users(organization_pk, user_pk, role) values(?,?,?)';

  try {
    await db.query(query, [organizationPk, userPk, 'member']);
  } catch (e) {
    throw new DaoError(`Cannot add member(pk=${userPk}) to organization(pk=${organizationPk})`, e);
  }

  return true;
};

module.exports = Dao;
