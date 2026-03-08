--
-- PostgreSQL database dump
--

\restrict xWTaXm0PLh5lEtcN6fkDDxRpMepshq0vWiWh9931WhEtFFJ4qylOwoJ6WIR7kbN

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-03-08 18:45:41

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS "iTimev3";
--
-- TOC entry 5184 (class 1262 OID 32780)
-- Name: iTimev3; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "iTimev3" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Philippines.1252';


ALTER DATABASE "iTimev3" OWNER TO postgres;

\unrestrict xWTaXm0PLh5lEtcN6fkDDxRpMepshq0vWiWh9931WhEtFFJ4qylOwoJ6WIR7kbN
\connect "iTimev3"
\restrict xWTaXm0PLh5lEtcN6fkDDxRpMepshq0vWiWh9931WhEtFFJ4qylOwoJ6WIR7kbN

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 32781)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5185 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 907 (class 1247 OID 32820)
-- Name: type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.type_enum AS ENUM (
    'Inspection',
    'Receiving'
);


ALTER TYPE public.type_enum OWNER TO postgres;

--
-- TOC entry 910 (class 1247 OID 32826)
-- Name: type_enum_v2; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.type_enum_v2 AS ENUM (
    'Inspection',
    'Receiving'
);


ALTER TYPE public.type_enum_v2 OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 32831)
-- Name: construction_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.construction_item (
    id integer NOT NULL,
    construction_item text
);


ALTER TABLE public.construction_item OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 32837)
-- Name: construction_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.construction_item ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.construction_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 32838)
-- Name: department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.department (
    dept_id uuid DEFAULT gen_random_uuid() NOT NULL,
    dept_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.department OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 32848)
-- Name: employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee (
    emp_id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    group_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    role text
);


ALTER TABLE public.employee OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 32861)
-- Name: group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."group" (
    group_id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_name text NOT NULL,
    dept_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."group" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 32872)
-- Name: inspection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inspection (
    inspection_id uuid DEFAULT gen_random_uuid() NOT NULL,
    inspector_id integer NOT NULL,
    inspection_date timestamp with time zone NOT NULL,
    duration integer NOT NULL,
    type public.type_enum NOT NULL,
    work_id uuid NOT NULL,
    location_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT inspection_duration_check CHECK ((duration > 0))
);


ALTER TABLE public.inspection OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 32886)
-- Name: inspection_v2; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inspection_v2 (
    inspection_id integer NOT NULL,
    inspector_id integer NOT NULL,
    work_order_id integer NOT NULL,
    work_code_id integer NOT NULL,
    construction_item_id integer NOT NULL,
    others_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    location_id integer,
    inspection_date date,
    type public.type_enum,
    start_time timestamp with time zone DEFAULT now(),
    end_time timestamp with time zone DEFAULT now(),
    status text
);


ALTER TABLE public.inspection_v2 OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 32898)
-- Name: inspection_v2_inspection_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.inspection_v2 ALTER COLUMN inspection_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.inspection_v2_inspection_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 32899)
-- Name: location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location (
    loc_id uuid DEFAULT gen_random_uuid() NOT NULL,
    location text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.location OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 32909)
-- Name: location_v2; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location_v2 (
    id integer NOT NULL,
    location text
);


ALTER TABLE public.location_v2 OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 32915)
-- Name: location_v2_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.location_v2 ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.location_v2_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 231 (class 1259 OID 32916)
-- Name: others; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.others (
    id integer NOT NULL,
    others "char"
);


ALTER TABLE public.others OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 32920)
-- Name: others_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.others ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.others_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 233 (class 1259 OID 32921)
-- Name: work_code; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_code (
    id integer NOT NULL,
    work_code integer
);


ALTER TABLE public.work_code OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 32925)
-- Name: work_code_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.work_code ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.work_code_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 235 (class 1259 OID 32926)
-- Name: work_order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_order (
    work_id uuid DEFAULT gen_random_uuid() NOT NULL,
    work_order text NOT NULL,
    work_code integer NOT NULL,
    construction_item text NOT NULL,
    others integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.work_order OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 32940)
