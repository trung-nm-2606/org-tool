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

        const query = 'insert into organizations(name, `desc`, created_by, updated_by, status) values(?,?,?,?,?)';
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

module.exports = repo;
