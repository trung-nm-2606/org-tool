-- auto-generated definition
create table organizations
(
    pk         int(11) unsigned auto_increment
        primary key,
    name       varchar(150)                                                              not null,
    `desc`     varchar(500)                                                              null,
    status     enum ('demo', 'active', 'banned', 'archived') default 'demo'              not null,
    created_by int(11) unsigned                                                          null,
    created_at datetime                                      default current_timestamp() null,
    updated_by int(11) unsigned                                                          null,
    updated_at datetime                                      default current_timestamp() null,
    constraint organizations_users_pk_fk
        foreign key (created_by) references users (pk),
    constraint organizations_users_pk_fk_2
        foreign key (updated_by) references users (pk)
);