-- Name: work_order_v2; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_order_v2 (
    id integer NOT NULL,
    work_order text
);


ALTER TABLE public.work_order_v2 OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 32946)
-- Name: work_order_v2_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.work_order_v2 ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.work_order_v2_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 5161 (class 0 OID 32831)
-- Dependencies: 220
-- Data for Name: construction_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.construction_item (id, construction_item) FROM stdin;
1	Piping
2	Welding
3	Cable Pull
4	Foundation
5	Rebar Installation
6	Formworks
7	Masonry
8	Roofing
9	Waterproofing
10	Painting
11	Finishing
12	Landscaping
\.


--
-- TOC entry 5163 (class 0 OID 32838)
-- Dependencies: 222
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.department (dept_id, dept_name, created_at) FROM stdin;
43092d98-1d7d-44ca-84bb-23aa50bde2ee	Operations	2026-01-16 06:40:25.358004+08
34d67940-8808-483c-8d5e-c4ed1a5d435e	Quality Assurance	2026-01-16 06:40:25.358004+08
\.


--
-- TOC entry 5164 (class 0 OID 32848)
-- Dependencies: 223
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee (emp_id, first_name, last_name, email, password_hash, group_id, created_at, role) FROM stdin;
6	Sean	Pactol	seanpactol@company.com	$2b$10$bTfdzgwNuhSx4msj0HacXeY6ghYKxvbGztx52HdD7rhpnKw4gnrt2	3ce97097-0037-4020-b5ec-5f684f010eb9	2026-01-20 08:40:32.195066+08	\N
10	Sample	Test	sample.test@company.com	$2b$10$OwDaLZJ2z4EmooHHuT6IG.PQPdlIf2VOLEVZfzABbM54FDiAhsJYK	3400e634-ea2f-440b-be93-4db41effe2c8	2026-01-20 13:32:14.932502+08	User
1	Paolo	Limbaga	paolo.lim@company.com	$2b$10$jJx738FpseZtU1hyKG8cLOs0JsQrC1sjtcqUSt6gLAkIjKjP9BJkC	3ce97097-0037-4020-b5ec-5f684f010eb9	2026-01-16 06:40:25.358004+08	Admin
542	Edric Jay	Rivas	rivas-cmpy@company.com	$2b$10$pGNlChnwOjqd/YdD0NY1cO3neo9VCiEcSm4i4x7e1EjRIox7tS0dK	3ce97097-0037-4020-b5ec-5f684f010eb9	2026-02-17 06:46:19.747754+08	Admin
543	543	Test	paolo.lim2@company.com	$2b$10$b7Ty/sUQs8SYdtDVQF4EkOmTSn/d5yrE6HrhCgLZHd2Kczspw.1yC	9c284123-aeee-42b1-af6c-7955e1472c8a	2026-02-20 08:26:01.509007+08	Admin
2	Lea	Garcia	lea.garcia@company.com	$2b$10$jJx738FpseZtU1hyKG8cLOs0JsQrC1sjtcqUSt6gLAkIjKjP9BJkC	9c284123-aeee-42b1-af6c-7955e1472c8a	2026-01-16 06:40:25.358004+08	User
3	Jin	Dela Cruz	jin.dc@company.com	$2b$10$jJx738FpseZtU1hyKG8cLOs0JsQrC1sjtcqUSt6gLAkIjKjP9BJkC	3400e634-ea2f-440b-be93-4db41effe2c8	2026-01-16 06:40:25.358004+08	Admin
4	Mark	Santos	mark.santos@company.com	$2b$10$jJx738FpseZtU1hyKG8cLOs0JsQrC1sjtcqUSt6gLAkIjKjP9BJkC	c28b6a58-b21b-40e1-8358-60f4fe25bbf1	2026-01-16 06:40:25.358004+08	User
5	Ana Liza	Reyes	analiza.reyes@company.com	$2b$10$jJx738FpseZtU1hyKG8cLOs0JsQrC1sjtcqUSt6gLAkIjKjP9BJkC	c28b6a58-b21b-40e1-8358-60f4fe25bbf1	2026-01-16 06:40:25.358004+08	Admin
123123	123	123	edricjayrivas123@gmail.com	$2b$10$QAMV/7iodJ6mEgascbY9aOHYQ5u6BPEeqcJzTD8RWo7sGuAwUhBIS	3ce97097-0037-4020-b5ec-5f684f010eb9	2026-03-07 15:58:55.613293+08	Admin
12	Edric	Rivas	edric.rivas@company.com	$2b$10$pYHgp3JPMY6VDim9B6eySO43q6U8OO3OhtDfqA8WNDNZ5BX9zQ9dK	3ce97097-0037-4020-b5ec-5f684f010eb9	2026-01-30 08:59:29.151387+08	Admin
\.


