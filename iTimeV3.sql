--
-- PostgreSQL database dump
--

\restrict 1bg4kcrqd3RfgesSDyW1qbcb0G6z4D4sXxqgFflupUNcdBmeMwvE2KCuxCaJGX9

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-03-08 18:55:25

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
-- TOC entry 5161 (class 0 OID 32831)
-- Dependencies: 220
-- Data for Name: construction_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.construction_item OVERRIDING SYSTEM VALUE VALUES (1, 'Piping');
INSERT INTO public.construction_item OVERRIDING SYSTEM VALUE VALUES (2, 'Welding');
INSERT INTO public.construction_item OVERRIDING SYSTEM VALUE VALUES (3, 'Cable Pull');
INSERT INTO public.construction_item OVERRIDING SYSTEM VALUE VALUES (4, 'Foundation');
INSERT INTO public.construction_item OVERRIDING SYSTEM VALUE VALUES (5, 'Rebar Installation');
INSERT INTO public.construction_item OVERRIDING SYSTEM VALUE VALUES (6, 'Formworks');
INSERT INTO public.construction_item OVERRIDING SYSTEM VALUE VALUES (7, 'Masonry');
INSERT INTO public.construction_item OVERRIDING SYSTEM VALUE VALUES (8, 'Roofing');
INSERT INTO public.construction_item OVERRIDING SYSTEM VALUE VALUES (9, 'Waterproofing');
INSERT INTO public.construction_item OVERRIDING SYSTEM VALUE VALUES (10, 'Painting');
INSERT INTO public.construction_item OVERRIDING SYSTEM VALUE VALUES (11, 'Finishing');
INSERT INTO public.construction_item OVERRIDING SYSTEM VALUE VALUES (12, 'Landscaping');


--
-- TOC entry 5163 (class 0 OID 32838)
-- Dependencies: 222
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.department VALUES ('43092d98-1d7d-44ca-84bb-23aa50bde2ee', 'Operations', '2026-01-16 06:40:25.358004+08');
INSERT INTO public.department VALUES ('34d67940-8808-483c-8d5e-c4ed1a5d435e', 'Quality Assurance', '2026-01-16 06:40:25.358004+08');


