-- =========================
-- SUPPLIERS
-- =========================
INSERT INTO suppliers (id, name, contact_email, phone) VALUES
(1, 'General Supplier', 'supplier@store.com', '000000000');

-- =========================
-- CATEGORIES
-- =========================
INSERT INTO categories (id, name, parent_category_id) VALUES
(1, 'Alcohol', NULL),
(2, 'Breakfast', NULL),
(3, 'Cheese and Dairy', NULL),
(4, 'Meat', NULL),
(5, 'Organic', NULL),
(6, 'Snacks', NULL),
(7, 'Seafood', NULL),
(8, 'Cleaning Supplies', NULL),
(9, 'Emergency Supplies', NULL),
(10, 'Health & Personal Care', NULL),
(11, 'Laundry', NULL),
(12, 'Paper & Plastic', NULL);

-- =========================
-- PRODUCTS
-- =========================
INSERT INTO products (id, name, description, price, image_url, is_active, category_id, supplier_id) VALUES
(1, 'Leoville Las Cases Wine Set', 'Luxury wine collection set', 3899.99, NULL, true, 1, 1),
(2, 'Chateau Calon Segur Gift Set', 'Premium wine gift set', 1199.99, NULL, true, 1, 1),
(3, 'Protein Bar Variety Pack', '20-count protein bars', 26.49, NULL, true, 2, 1),
(4, 'Granola Bars Pack', '64-count granola bars', 12.59, NULL, true, 2, 1),
(5, 'Mini Muffins Blueberry', '16-count muffins', 14.99, NULL, true, 2, 1),
(6, 'Rolled Oats 10lbs', 'Old fashioned oats', 8.79, NULL, true, 2, 1),
(7, 'Honey Bunches Cereal', 'Almond cereal', 7.39, NULL, true, 2, 1),
(8, 'Kerrygold Butter', 'Pure Irish butter', 19.28, NULL, true, 3, 1),
(9, 'Greek Yogurt', 'Organic yogurt', 8.50, NULL, true, 3, 1),
(10, 'Kraft American Cheese', 'Sliced cheese', 14.29, NULL, true, 3, 1),
(11, 'Organic Ground Beef', 'Grass-fed beef packs', 129.99, NULL, true, 4, 1),
(12, 'Angus Sirloin Steak', 'Premium steak cuts', 159.99, NULL, true, 4, 1),
(13, 'Japanese Wagyu Steak', 'A5 grade beef', 469.99, NULL, true, 4, 1),
(14, 'Organic Applesauce', '24-count pack', 12.99, NULL, true, 5, 1),
(15, 'Organic Olive Oil', '2L bottle', 20.99, NULL, true, 5, 1),
(16, 'Organic Peanut Butter', '28 oz jar', 11.69, NULL, true, 5, 1),
(17, 'OREO Variety Pack', '60-count cookies', 18.99, NULL, true, 6, 1),
(18, 'Goldfish Crackers', 'Cheddar snack pack', 15.99, NULL, true, 6, 1),
(19, 'Frito Lay Mix', '54-count chips', 23.49, NULL, true, 6, 1),
(20, 'Dungeness Crab Clusters', '10lbs seafood', 209.99, NULL, true, 7, 1),
(21, 'Wild Alaskan Salmon', '6-count portions', 52.99, NULL, true, 7, 1),
(22, 'Clorox Wipes', 'Disinfecting wipes pack', 17.99, NULL, true, 8, 1),
(23, 'Kitchen Trash Bags', '200-count bags', 19.99, NULL, true, 8, 1),
(24, 'Emergency Food Bucket', '150 servings', 89.99, NULL, true, 9, 1),
(25, '30-Day Food Supply', 'Emergency kit', 109.99, NULL, true, 9, 1),
(26, 'Electric Toothbrush', 'Rechargeable toothbrush', 69.99, NULL, true, 10, 1),
(27, 'Pain Relief Tablets', '400 gelcaps', 19.99, NULL, true, 10, 1),
(28, 'Tide Liquid Detergent', '152 loads', 24.99, NULL, true, 11, 1),
(29, 'Fabric Softener Sheets', '400-count', 10.99, NULL, true, 11, 1),
(30, 'Toilet Paper Rolls', '30 rolls pack', 7.99, NULL, true, 12, 1),
(31, 'Facial Tissue Pack', '12-pack tissues', 19.99, NULL, true, 12, 1);

-- =========================
-- INVENTORY
-- =========================
INSERT INTO inventory (id, product_id, quantity_in_stock, reorder_level, last_updated) VALUES
(1,1,50,10,CURRENT_TIMESTAMP),
(2,2,40,10,CURRENT_TIMESTAMP),
(3,3,100,20,CURRENT_TIMESTAMP),
(4,4,120,25,CURRENT_TIMESTAMP),
(5,5,60,15,CURRENT_TIMESTAMP),
(6,6,70,15,CURRENT_TIMESTAMP),
(7,7,80,20,CURRENT_TIMESTAMP),
(8,8,50,10,CURRENT_TIMESTAMP),
(9,9,90,20,CURRENT_TIMESTAMP),
(10,10,60,15,CURRENT_TIMESTAMP),
(11,11,30,5,CURRENT_TIMESTAMP),
(12,12,25,5,CURRENT_TIMESTAMP),
(13,13,10,2,CURRENT_TIMESTAMP),
(14,14,70,15,CURRENT_TIMESTAMP),
(15,15,65,15,CURRENT_TIMESTAMP),
(16,16,60,10,CURRENT_TIMESTAMP),
(17,17,100,20,CURRENT_TIMESTAMP),
(18,18,90,20,CURRENT_TIMESTAMP),
(19,19,80,20,CURRENT_TIMESTAMP),
(20,20,20,5,CURRENT_TIMESTAMP),
(21,21,30,5,CURRENT_TIMESTAMP),
(22,22,100,20,CURRENT_TIMESTAMP),
(23,23,120,25,CURRENT_TIMESTAMP),
(24,24,40,10,CURRENT_TIMESTAMP),
(25,25,35,10,CURRENT_TIMESTAMP),
(26,26,50,10,CURRENT_TIMESTAMP),
(27,27,60,15,CURRENT_TIMESTAMP),
(28,28,80,20,CURRENT_TIMESTAMP),
(29,29,90,20,CURRENT_TIMESTAMP),
(30,30,100,25,CURRENT_TIMESTAMP),
(31,31,110,25,CURRENT_TIMESTAMP);