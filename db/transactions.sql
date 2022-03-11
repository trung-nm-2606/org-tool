-- auto-generated definition
create table transactions
(
    pk            int(11) unsigned auto_increment
        primary key,
    fund_pk       int(11) unsigned                                                                     not null,
    message       varchar(500)                                           default 'unknown transaction' not null,
    amount        decimal(19, 2)                                         default 0.00                  not null,
    type          enum ('deposit', 'withdrawal')                         default 'deposit'             not null,
    status        enum ('pending', 'confirmed', 'cancelled', 'archived') default 'pending'             not null,
    status_reason varchar(500)                                                                         null,
    fund_event_pk int(11) unsigned                                                                     not null,
    proof         varchar(500)                                                                         null,
    created_by    int(11) unsigned                                                                     null,
    created_at    datetime                                               default current_timestamp()   not null,
    updated_by    int(11) unsigned                                                                     null,
    updated_at    datetime                                               default current_timestamp()   not null,
    constraint transactions_fund_events_pk_fk
        foreign key (fund_event_pk) references fund_events (pk)
            on delete cascade,
    constraint transactions_funds_pk_fk
        foreign key (fund_pk) references funds (pk)
            on delete cascade,
    constraint transactions_users_pk_fk
        foreign key (created_by) references users (pk)
            on delete cascade,
    constraint transactions_users_pk_fk_2
        foreign key (updated_by) references users (pk)
            on delete cascade
);