--
-- TOC entry 5164 (class 0 OID 32848)
-- Dependencies: 223
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.employee VALUES (6, 'Sean', 'Pactol', 'seanpactol@company.com', '$2b$10$bTfdzgwNuhSx4msj0HacXeY6ghYKxvbGztx52HdD7rhpnKw4gnrt2', '3ce97097-0037-4020-b5ec-5f684f010eb9', '2026-01-20 08:40:32.195066+08', NULL);
INSERT INTO public.employee VALUES (10, 'Sample', 'Test', 'sample.test@company.com', '$2b$10$OwDaLZJ2z4EmooHHuT6IG.PQPdlIf2VOLEVZfzABbM54FDiAhsJYK', '3400e634-ea2f-440b-be93-4db41effe2c8', '2026-01-20 13:32:14.932502+08', 'User');
INSERT INTO public.employee VALUES (1, 'Paolo', 'Limbaga', 'paolo.lim@company.com', '$2b$10$jJx738FpseZtU1hyKG8cLOs0JsQrC1sjtcqUSt6gLAkIjKjP9BJkC', '3ce97097-0037-4020-b5ec-5f684f010eb9', '2026-01-16 06:40:25.358004+08', 'Admin');
INSERT INTO public.employee VALUES (542, 'Edric Jay', 'Rivas', 'rivas-cmpy@company.com', '$2b$10$pGNlChnwOjqd/YdD0NY1cO3neo9VCiEcSm4i4x7e1EjRIox7tS0dK', '3ce97097-0037-4020-b5ec-5f684f010eb9', '2026-02-17 06:46:19.747754+08', 'Admin');
INSERT INTO public.employee VALUES (543, '543', 'Test', 'paolo.lim2@company.com', '$2b$10$b7Ty/sUQs8SYdtDVQF4EkOmTSn/d5yrE6HrhCgLZHd2Kczspw.1yC', '9c284123-aeee-42b1-af6c-7955e1472c8a', '2026-02-20 08:26:01.509007+08', 'Admin');
INSERT INTO public.employee VALUES (2, 'Lea', 'Garcia', 'lea.garcia@company.com', '$2b$10$jJx738FpseZtU1hyKG8cLOs0JsQrC1sjtcqUSt6gLAkIjKjP9BJkC', '9c284123-aeee-42b1-af6c-7955e1472c8a', '2026-01-16 06:40:25.358004+08', 'User');
INSERT INTO public.employee VALUES (3, 'Jin', 'Dela Cruz', 'jin.dc@company.com', '$2b$10$jJx738FpseZtU1hyKG8cLOs0JsQrC1sjtcqUSt6gLAkIjKjP9BJkC', '3400e634-ea2f-440b-be93-4db41effe2c8', '2026-01-16 06:40:25.358004+08', 'Admin');
INSERT INTO public.employee VALUES (4, 'Mark', 'Santos', 'mark.santos@company.com', '$2b$10$jJx738FpseZtU1hyKG8cLOs0JsQrC1sjtcqUSt6gLAkIjKjP9BJkC', 'c28b6a58-b21b-40e1-8358-60f4fe25bbf1', '2026-01-16 06:40:25.358004+08', 'User');
INSERT INTO public.employee VALUES (5, 'Ana Liza', 'Reyes', 'analiza.reyes@company.com', '$2b$10$jJx738FpseZtU1hyKG8cLOs0JsQrC1sjtcqUSt6gLAkIjKjP9BJkC', 'c28b6a58-b21b-40e1-8358-60f4fe25bbf1', '2026-01-16 06:40:25.358004+08', 'Admin');
INSERT INTO public.employee VALUES (123123, '123', '123', 'edricjayrivas123@gmail.com', '$2b$10$QAMV/7iodJ6mEgascbY9aOHYQ5u6BPEeqcJzTD8RWo7sGuAwUhBIS', '3ce97097-0037-4020-b5ec-5f684f010eb9', '2026-03-07 15:58:55.613293+08', 'Admin');
INSERT INTO public.employee VALUES (12, 'Edric', 'Rivas', 'edric.rivas@company.com', '$2b$10$pYHgp3JPMY6VDim9B6eySO43q6U8OO3OhtDfqA8WNDNZ5BX9zQ9dK', '3ce97097-0037-4020-b5ec-5f684f010eb9', '2026-01-30 08:59:29.151387+08', 'Admin');


--
-- TOC entry 5165 (class 0 OID 32861)
-- Dependencies: 224
-- Data for Name: group; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."group" VALUES ('3ce97097-0037-4020-b5ec-5f684f010eb9', 'Ops - Central', '43092d98-1d7d-44ca-84bb-23aa50bde2ee', '2026-01-16 06:40:25.358004+08');
INSERT INTO public."group" VALUES ('9c284123-aeee-42b1-af6c-7955e1472c8a', 'Ops - South', '43092d98-1d7d-44ca-84bb-23aa50bde2ee', '2026-01-16 06:40:25.358004+08');
INSERT INTO public."group" VALUES ('3400e634-ea2f-440b-be93-4db41effe2c8', 'Ops - North', '43092d98-1d7d-44ca-84bb-23aa50bde2ee', '2026-01-16 06:40:25.358004+08');
INSERT INTO public."group" VALUES ('c28b6a58-b21b-40e1-8358-60f4fe25bbf1', 'QA - Field', '34d67940-8808-483c-8d5e-c4ed1a5d435e', '2026-01-16 06:40:25.358004+08');
INSERT INTO public."group" VALUES ('b12f4629-bb8d-4061-85e0-00faf1303d52', 'QA - Incoming', '34d67940-8808-483c-8d5e-c4ed1a5d435e', '2026-01-16 06:40:25.358004+08');