--
-- TOC entry 5165 (class 0 OID 32861)
-- Dependencies: 224
-- Data for Name: group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."group" (group_id, group_name, dept_id, created_at) FROM stdin;
3ce97097-0037-4020-b5ec-5f684f010eb9	Ops - Central	43092d98-1d7d-44ca-84bb-23aa50bde2ee	2026-01-16 06:40:25.358004+08
9c284123-aeee-42b1-af6c-7955e1472c8a	Ops - South	43092d98-1d7d-44ca-84bb-23aa50bde2ee	2026-01-16 06:40:25.358004+08
3400e634-ea2f-440b-be93-4db41effe2c8	Ops - North	43092d98-1d7d-44ca-84bb-23aa50bde2ee	2026-01-16 06:40:25.358004+08
c28b6a58-b21b-40e1-8358-60f4fe25bbf1	QA - Field	34d67940-8808-483c-8d5e-c4ed1a5d435e	2026-01-16 06:40:25.358004+08
b12f4629-bb8d-4061-85e0-00faf1303d52	QA - Incoming	34d67940-8808-483c-8d5e-c4ed1a5d435e	2026-01-16 06:40:25.358004+08
\.


--
-- TOC entry 5166 (class 0 OID 32872)
-- Dependencies: 225
-- Data for Name: inspection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inspection (inspection_id, inspector_id, inspection_date, duration, type, work_id, location_id, created_at) FROM stdin;
b759bf18-e435-4e8e-b83d-0c9d1bf4cff4	5	2026-01-06 06:40:25.358004+08	45	Inspection	f135b15e-659e-40ec-a31a-a590b1c76524	87536321-188c-4589-bac3-db8979e6ed00	2026-01-16 06:40:25.358004+08
61c28209-870c-431b-aa58-8058242fbf52	4	2026-01-07 06:40:25.358004+08	30	Receiving	f135b15e-659e-40ec-a31a-a590b1c76524	87536321-188c-4589-bac3-db8979e6ed00	2026-01-16 06:40:25.358004+08
185ef1d6-ddcd-42a7-9c62-3a9d14ffe868	3	2026-01-09 06:40:25.358004+08	40	Inspection	029ac3ae-d7f0-40f0-a2cb-4721e8b57b51	4cff1070-a0d9-4b72-9ac6-d96e29d4a976	2026-01-16 06:40:25.358004+08
03ec4e36-b783-4428-9998-80d613f45c86	2	2026-01-10 06:40:25.358004+08	35	Receiving	029ac3ae-d7f0-40f0-a2cb-4721e8b57b51	87536321-188c-4589-bac3-db8979e6ed00	2026-01-16 06:40:25.358004+08
94dfcaf1-c101-4f9b-af73-2785419ed21e	1	2026-01-11 06:40:25.358004+08	50	Inspection	c0e27ff5-2795-4c95-978a-18dd99a16389	4cff1070-a0d9-4b72-9ac6-d96e29d4a976	2026-01-16 06:40:25.358004+08
de60b5d8-bf61-46a0-8fc1-6ebeefc3c8bb	4	2026-01-12 06:40:25.358004+08	25	Receiving	d626b362-ebc8-4d4f-9a1f-3b0ad617e182	87536321-188c-4589-bac3-db8979e6ed00	2026-01-16 06:40:25.358004+08
016b2923-d858-44b3-bb9c-0603d53132ec	5	2026-01-13 06:40:25.358004+08	55	Inspection	d626b362-ebc8-4d4f-9a1f-3b0ad617e182	4cff1070-a0d9-4b72-9ac6-d96e29d4a976	2026-01-16 06:40:25.358004+08
ff570f39-34b1-4075-a912-48989cd7d971	3	2026-01-14 06:40:25.358004+08	45	Inspection	d626b362-ebc8-4d4f-9a1f-3b0ad617e182	4cff1070-a0d9-4b72-9ac6-d96e29d4a976	2026-01-16 06:40:25.358004+08
4b807ec6-ff01-4e17-b821-0240450b1172	2	2026-01-15 06:40:25.358004+08	35	Inspection	db945b33-d851-4abb-8336-f026b3a9e082	87536321-188c-4589-bac3-db8979e6ed00	2026-01-16 06:40:25.358004+08
74cdb91b-e081-408c-bbb1-b16fb21ff762	5	2026-01-08 06:40:25.358004+08	60	Inspection	13b0f0a3-bcea-42b2-b0ee-ff4f2bcd35b8	4cff1070-a0d9-4b72-9ac6-d96e29d4a976	2026-01-16 06:40:25.358004+08
\.


