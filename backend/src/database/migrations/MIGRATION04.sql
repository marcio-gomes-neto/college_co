CREATE TABLE public.admin
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    login character varying(50) NOT NULL,
    password character varying(512) NOT NULL,
    active boolean NOT NULL DEFAULT true,
    PRIMARY KEY (login, id)
);