--
-- TOC entry 5166 (class 0 OID 32872)
-- Dependencies: 225
-- Data for Name: inspection; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.inspection VALUES ('b759bf18-e435-4e8e-b83d-0c9d1bf4cff4', 5, '2026-01-06 06:40:25.358004+08', 45, 'Inspection', 'f135b15e-659e-40ec-a31a-a590b1c76524', '87536321-188c-4589-bac3-db8979e6ed00', '2026-01-16 06:40:25.358004+08');
INSERT INTO public.inspection VALUES ('61c28209-870c-431b-aa58-8058242fbf52', 4, '2026-01-07 06:40:25.358004+08', 30, 'Receiving', 'f135b15e-659e-40ec-a31a-a590b1c76524', '87536321-188c-4589-bac3-db8979e6ed00', '2026-01-16 06:40:25.358004+08');
INSERT INTO public.inspection VALUES ('185ef1d6-ddcd-42a7-9c62-3a9d14ffe868', 3, '2026-01-09 06:40:25.358004+08', 40, 'Inspection', '029ac3ae-d7f0-40f0-a2cb-4721e8b57b51', '4cff1070-a0d9-4b72-9ac6-d96e29d4a976', '2026-01-16 06:40:25.358004+08');
INSERT INTO public.inspection VALUES ('03ec4e36-b783-4428-9998-80d613f45c86', 2, '2026-01-10 06:40:25.358004+08', 35, 'Receiving', '029ac3ae-d7f0-40f0-a2cb-4721e8b57b51', '87536321-188c-4589-bac3-db8979e6ed00', '2026-01-16 06:40:25.358004+08');
INSERT INTO public.inspection VALUES ('94dfcaf1-c101-4f9b-af73-2785419ed21e', 1, '2026-01-11 06:40:25.358004+08', 50, 'Inspection', 'c0e27ff5-2795-4c95-978a-18dd99a16389', '4cff1070-a0d9-4b72-9ac6-d96e29d4a976', '2026-01-16 06:40:25.358004+08');
INSERT INTO public.inspection VALUES ('de60b5d8-bf61-46a0-8fc1-6ebeefc3c8bb', 4, '2026-01-12 06:40:25.358004+08', 25, 'Receiving', 'd626b362-ebc8-4d4f-9a1f-3b0ad617e182', '87536321-188c-4589-bac3-db8979e6ed00', '2026-01-16 06:40:25.358004+08');
INSERT INTO public.inspection VALUES ('016b2923-d858-44b3-bb9c-0603d53132ec', 5, '2026-01-13 06:40:25.358004+08', 55, 'Inspection', 'd626b362-ebc8-4d4f-9a1f-3b0ad617e182', '4cff1070-a0d9-4b72-9ac6-d96e29d4a976', '2026-01-16 06:40:25.358004+08');
INSERT INTO public.inspection VALUES ('ff570f39-34b1-4075-a912-48989cd7d971', 3, '2026-01-14 06:40:25.358004+08', 45, 'Inspection', 'd626b362-ebc8-4d4f-9a1f-3b0ad617e182', '4cff1070-a0d9-4b72-9ac6-d96e29d4a976', '2026-01-16 06:40:25.358004+08');
INSERT INTO public.inspection VALUES ('4b807ec6-ff01-4e17-b821-0240450b1172', 2, '2026-01-15 06:40:25.358004+08', 35, 'Inspection', 'db945b33-d851-4abb-8336-f026b3a9e082', '87536321-188c-4589-bac3-db8979e6ed00', '2026-01-16 06:40:25.358004+08');
INSERT INTO public.inspection VALUES ('74cdb91b-e081-408c-bbb1-b16fb21ff762', 5, '2026-01-08 06:40:25.358004+08', 60, 'Inspection', '13b0f0a3-bcea-42b2-b0ee-ff4f2bcd35b8', '4cff1070-a0d9-4b72-9ac6-d96e29d4a976', '2026-01-16 06:40:25.358004+08');