--
-- TOC entry 5167 (class 0 OID 32886)
-- Dependencies: 226
-- Data for Name: inspection_v2; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inspection_v2 (inspection_id, inspector_id, work_order_id, work_code_id, construction_item_id, others_id, created_at, location_id, inspection_date, type, start_time, end_time, status) FROM stdin;
354	12	11	18	5	1	2026-02-10 08:17:26.194111+08	2	2026-02-10	Inspection	2026-02-10 12:00:00+08	2026-02-10 15:00:00+08	ended
356	6	28	17	3	5	2026-02-10 08:17:26.194111+08	3	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
358	10	16	23	3	4	2026-02-10 08:17:26.194111+08	2	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
440	12	1	2	4	8	2026-03-08 17:06:50.426+08	1	2026-03-08	Inspection	2026-03-08 17:10:38.363+08	2026-03-08 18:28:21.24+08	ended
360	4	4	15	12	3	2026-02-10 08:17:26.194111+08	3	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
363	5	9	17	12	9	2026-02-10 08:17:26.194111+08	2	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
365	2	26	12	9	4	2026-02-10 08:17:26.194111+08	3	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
438	12	2	12	3	9	2026-03-08 15:04:02.534+08	2	2026-03-08	Inspection	2026-03-08 15:04:02.521+08	2026-03-08 15:04:02.521+08	active
400	2	15	11	12	10	2026-02-10 08:17:26.194111+08	2	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
403	2	15	11	12	10	2026-02-10 08:17:26.194111+08	2	2026-02-11	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
404	5	5	11	9	8	2026-02-10 08:17:26.194111+08	2	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
406	10	27	10	10	3	2026-02-10 08:17:26.194111+08	1	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
407	5	11	8	9	2	2026-02-10 08:17:26.194111+08	1	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
439	12	1	2	4	8	2026-03-08 15:23:22.755+08	2	2026-03-08	Inspection	2026-03-08 16:41:41.878+08	2026-03-08 17:07:07.887+08	ended
408	12	4	13	12	7	2026-02-10 08:17:26.194111+08	1	2026-02-11	Inspection	2026-02-11 06:00:00+08	2026-02-11 15:00:00+08	ended
409	1	25	10	3	5	2026-02-10 08:17:26.194111+08	3	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
411	12	27	14	1	3	2026-02-10 08:17:26.194111+08	1	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
412	2	3	12	11	8	2026-02-10 08:17:26.194111+08	3	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
413	10	8	20	9	1	2026-02-10 08:17:26.194111+08	1	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
414	2	2	12	3	9	2026-02-10 08:17:26.194111+08	3	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
415	5	12	7	10	8	2026-02-10 08:17:26.194111+08	2	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
416	3	19	16	10	4	2026-02-10 08:17:26.194111+08	2	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
417	2	19	22	12	6	2026-02-10 08:17:26.194111+08	1	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
367	10	20	19	6	9	2026-02-10 08:17:26.194111+08	3	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
370	12	12	16	9	8	2026-02-10 08:17:26.194111+08	2	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
371	3	17	11	5	9	2026-02-10 08:17:26.194111+08	2	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
378	4	18	3	12	9	2026-02-10 08:17:26.194111+08	3	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
382	5	27	18	8	2	2026-02-10 08:17:26.194111+08	2	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
384	10	22	14	8	5	2026-02-10 08:17:26.194111+08	2	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
362	2	7	13	7	6	2026-02-10 08:17:26.194111+08	2	2026-01-28	Inspection	2026-01-28 06:00:00+08	2026-01-28 15:00:00+08	ended
355	6	19	10	4	4	2026-02-10 08:17:26.194111+08	1	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
359	6	12	9	6	1	2026-02-10 08:17:26.194111+08	1	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
361	6	3	22	3	9	2026-02-10 08:17:26.194111+08	1	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
366	4	11	4	11	9	2026-02-10 08:17:26.194111+08	1	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
369	2	18	2	6	6	2026-02-10 08:17:26.194111+08	1	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
373	12	23	10	1	7	2026-02-10 08:17:26.194111+08	1	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
374	6	22	5	3	3	2026-02-10 08:17:26.194111+08	1	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
379	5	27	8	3	2	2026-02-10 08:17:26.194111+08	1	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
386	4	12	3	7	4	2026-02-10 08:17:26.194111+08	1	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
389	10	24	2	3	9	2026-02-10 08:17:26.194111+08	2	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
391	2	28	18	5	10	2026-02-10 08:17:26.194111+08	3	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
392	1	26	9	3	8	2026-02-10 08:17:26.194111+08	3	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
387	3	19	13	12	9	2026-02-10 08:17:26.194111+08	1	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
388	10	27	1	4	4	2026-02-10 08:17:26.194111+08	1	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
390	4	22	11	6	4	2026-02-10 08:17:26.194111+08	1	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
418	3	27	6	12	4	2026-02-10 08:17:26.194111+08	3	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
419	12	27	14	1	3	2026-02-10 08:17:26.194111+08	1	2026-02-11	Receiving	2026-02-11 06:00:00+08	2026-02-11 15:00:00+08	ended
420	6	16	10	12	10	2026-02-10 08:17:26.194111+08	1	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
421	6	26	16	11	8	2026-02-10 08:17:26.194111+08	3	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
423	6	7	6	5	8	2026-02-10 08:17:26.194111+08	3	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
424	6	4	11	12	10	2026-02-10 08:17:26.194111+08	3	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
427	3	18	1	10	2	2026-02-10 08:17:26.194111+08	3	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
428	12	21	16	4	9	2026-02-10 08:17:26.194111+08	1	2026-02-15	Inspection	2026-02-15 12:00:00+08	2026-02-15 14:37:00+08	ended
431	12	1	2	4	8	2026-02-27 09:36:27.934+08	2	2026-03-02	Inspection	2026-03-05 06:00:00+08	2026-03-05 15:00:00+08	ended
432	12	1	2	4	8	2026-02-27 09:39:11.59+08	3	2026-03-01	Inspection	2026-03-05 06:00:00+08	2026-03-05 15:00:00+08	ended
433	12	1	2	4	8	2026-02-27 09:43:43.12+08	2	2026-02-27	Inspection	2026-02-27 06:00:00+08	2026-02-27 14:43:43.091+08	ended
434	12	1	2	4	8	2026-02-27 09:48:09.365+08	3	2026-03-05	Inspection	2026-03-05 06:00:00+08	2026-03-05 15:00:00+08	ended
357	12	21	16	4	9	2026-02-10 08:17:26.194111+08	1	2026-02-15	Inspection	2026-02-15 06:00:00+08	2026-02-15 11:00:00+08	ended
353	12	11	18	5	1	2026-02-10 08:17:26.194111+08	1	2026-01-10	Inspection	2026-01-10 06:00:00+08	2026-01-10 11:00:00+08	ended
394	10	7	17	10	7	2026-02-10 08:17:26.194111+08	3	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
395	1	24	16	7	6	2026-02-10 08:17:26.194111+08	2	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
397	5	10	1	5	3	2026-02-10 08:17:26.194111+08	1	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
398	12	4	13	12	7	2026-02-10 08:17:26.194111+08	1	2026-02-10	Inspection	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
375	12	12	16	9	8	2026-02-10 08:17:26.194111+08	3	2026-02-11	Receiving	2026-02-11 06:00:00+08	2026-02-11 15:00:00+08	ended
399	1	25	13	1	7	2026-02-10 08:17:26.194111+08	2	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
393	5	1	2	4	8	2026-02-10 08:17:26.194111+08	3	2026-02-10	Receiving	2026-02-10 06:00:00+08	2026-02-10 15:00:00+08	ended
\.


