CREATE DATABASE wedding;


CREATE TABLE dim_banquet(
    id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(255),
    category VARCHAR(255),
    banquet_district VARCHAR(255),
    max_pax INTEGER,
    min_charge INTEGER
);

CREATE TABLE dim_date(
    id SERIAL PRIMARY KEY,
    full_date DATE, 
    year INTEGER,
    month INTEGER,
    day INTEGER,
    quarter SMALLINT,
    day_of_week_num SMALLINT,
    day_of_week_eng_abbr VARCHAR(3),
    festival VARCHAR(255),  
    is_good_days VARCHAR(255),
    is_weekend VARCHAR(255),
    is_public_holiday VARCHAR(255),
    is_wedding_expo VARCHAR(255)
);

CREATE UNIQUE INDEX date_unique_idx on dim_date (year,month,day)

CREATE TABLE dim_user(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    phone VARCHAR(255),
    gender VARCHAR(1),
    residence VARCHAR(255)
);



CREATE TABLE fact_event_store(
    id SERIAL PRIMARY KEY,
    expenditure FLOAT,
    budget_cat VARCHAR(255),
    budget_description VARCHAR(255),
    score FLOAT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES dim_user(id),
    date_id INTEGER,
    FOREIGN KEY (date_id) REFERENCES dim_date(id)
);


CREATE TABLE fact_expenditure_per_cat(
    id SERIAL PRIMARY KEY,
    wedding_event_id INTEGER,
    budget INTEGER,
    expenditure_per_cat FLOAT,
    budget_cat VARCHAR(255),
    transaction_times INTEGER,
    wedding_created_at_date_id  INTEGER,
    FOREIGN KEY (wedding_created_at_date_id) REFERENCES dim_date(id),
    wedding_date_id INTEGER,
    FOREIGN KEY (wedding_date_id) REFERENCES dim_date(id)
);

-- fact_expenditure_per_cat + dim_user + dim_date
CREATE TABLE staging_expenditure_per_cat(
    id SERIAL PRIMARY KEY,
    wedding_event_id INTEGER,
    budget INTEGER,
    expenditure_per_cat FLOAT,
    budget_cat VARCHAR,
    transaction_times INTEGER,
    wedding_created_at_date DATE,
    wedding_date DATE
);

CREATE TABLE fact_wedding_event(
    id SERIAL PRIMARY KEY,
    wedding_event_id INTEGER,
    pax INTEGER,
    banquet_vendor_id INTEGER,
    FOREIGN KEY (banquet_id) REFERENCES dim_banquet(id),
    wedding_created_at_date_id  INTEGER,
    FOREIGN KEY (wedding_created_at_date_id) REFERENCES dim_date(id),
    wedding_date_id INTEGER,
    FOREIGN KEY (wedding_date_id) REFERENCES dim_date(id)
);

-- fact_wedding_event  
CREATE TABLE staging_wedding_event(
    id SERIAL PRIMARY KEY,
    wedding_event_id INTEGER,
    pax INTEGER,
    vendor_name VARCHAR(255),
    wedding_created_at_date DATE,
    wedding_date DATE
);


CREATE TABLE event_store_budget_planning(
    id SERIAL PRIMARY KEY,
    avg_exp FLOAT,
    budget_cat_id INTEGER,
    budget_description_id INTEGER,
    description VARCHAR,
    avg_score FLOAT
);


CREATE OR REPLACE FUNCTION insert_fact_wedding_event() RETURNS trigger AS $$
    DECLARE
        banquet_id INTEGER;
        wedding_created_at_date_id INTEGER;
        wedding_date_id INTEGER;
    SET
        banquet_id = (SELECT id FROM dim_banquet WHERE vendor_name = NEW.vendor_name);
        wedding_created_at_date_id = (SELECT id FROM dim_date WHERE full_date = NEW.wedding_created_at_date);
        wedding_date_id = (SELECT id FROM dim_date WHERE full_date = NEW.wedding_date);
    BEGIN
        INSERT INTO fact_wedding_event (wedding_event_id, pax, banquet_id, wedding_created_at_date_id, wedding_date_id) VALUES
            (NEW.wedding_event_id, NEW.pax, banquet_id, wedding_created_at_date_id, wedding_date_id);

        return NEW;
    END
$$ LANGUAGE plpgsql;

CREATE TRIGGER staging_wedding_trigger AFTER INSERT ON staging_wedding_event
FOR EACH ROW EXECUTE PROCEDURE insert_fact_wedding_event();


CREATE OR REPLACE FUNCTION insert_fact_expenditure_per_cat() RETURNS trigger AS $$
    DECLARE 
         wedding_created_at_date_id INTEGER = (SELECT id FROM dim_date WHERE full_date = NEW.wedding_created_at_date);
         wedding_date_id INTEGER = (SELECT id FROM dim_date WHERE full_date = NEW.wedding_date);        

    BEGIN
        INSERT INTO fact_expenditure_per_cat (
            wedding_event_id, budget,expenditure_per_cat, budget_cat, transaction_times, wedding_created_at_date_id, wedding_date_id
            ) VALUES
             (NEW.wedding_event_id, NEW.budget,NEW.expenditure_per_cat, NEW.budget_cat, NEW.transaction_times, wedding_created_at_date_id, wedding_date_id);

        RETURN NEW;
    END
$$ LANGUAGE plpgsql;

-- CREATE OR REPLACE FUNCTION insert_fact_expenditure_per_cat() RETURNS trigger AS $$
--     DECLARE 
--         wedding_created_at_date_id INTEGER;
--         wedding_date_id INTEGER = (SELECT id FROM dim_date WHERE full_date = NEW.wedding_date);
--     BEGIN
--         SELECT id 
--             FROM dim_date 
--             WHERE full_date = NEW.wedding_created_at_date
--             INTO wedding_created_at_date_id; 

--         INSERT INTO fact_expenditure_per_cat (
--             wedding_event_id, expenditure_per_cat, budget_cat, transaction_times, wedding_created_at_date_id, wedding_date_id
--             ) VALUES
--              (NEW.wedding_event_id, NEW.expenditure_per_cat, NEW.budget_cat, NEW.transaction_times, wedding_created_at_date_id, wedding_date_id);

--         RETURN NEW;
--     END
-- $$ LANGUAGE plpgsql;

CREATE TRIGGER staging_expenditure_per_cat_trigger AFTER INSERT ON staging_expenditure_per_cat
FOR EACH ROW EXECUTE PROCEDURE insert_fact_expenditure_per_cat();


    -- SET  @ wedding_created_at_date_id= (SELECT id FROM dim_date WHERE full_date = NEW.wedding_created_at_date);
    -- SET  @ wedding_date_id= (SELECT id FROM dim_date WHERE full_date = NEW.wedding_date);


    -- DECLARE
    --     user_id INTEGER;
    -- BEGIN
    --     SELECT id FROM dim_user WHERE phone = NEW.phone;
    --       If NOT FOUND THEN 
    --          INSERT INTO dim_user (email, phone,  gender, residence) VALUES (NEW.email, NEW.phone, NEW.gender, NEW.residence) RETURNING id INTO user_id;
    --       ELSE
    --          SET user_id = (SELECT id from dim_user WHERE phone = NEW.phone);
    --       END IF; 
