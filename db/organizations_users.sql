-- auto-generated definition
create table organizations_users
(
    organization_pk int(11) unsigned                          not null,
    user_pk         int(11) unsigned                          not null,
    role            enum ('owner', 'member') default 'member' not null,
    constraint organizations_users_organization_pk_user_pk_uindex
        unique (organization_pk, user_pk),
    constraint organizations_users_organizations_pk_fk
        foreign key (organization_pk) references organizations (pk)
            on delete cascade,
    constraint organizations_users_users_pk_fk
        foreign key (user_pk) references users (pk)
            on delete cascade
);