--
-- TOC entry 5169 (class 0 OID 32899)
-- Dependencies: 228
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.location (loc_id, location, created_at) FROM stdin;
87536321-188c-4589-bac3-db8979e6ed00	Warehouse A	2026-01-16 06:40:25.358004+08
4cff1070-a0d9-4b72-9ac6-d96e29d4a976	Site B	2026-01-16 06:40:25.358004+08
84fe9662-a1aa-489d-b216-49fa7f85bea1	Warehouse B	2026-01-20 14:53:18.857443+08
\.


--
-- TOC entry 5170 (class 0 OID 32909)
-- Dependencies: 229
-- Data for Name: location_v2; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.location_v2 (id, location) FROM stdin;
1	Warehouse A
2	Warehouse B
3	Site B
\.


--
-- TOC entry 5172 (class 0 OID 32916)
-- Dependencies: 231
-- Data for Name: others; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.others (id, others) FROM stdin;
1	0
2	1
3	2
4	3
5	4
6	5
7	6
8	7
9	7
10	7
\.


--
-- TOC entry 5174 (class 0 OID 32921)
-- Dependencies: 233
-- Data for Name: work_code; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.work_code (id, work_code) FROM stdin;
8	5
9	6
10	7
11	8
12	9
13	10
14	11
15	12
16	13
17	14
18	15
19	16
20	17
21	18
22	19
23	20
2	60
3	62
4	1
5	2
6	3
7	4
1	101
\.


