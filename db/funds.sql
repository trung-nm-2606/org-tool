-- auto-generated definition
create table funds
(
    pk              int(11) unsigned auto_increment
        primary key,
    name            varchar(150)                                 not null,
    description     varchar(500)                                 null,
    organization_pk int(11) unsigned                             not null,
    balance         decimal(19, 2)              default 0.00     not null,
    currency        enum ('vnd', 'usd')         default 'vnd'    not null,
    status          enum ('active', 'archived') default 'active' not null,
    created_by      int(11) unsigned                             not null,
    updated_by      int(11) unsigned                             not null,
    constraint fund_organizations_pk_fk
        foreign key (organization_pk) references organizations (pk)
            on delete cascade,
    constraint fund_users_pk_fk
        foreign key (created_by) references users (pk)
            on delete cascade
);
