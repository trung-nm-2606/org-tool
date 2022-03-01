const db = require('../shared/db');
const dateUtils = require('../shared/date_utils');

const repo = {};

repo.createOrganization = (name, desc, authenticatedUser) => {
  return new Promise((resolve, reject) => {
    db.getConnection((e, conn) => {
      if (e) {
        console.log(`[OrganizationRepo]: Cannot create organization(name=${name},desc=${desc}). ${e.message}`);
        conn.release();
        reject(false);
        return;
      }
      conn.beginTransaction((e) => {
        if (e) {
          console.log(`[OrganizationRepo]: Cannot create organization(name=${name},desc=${desc}). ${e.message}`);
          conn.rollback(() => {
            conn.release();
            reject(false);
          });
          return;
        }

        const query = 'insert into organizations(name, description, created_by, updated_by, status) values(?,?,?,?,?)';
        const { pk: userPk } = authenticatedUser;
        conn.query(query, [name, desc, userPk, userPk, 'active'], (e, result) => {
          if (e) {
            console.log(`[OrganizationRepo]: Cannot create organization(name=${name},desc=${desc}). ${e.message}`);
            conn.rollback(() => {
              conn.release();
              reject(false);
            });
            return;
          }

          const organizationPk = result.insertId;
          const query = 'insert into organizations_users(organization_pk, user_pk, role) values(?,?,?)';
          conn.query(query, [organizationPk, userPk, 'owner'], (e) => {
            if (e) {
              console.log(`[OrganizationRepo]: Cannot create organization(name=${name},desc=${desc}). ${e.message}`);
              conn.rollback(() => {
                conn.release();
                reject(false);
              });
              return;
            }

            conn.commit((e) => {
              if (e) {
                console.log(`[OrganizationRepo]: Cannot create organization(name=${name},desc=${desc}). ${e.message}`);
                conn.rollback(() => {
                  conn.release();
                  reject(false);
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

repo.findOrganizationByPk = async (pk) => {
  const query = `select * from organizations where pk = ?`;
  try {
    const organizations = await db.query(query, [pk]);
    return organizations[0];
  } catch (e) {
    console.log(`[OrganizationRepo]: Cannot get organization by pk(${pk}). ${e.message}`);
    return null;
  }
};

repo.findOrganizationsByUserPk = async (userPk) => {
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
    console.log(`[OrganizationRepo]: Cannot get organizations by userPk(${userPk}). ${e.message}`);
    return [];
  }
};

repo.updateOrganization = async (organizationPk, userPk, updateInfo) => {
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
    return true;
  } catch (e) {
    console.log(`[OrganizationRepo]: Cannot update organization(pk=${organizationPk}). ${e.message}`);
    return false;
  }
};

repo.deleteOrganization = async (organizationPk) => {
  const query = 'delete from organizations where pk = ?';
  try {
    await db.query(query, [organizationPk]);
    return true;
  } catch (e) {
    console.log(`[OrganizationRepo]: Cannot delete organization(pk=${organizationPk}). ${e.message}`);
    return false;
  }
};

repo.findMembersByOrganizationPk = async (organizationPk) => {
  const query = `select ou.*, u.* from organizations_users as ou
  left join users u on ou.user_pk = u.pk
  where ou.organization_pk = ?`;
  try {
    const members = await db.query(query, [organizationPk]);
    return members;
  } catch (e) {
    console.log(`[OrganizationRepo]: Cannot get members of organization(pk=${organizationPk}). ${e.message}`);
    return [];
  }
}

repo.addUserToOrganization = async (organizationPk, userPk) => {
  const query = 'insert into organizations_users(organization_pk, user_pk, role) values(?,?,?)';
  try {
    await db.query(query, [organizationPk, userPk, 'member']);
    return true;
  } catch (e) {
    console.log(`[OrganizationRepo]: Cannot add member(pk=${userPk}) to organization(pk=${organizationPk}). ${e.message}`);
    return false;
  }
};

module.exports = repo;
