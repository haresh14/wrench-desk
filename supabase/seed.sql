-- Replace `6bc5b5a9-02af-4d15-9dd5-811be4867d9a` with actual user_id that exists in database. If there is user then signup first and then use that user's id and then run this script

-- Seed data for customers
INSERT INTO customers (name, email, phone, address, status, user_id)
VALUES 
('John Smith', 'john@example.com', '(555) 123-4567', '123 Maple St, Springfield', 'Active', '6bc5b5a9-02af-4d15-9dd5-811be4867d9a'),
('Sarah Johnson', 'sarah@example.com', '(555) 987-6543', '456 Oak Ave, Riverside', 'Active', '6bc5b5a9-02af-4d15-9dd5-811be4867d9a'),
('Robert Brown', 'robert@example.com', '(555) 456-7890', '789 Pine Rd, Lakeside', 'Inactive', '6bc5b5a9-02af-4d15-9dd5-811be4867d9a'),
('Emily Davis', 'emily@example.com', '(555) 222-3333', '321 Elm St, Fairview', 'Active', '6bc5b5a9-02af-4d15-9dd5-811be4867d9a'),
('Michael Wilson', 'michael@example.com', '(555) 444-5555', '654 Birch Ln, Oakwood', 'Active', '6bc5b5a9-02af-4d15-9dd5-811be4867d9a');

-- Seed data for appointments
INSERT INTO appointments (customer_id, scheduled_time, duration, job_type, technician_name, status, user_id)
SELECT 
    id as customer_id,
    (CURRENT_DATE + interval '9 hours') as scheduled_time,
    '2 hours'::interval as duration,
    'HVAC Repair' as job_type,
    'Mike D.' as technician_name,
    'In Progress' as status,
    user_id
FROM customers WHERE email = 'john@example.com' AND user_id = '6bc5b5a9-02af-4d15-9dd5-811be4867d9a';

INSERT INTO appointments (customer_id, scheduled_time, duration, job_type, technician_name, status, user_id)
SELECT 
    id as customer_id,
    (CURRENT_DATE + interval '11 hours 30 minutes') as scheduled_time,
    '3 hours'::interval as duration,
    'Plumbing Install' as job_type,
    'Steve R.' as technician_name,
    'Scheduled' as status,
    user_id
FROM customers WHERE email = 'sarah@example.com' AND user_id = '6bc5b5a9-02af-4d15-9dd5-811be4867d9a';

INSERT INTO appointments (customer_id, scheduled_time, duration, job_type, technician_name, status, user_id)
SELECT 
    id as customer_id,
    (CURRENT_DATE + interval '14 hours') as scheduled_time,
    '1.5 hours'::interval as duration,
    'Electrical Inspection' as job_type,
    'Mike D.' as technician_name,
    'Scheduled' as status,
    user_id
FROM customers WHERE email = 'robert@example.com' AND user_id = '6bc5b5a9-02af-4d15-9dd5-811be4867d9a';

-- Seed data for invoices
INSERT INTO invoices (customer_id, amount, status, due_date, invoice_number, user_id)
SELECT 
    id as customer_id,
    450.00 as amount,
    'Paid' as status,
    (CURRENT_DATE - interval '5 days')::date as due_date,
    'INV-001' as invoice_number,
    user_id
FROM customers WHERE email = 'john@example.com' AND user_id = '6bc5b5a9-02af-4d15-9dd5-811be4867d9a';

INSERT INTO invoices (customer_id, amount, status, due_date, invoice_number, user_id)
SELECT 
    id as customer_id,
    1200.00 as amount,
    'Pending' as status,
    (CURRENT_DATE + interval '10 days')::date as due_date,
    'INV-002' as invoice_number,
    user_id
FROM customers WHERE email = 'sarah@example.com' AND user_id = '6bc5b5a9-02af-4d15-9dd5-811be4867d9a';

INSERT INTO invoices (customer_id, amount, status, due_date, invoice_number, user_id)
SELECT 
    id as customer_id,
    325.00 as amount,
    'Overdue' as status,
    (CURRENT_DATE - interval '2 days')::date as due_date,
    'INV-003' as invoice_number,
    user_id
FROM customers WHERE email = 'robert@example.com' AND user_id = '6bc5b5a9-02af-4d15-9dd5-811be4867d9a';

INSERT INTO invoices (customer_id, amount, status, due_date, invoice_number, user_id)
SELECT 
    id as customer_id,
    890.00 as amount,
    'Paid' as status,
    (CURRENT_DATE - interval '15 days')::date as due_date,
    'INV-004' as invoice_number,
    user_id
FROM customers WHERE email = 'emily@example.com' AND user_id = '6bc5b5a9-02af-4d15-9dd5-811be4867d9a';

-- Seed data for settings
INSERT INTO settings (company_name, business_address, service_areas, user_id)
VALUES 
('Acme Plumbing & HVAC', '123 Maple St, Springfield, IL 62704', 'Springfield, Riverside, Lakeside', '6bc5b5a9-02af-4d15-9dd5-811be4867d9a')
ON CONFLICT (user_id) DO NOTHING;
