select * from wedding_budget_list;
select * from dim_banquet;
select * from dim_date;

insert into wedding_event (wedding_name, wedding_date, pax, budget, banquet_vendor_id, church_id) values('Gipson&Dennis', '2022-10-13'::DATE, 1000, 500000, 3, 19);

insert into wedding_event (wedding_name, wedding_date, pax, budget, banquet_vendor_id, church_id) values('Matt&Billy', '13-OCT-2022'::DATE, 120, 500000, 54, 61);

insert into wedding_event (wedding_name, wedding_date, pax, budget, banquet_vendor_id, church_id) values('Matt&Billy', '25 Jul 2023'::DATE, 87, 100000, 23, 50);

insert into wedding_budget_list(wedding_event_id,budget_cat_id,budget_description_id,description,expenditure) VALUES(1,4,22,'背部磨砂',1000);

insert into wedding_budget_list(wedding_event_id,budget_cat_id,budget_description_id,description,expenditure) VALUES(1,4,21,'Facial',2000);

insert into wedding_budget_list(wedding_event_id,budget_cat_id,budget_description_id,description,expenditure) VALUES(2,5,31,'伴郎伴娘兄弟姊妹利是',5000);


truncate table wedding_budget_list restart identity cascade;

insert into wedding_user (wedding_event_id,user_id,role_id)values(1,2,1);
insert into wedding_user (wedding_event_id,user_id,role_id)values(1,1,2);
insert into wedding_user (wedding_event_id,user_id,role_id)values(1,3,4);
insert into wedding_user (wedding_event_id,user_id,role_id)values(2,2,1);
insert into wedding_user (wedding_event_id,user_id,role_id)values(2,5,2);
