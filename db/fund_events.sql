-- auto-generated definition
create table fund_events
(
    pk                int(11) unsigned auto_increment
        primary key,
    name              varchar(150)                                                      not null,
    description       varchar(500)                                                      null,
    fund_pk           int(11) unsigned                                                  not null,
    amount_per_member decimal(19, 2)                                                    not null,
    status            enum ('started', 'ended', 'archived') default 'started'           not null,
    status_reason     varchar(500)                                                      null,
    created_by        int(11) unsigned                                                  not null,
    created_at        datetime                              default current_timestamp() not null,
    updated_by        int(11) unsigned                                                  not null,
    updated_at        datetime                              default current_timestamp() not null,
    constraint fund_events_funds_pk_fk
        foreign key (fund_pk) references funds (pk)
            on delete cascade,
    constraint fund_events_users_pk_fk
        foreign key (created_by) references users (pk)
            on delete cascade,
    constraint fund_events_users_pk_fk_2
        foreign key (updated_by) references users (pk)
            on delete cascade
);