--
-- TOC entry 5176 (class 0 OID 32926)
-- Dependencies: 235
-- Data for Name: work_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.work_order (work_id, work_order, work_code, construction_item, others, created_at) FROM stdin;
f135b15e-659e-40ec-a31a-a590b1c76524	WO-0001	1001	Piping Install	0	2026-01-16 06:40:25.358004+08
029ac3ae-d7f0-40f0-a2cb-4721e8b57b51	WO-0002	1002	Electrical Cable Pull	1	2026-01-16 06:40:25.358004+08
c0e27ff5-2795-4c95-978a-18dd99a16389	WO-0003	1003	Concrete Pour	0	2026-01-16 06:40:25.358004+08
d626b362-ebc8-4d4f-9a1f-3b0ad617e182	WO-0004	1004	HVAC Ducting	2	2026-01-16 06:40:25.358004+08
db945b33-d851-4abb-8336-f026b3a9e082	WO-0005	1005	Steel Erection	0	2026-01-16 06:40:25.358004+08
13b0f0a3-bcea-42b2-b0ee-ff4f2bcd35b8	WO-0001	1002	P-Trap Installation	2	2026-02-03 08:20:05.142226+08
\.


--
-- TOC entry 5177 (class 0 OID 32940)
-- Dependencies: 236
-- Data for Name: work_order_v2; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.work_order_v2 (id, work_order) FROM stdin;
1	WO-A
2	WO-B
3	WO-C
4	WO-V2-0001
5	WO-V2-0002
6	WO-V2-0003
7	WO-V2-0004
8	WO-V2-0005
9	WO-V2-0006
10	WO-V2-0007
11	WO-V2-0008
12	WO-V2-0009
13	WO-V2-0010
14	WO-V2-0011
15	WO-V2-0012
16	WO-V2-0013
17	WO-V2-0014
18	WO-V2-0015
19	WO-V2-0016
20	WO-V2-0017
21	WO-V2-0018
22	WO-V2-0019
23	WO-V2-0020
24	WO-V2-0021
25	WO-V2-0022
26	WO-V2-0023
27	WO-V2-0024
28	WO-V2-0025
\.


