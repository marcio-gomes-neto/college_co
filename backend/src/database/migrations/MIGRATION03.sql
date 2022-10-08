CREATE TABLE public.students
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    cpf character varying(11) NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    gender character varying(25) NOT NULL,
    phone character varying(25) NOT NULL,
    active boolean NOT NULL DEFAULT true,
    PRIMARY KEY (id, cpf)
);