--
-- TOC entry 5167 (class 0 OID 32886)
-- Dependencies: 226
-- Data for Name: inspection_v2; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (354, 12, 11, 18, 5, 1, '2026-02-10 08:17:26.194111+08', 2, '2026-02-10', 'Inspection', '2026-02-10 12:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (356, 6, 28, 17, 3, 5, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (358, 10, 16, 23, 3, 4, '2026-02-10 08:17:26.194111+08', 2, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (440, 12, 1, 2, 4, 8, '2026-03-08 17:06:50.426+08', 1, '2026-03-08', 'Inspection', '2026-03-08 17:10:38.363+08', '2026-03-08 18:28:21.24+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (360, 4, 4, 15, 12, 3, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (363, 5, 9, 17, 12, 9, '2026-02-10 08:17:26.194111+08', 2, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (365, 2, 26, 12, 9, 4, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (438, 12, 2, 12, 3, 9, '2026-03-08 15:04:02.534+08', 2, '2026-03-08', 'Inspection', '2026-03-08 15:04:02.521+08', '2026-03-08 15:04:02.521+08', 'active');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (400, 2, 15, 11, 12, 10, '2026-02-10 08:17:26.194111+08', 2, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (403, 2, 15, 11, 12, 10, '2026-02-10 08:17:26.194111+08', 2, '2026-02-11', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (404, 5, 5, 11, 9, 8, '2026-02-10 08:17:26.194111+08', 2, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (406, 10, 27, 10, 10, 3, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (407, 5, 11, 8, 9, 2, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (439, 12, 1, 2, 4, 8, '2026-03-08 15:23:22.755+08', 2, '2026-03-08', 'Inspection', '2026-03-08 16:41:41.878+08', '2026-03-08 17:07:07.887+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (408, 12, 4, 13, 12, 7, '2026-02-10 08:17:26.194111+08', 1, '2026-02-11', 'Inspection', '2026-02-11 06:00:00+08', '2026-02-11 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (409, 1, 25, 10, 3, 5, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (411, 12, 27, 14, 1, 3, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (412, 2, 3, 12, 11, 8, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (413, 10, 8, 20, 9, 1, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (414, 2, 2, 12, 3, 9, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (415, 5, 12, 7, 10, 8, '2026-02-10 08:17:26.194111+08', 2, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (416, 3, 19, 16, 10, 4, '2026-02-10 08:17:26.194111+08', 2, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (417, 2, 19, 22, 12, 6, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (367, 10, 20, 19, 6, 9, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (370, 12, 12, 16, 9, 8, '2026-02-10 08:17:26.194111+08', 2, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (371, 3, 17, 11, 5, 9, '2026-02-10 08:17:26.194111+08', 2, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (378, 4, 18, 3, 12, 9, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (382, 5, 27, 18, 8, 2, '2026-02-10 08:17:26.194111+08', 2, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (384, 10, 22, 14, 8, 5, '2026-02-10 08:17:26.194111+08', 2, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (362, 2, 7, 13, 7, 6, '2026-02-10 08:17:26.194111+08', 2, '2026-01-28', 'Inspection', '2026-01-28 06:00:00+08', '2026-01-28 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (355, 6, 19, 10, 4, 4, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (359, 6, 12, 9, 6, 1, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (361, 6, 3, 22, 3, 9, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (366, 4, 11, 4, 11, 9, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (369, 2, 18, 2, 6, 6, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (373, 12, 23, 10, 1, 7, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (374, 6, 22, 5, 3, 3, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (379, 5, 27, 8, 3, 2, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (386, 4, 12, 3, 7, 4, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (389, 10, 24, 2, 3, 9, '2026-02-10 08:17:26.194111+08', 2, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (391, 2, 28, 18, 5, 10, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (392, 1, 26, 9, 3, 8, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (387, 3, 19, 13, 12, 9, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (388, 10, 27, 1, 4, 4, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (390, 4, 22, 11, 6, 4, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (418, 3, 27, 6, 12, 4, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (419, 12, 27, 14, 1, 3, '2026-02-10 08:17:26.194111+08', 1, '2026-02-11', 'Receiving', '2026-02-11 06:00:00+08', '2026-02-11 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (420, 6, 16, 10, 12, 10, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (421, 6, 26, 16, 11, 8, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (423, 6, 7, 6, 5, 8, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (424, 6, 4, 11, 12, 10, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (427, 3, 18, 1, 10, 2, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (428, 12, 21, 16, 4, 9, '2026-02-10 08:17:26.194111+08', 1, '2026-02-15', 'Inspection', '2026-02-15 12:00:00+08', '2026-02-15 14:37:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (431, 12, 1, 2, 4, 8, '2026-02-27 09:36:27.934+08', 2, '2026-03-02', 'Inspection', '2026-03-05 06:00:00+08', '2026-03-05 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (432, 12, 1, 2, 4, 8, '2026-02-27 09:39:11.59+08', 3, '2026-03-01', 'Inspection', '2026-03-05 06:00:00+08', '2026-03-05 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (433, 12, 1, 2, 4, 8, '2026-02-27 09:43:43.12+08', 2, '2026-02-27', 'Inspection', '2026-02-27 06:00:00+08', '2026-02-27 14:43:43.091+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (434, 12, 1, 2, 4, 8, '2026-02-27 09:48:09.365+08', 3, '2026-03-05', 'Inspection', '2026-03-05 06:00:00+08', '2026-03-05 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (357, 12, 21, 16, 4, 9, '2026-02-10 08:17:26.194111+08', 1, '2026-02-15', 'Inspection', '2026-02-15 06:00:00+08', '2026-02-15 11:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (353, 12, 11, 18, 5, 1, '2026-02-10 08:17:26.194111+08', 1, '2026-01-10', 'Inspection', '2026-01-10 06:00:00+08', '2026-01-10 11:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (394, 10, 7, 17, 10, 7, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (395, 1, 24, 16, 7, 6, '2026-02-10 08:17:26.194111+08', 2, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (397, 5, 10, 1, 5, 3, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (398, 12, 4, 13, 12, 7, '2026-02-10 08:17:26.194111+08', 1, '2026-02-10', 'Inspection', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (375, 12, 12, 16, 9, 8, '2026-02-10 08:17:26.194111+08', 3, '2026-02-11', 'Receiving', '2026-02-11 06:00:00+08', '2026-02-11 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (399, 1, 25, 13, 1, 7, '2026-02-10 08:17:26.194111+08', 2, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');
INSERT INTO public.inspection_v2 OVERRIDING SYSTEM VALUE VALUES (393, 5, 1, 2, 4, 8, '2026-02-10 08:17:26.194111+08', 3, '2026-02-10', 'Receiving', '2026-02-10 06:00:00+08', '2026-02-10 15:00:00+08', 'ended');


--
-- TOC entry 5169 (class 0 OID 32899)
-- Dependencies: 228
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.location VALUES ('87536321-188c-4589-bac3-db8979e6ed00', 'Warehouse A', '2026-01-16 06:40:25.358004+08');
INSERT INTO public.location VALUES ('4cff1070-a0d9-4b72-9ac6-d96e29d4a976', 'Site B', '2026-01-16 06:40:25.358004+08');
INSERT INTO public.location VALUES ('84fe9662-a1aa-489d-b216-49fa7f85bea1', 'Warehouse B', '2026-01-20 14:53:18.857443+08');


--
-- TOC entry 5170 (class 0 OID 32909)
-- Dependencies: 229
-- Data for Name: location_v2; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.location_v2 OVERRIDING SYSTEM VALUE VALUES (1, 'Warehouse A');
INSERT INTO public.location_v2 OVERRIDING SYSTEM VALUE VALUES (2, 'Warehouse B');
INSERT INTO public.location_v2 OVERRIDING SYSTEM VALUE VALUES (3, 'Site B');


--
-- TOC entry 5172 (class 0 OID 32916)
-- Dependencies: 231
-- Data for Name: others; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.others OVERRIDING SYSTEM VALUE VALUES (1, '0');
INSERT INTO public.others OVERRIDING SYSTEM VALUE VALUES (2, '1');
INSERT INTO public.others OVERRIDING SYSTEM VALUE VALUES (3, '2');
INSERT INTO public.others OVERRIDING SYSTEM VALUE VALUES (4, '3');
INSERT INTO public.others OVERRIDING SYSTEM VALUE VALUES (5, '4');
INSERT INTO public.others OVERRIDING SYSTEM VALUE VALUES (6, '5');
INSERT INTO public.others OVERRIDING SYSTEM VALUE VALUES (7, '6');
INSERT INTO public.others OVERRIDING SYSTEM VALUE VALUES (8, '7');
INSERT INTO public.others OVERRIDING SYSTEM VALUE VALUES (9, '7');
INSERT INTO public.others OVERRIDING SYSTEM VALUE VALUES (10, '7');


--
-- TOC entry 5174 (class 0 OID 32921)
-- Dependencies: 233
-- Data for Name: work_code; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (8, 5);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (9, 6);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (10, 7);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (11, 8);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (12, 9);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (13, 10);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (14, 11);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (15, 12);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (16, 13);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (17, 14);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (18, 15);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (19, 16);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (20, 17);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (21, 18);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (22, 19);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (23, 20);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (2, 60);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (3, 62);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (4, 1);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (5, 2);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (6, 3);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (7, 4);
INSERT INTO public.work_code OVERRIDING SYSTEM VALUE VALUES (1, 101);


--
-- TOC entry 5176 (class 0 OID 32926)
-- Dependencies: 235
-- Data for Name: work_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.work_order VALUES ('f135b15e-659e-40ec-a31a-a590b1c76524', 'WO-0001', 1001, 'Piping Install', 0, '2026-01-16 06:40:25.358004+08');
INSERT INTO public.work_order VALUES ('029ac3ae-d7f0-40f0-a2cb-4721e8b57b51', 'WO-0002', 1002, 'Electrical Cable Pull', 1, '2026-01-16 06:40:25.358004+08');
INSERT INTO public.work_order VALUES ('c0e27ff5-2795-4c95-978a-18dd99a16389', 'WO-0003', 1003, 'Concrete Pour', 0, '2026-01-16 06:40:25.358004+08');
INSERT INTO public.work_order VALUES ('d626b362-ebc8-4d4f-9a1f-3b0ad617e182', 'WO-0004', 1004, 'HVAC Ducting', 2, '2026-01-16 06:40:25.358004+08');
INSERT INTO public.work_order VALUES ('db945b33-d851-4abb-8336-f026b3a9e082', 'WO-0005', 1005, 'Steel Erection', 0, '2026-01-16 06:40:25.358004+08');
INSERT INTO public.work_order VALUES ('13b0f0a3-bcea-42b2-b0ee-ff4f2bcd35b8', 'WO-0001', 1002, 'P-Trap Installation', 2, '2026-02-03 08:20:05.142226+08');


--
-- TOC entry 5177 (class 0 OID 32940)
-- Dependencies: 236
-- Data for Name: work_order_v2; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (1, 'WO-A');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (2, 'WO-B');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (3, 'WO-C');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (4, 'WO-V2-0001');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (5, 'WO-V2-0002');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (6, 'WO-V2-0003');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (7, 'WO-V2-0004');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (8, 'WO-V2-0005');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (9, 'WO-V2-0006');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (10, 'WO-V2-0007');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (11, 'WO-V2-0008');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (12, 'WO-V2-0009');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (13, 'WO-V2-0010');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (14, 'WO-V2-0011');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (15, 'WO-V2-0012');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (16, 'WO-V2-0013');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (17, 'WO-V2-0014');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (18, 'WO-V2-0015');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (19, 'WO-V2-0016');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (20, 'WO-V2-0017');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (21, 'WO-V2-0018');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (22, 'WO-V2-0019');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (23, 'WO-V2-0020');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (24, 'WO-V2-0021');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (25, 'WO-V2-0022');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (26, 'WO-V2-0023');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (27, 'WO-V2-0024');
INSERT INTO public.work_order_v2 OVERRIDING SYSTEM VALUE VALUES (28, 'WO-V2-0025');


--
-- TOC entry 5185 (class 0 OID 0)
-- Dependencies: 221
-- Name: construction_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.construction_item_id_seq', 12, true);


--
-- TOC entry 5186 (class 0 OID 0)
-- Dependencies: 227
-- Name: inspection_v2_inspection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inspection_v2_inspection_id_seq', 440, true);


--
-- TOC entry 5187 (class 0 OID 0)
-- Dependencies: 230
-- Name: location_v2_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.location_v2_id_seq', 3, true);


--
-- TOC entry 5188 (class 0 OID 0)
-- Dependencies: 232
-- Name: others_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.others_id_seq', 13, true);


--
-- TOC entry 5189 (class 0 OID 0)
-- Dependencies: 234
-- Name: work_code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.work_code_id_seq', 23, true);


--
-- TOC entry 5190 (class 0 OID 0)
-- Dependencies: 237
-- Name: work_order_v2_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.work_order_v2_id_seq', 28, true);


-- Completed on 2026-03-08 18:55:25

--
-- PostgreSQL database dump complete
--

\unrestrict 1bg4kcrqd3RfgesSDyW1qbcb0G6z4D4sXxqgFflupUNcdBmeMwvE2KCuxCaJGX9