--
-- TOC entry 5186 (class 0 OID 0)
-- Dependencies: 221
-- Name: construction_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.construction_item_id_seq', 12, true);


--
-- TOC entry 5187 (class 0 OID 0)
-- Dependencies: 227
-- Name: inspection_v2_inspection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inspection_v2_inspection_id_seq', 440, true);


--
-- TOC entry 5188 (class 0 OID 0)
-- Dependencies: 230
-- Name: location_v2_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.location_v2_id_seq', 3, true);


--
-- TOC entry 5189 (class 0 OID 0)
-- Dependencies: 232
-- Name: others_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.others_id_seq', 13, true);


--
-- TOC entry 5190 (class 0 OID 0)
-- Dependencies: 234
-- Name: work_code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.work_code_id_seq', 23, true);


--
-- TOC entry 5191 (class 0 OID 0)
-- Dependencies: 237
-- Name: work_order_v2_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.work_order_v2_id_seq', 28, true);


--
-- TOC entry 4965 (class 2606 OID 32948)
-- Name: construction_item construction_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.construction_item
    ADD CONSTRAINT construction_item_pkey PRIMARY KEY (id);


--
-- TOC entry 4967 (class 2606 OID 32950)
-- Name: department department_dept_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_dept_name_key UNIQUE (dept_name);


--
-- TOC entry 4969 (class 2606 OID 32952)
-- Name: department department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (dept_id);


--
-- TOC entry 4971 (class 2606 OID 32954)
-- Name: employee employee_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_email_key UNIQUE (email);


--
-- TOC entry 4973 (class 2606 OID 32956)
-- Name: employee employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_pkey PRIMARY KEY (emp_id);


--
-- TOC entry 4976 (class 2606 OID 32958)
-- Name: group group_group_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_group_name_key UNIQUE (group_name);


--
-- TOC entry 4978 (class 2606 OID 32960)
-- Name: group group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_pkey PRIMARY KEY (group_id);


--
-- TOC entry 4984 (class 2606 OID 32962)
-- Name: inspection inspection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspection
    ADD CONSTRAINT inspection_pkey PRIMARY KEY (inspection_id);


--
-- TOC entry 4986 (class 2606 OID 32964)
-- Name: inspection_v2 inspection_v2_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspection_v2
    ADD CONSTRAINT inspection_v2_pkey PRIMARY KEY (inspection_id);


--
-- TOC entry 4988 (class 2606 OID 32966)
-- Name: location location_location_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_location_key UNIQUE (location);


--
-- TOC entry 4990 (class 2606 OID 32968)
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (loc_id);


--
-- TOC entry 4992 (class 2606 OID 32970)
-- Name: location_v2 location_v2_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location_v2
    ADD CONSTRAINT location_v2_pkey PRIMARY KEY (id);


--
-- TOC entry 4994 (class 2606 OID 32972)
-- Name: others others_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.others
    ADD CONSTRAINT others_pkey PRIMARY KEY (id);


--
-- TOC entry 4996 (class 2606 OID 32974)
-- Name: work_code work_code_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_code
    ADD CONSTRAINT work_code_pkey PRIMARY KEY (id);


--
-- TOC entry 4998 (class 2606 OID 32976)
-- Name: work_order work_order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order
    ADD CONSTRAINT work_order_pkey PRIMARY KEY (work_id);


