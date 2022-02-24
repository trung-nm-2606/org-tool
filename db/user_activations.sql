-- auto-generated definition
create table user_activations
(
    pk              int(11) unsigned auto_increment
        primary key,
    email           varchar(150)                                                           not null,
    activation_code varchar(64)                                                            not null,
    retry_count     int                                        default 0                   null,
    renew_count     int                                        default 0                   not null,
    created_at      datetime                                   default current_timestamp() not null,
    updated_at      datetime                                   default current_timestamp() not null,
    status          enum ('processed', 'pending', 'cancelled') default 'pending'           not null,
    constraint user_activations_email_uindex
        unique (email)
);