--
-- TOC entry 5002 (class 2606 OID 32978)
-- Name: work_order_v2 work_order_v2_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_v2
    ADD CONSTRAINT work_order_v2_pkey PRIMARY KEY (id);


--
-- TOC entry 5000 (class 2606 OID 32980)
-- Name: work_order work_order_work_order_work_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order
    ADD CONSTRAINT work_order_work_order_work_code_key UNIQUE (work_order, work_code);


--
-- TOC entry 4974 (class 1259 OID 32981)
-- Name: idx_employee_group_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_group_id ON public.employee USING btree (group_id);


--
-- TOC entry 4979 (class 1259 OID 32982)
-- Name: idx_group_dept_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_group_dept_id ON public."group" USING btree (dept_id);


--
-- TOC entry 4980 (class 1259 OID 32983)
-- Name: idx_inspection_inspector_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inspection_inspector_id ON public.inspection USING btree (inspector_id);


--
-- TOC entry 4981 (class 1259 OID 32984)
-- Name: idx_inspection_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inspection_location_id ON public.inspection USING btree (location_id);


--
-- TOC entry 4982 (class 1259 OID 32985)
-- Name: idx_inspection_work_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inspection_work_id ON public.inspection USING btree (work_id);


--
-- TOC entry 5003 (class 2606 OID 32986)
-- Name: employee employee_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_group_id_fkey FOREIGN KEY (group_id) REFERENCES public."group"(group_id) ON DELETE RESTRICT;


--
-- TOC entry 5008 (class 2606 OID 32991)
-- Name: inspection_v2 fk_construction_item_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspection_v2
    ADD CONSTRAINT fk_construction_item_id FOREIGN KEY (construction_item_id) REFERENCES public.construction_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5009 (class 2606 OID 32996)
-- Name: inspection_v2 fk_inspector_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspection_v2
    ADD CONSTRAINT fk_inspector_id FOREIGN KEY (inspector_id) REFERENCES public.employee(emp_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5010 (class 2606 OID 33001)
-- Name: inspection_v2 fk_location_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspection_v2
    ADD CONSTRAINT fk_location_id FOREIGN KEY (location_id) REFERENCES public.location_v2(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5011 (class 2606 OID 33006)
-- Name: inspection_v2 fk_others_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspection_v2
    ADD CONSTRAINT fk_others_id FOREIGN KEY (others_id) REFERENCES public.others(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5012 (class 2606 OID 33011)
-- Name: inspection_v2 fk_work_code_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspection_v2
    ADD CONSTRAINT fk_work_code_id FOREIGN KEY (work_code_id) REFERENCES public.work_code(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5013 (class 2606 OID 33016)
-- Name: inspection_v2 fk_work_order_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspection_v2
    ADD CONSTRAINT fk_work_order_id FOREIGN KEY (work_order_id) REFERENCES public.work_order_v2(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5004 (class 2606 OID 33021)
-- Name: group group_dept_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_dept_id_fkey FOREIGN KEY (dept_id) REFERENCES public.department(dept_id) ON DELETE RESTRICT;


--
-- TOC entry 5005 (class 2606 OID 33026)
-- Name: inspection inspection_inspector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspection
    ADD CONSTRAINT inspection_inspector_id_fkey FOREIGN KEY (inspector_id) REFERENCES public.employee(emp_id) ON DELETE RESTRICT;


--
-- TOC entry 5006 (class 2606 OID 33031)
-- Name: inspection inspection_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspection
    ADD CONSTRAINT inspection_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(loc_id) ON DELETE RESTRICT;


--
-- TOC entry 5007 (class 2606 OID 33036)
-- Name: inspection inspection_work_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspection
    ADD CONSTRAINT inspection_work_id_fkey FOREIGN KEY (work_id) REFERENCES public.work_order(work_id) ON DELETE RESTRICT;


-- Completed on 2026-03-08 18:45:41

--
-- PostgreSQL database dump complete
--

\unrestrict xWTaXm0PLh5lEtcN6fkDDxRpMepshq0vWiWh9931WhEtFFJ4qylOwoJ6WIR7kbN

