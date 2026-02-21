-- # SEED DATA FOR TECHMAROC
-- 1. CATEGORIES
INSERT INTO categories (id, name, icon, sub_categories, filters) VALUES
('pc-gamer', 'PC Gamer', 'Monitor', 
'[{"id": "starter", "name": "PC Gamer Starter", "image": "https://picsum.photos/seed/cat1/300/200"}, {"id": "pro", "name": "PC Gamer Pro", "image": "https://picsum.photos/seed/cat2/300/200"}, {"id": "extreme", "name": "PC Gamer Extreme", "image": "https://picsum.photos/seed/cat3/300/200"}, {"id": "ultra", "name": "Ultra PC", "image": "https://picsum.photos/seed/cat4/300/200"}]',
'[{"id": "price", "max": 50000, "min": 0, "name": "Prix", "step": 1000, "type": "range"}, {"id": "processor", "name": "Processeur", "options": ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9"], "type": "checkbox"}, {"id": "gpu", "name": "Carte Graphique", "options": ["RTX 3050", "RTX 3060", "RTX 4060", "RTX 4070", "RTX 4080", "RTX 4090", "RX 7600", "RX 7900 XTX"], "type": "checkbox"}, {"id": "ram", "name": "RAM", "options": ["8GB", "16GB", "32GB", "64GB"], "type": "checkbox"}]'),

('components', 'COMPOSANTS', 'Cpu',
'[{"id": "cpu", "name": "Processeurs", "image": "https://picsum.photos/seed/cpu/300/200"}, {"id": "gpu", "name": "Cartes Graphiques", "image": "https://picsum.photos/seed/gpu/300/200"}, {"id": "ram", "name": "Mémoire RAM", "image": "https://picsum.photos/seed/ram/300/200"}, {"id": "mb", "name": "Cartes Mères", "image": "https://picsum.photos/seed/mb/300/200"}]',
'[{"id": "price", "max": 20000, "min": 0, "name": "Prix", "step": 100, "type": "range"}, {"id": "brand", "name": "Marque", "options": ["ASUS", "MSI", "Gigabyte", "AMD", "Intel", "Corsair", "Kingston"], "type": "checkbox"}, {"id": "subCategory", "name": "Type", "options": ["Processeurs", "Cartes Graphiques", "Mémoire RAM", "Cartes Mères"], "type": "checkbox"}]'),

('peripherals', 'PÉRIPHÉRIQUE PC', 'Keyboard',
'[{"id": "keyboard", "name": "Claviers Gamer", "image": "https://picsum.photos/seed/kb/300/200"}, {"id": "mouse", "name": "Souris Gamer", "image": "https://picsum.photos/seed/mouse/300/200"}, {"id": "headset", "name": "Casques Gamer", "image": "https://picsum.photos/seed/headset/300/200"}]',
'[{"id": "price", "max": 5000, "min": 0, "name": "Prix", "step": 100, "type": "range"}, {"id": "brand", "name": "Marque", "options": ["Razer", "Logitech", "Corsair", "HyperX", "SteelSeries"], "type": "checkbox"}, {"id": "subCategory", "name": "Type", "options": ["Claviers Gamer", "Souris Gamer", "Casques Gamer"], "type": "checkbox"}]'),

('monitors', 'ÉCRANS & MONITEURS PC', 'MonitorPlay',
'[{"id": "gaming-monitor", "name": "Écrans Gamer", "image": "https://picsum.photos/seed/monitor/300/200"}, {"id": "office-monitor", "name": "Écrans Bureautique", "image": "https://picsum.photos/seed/monitor2/300/200"}]',
'[{"id": "price", "max": 20000, "min": 0, "name": "Prix", "step": 500, "type": "range"}, {"id": "brand", "name": "Marque", "options": ["Samsung", "LG", "ASUS", "MSI", "BenQ", "Dell"], "type": "checkbox"}, {"id": "refreshRate", "name": "Fréquence", "options": ["60Hz", "144Hz", "165Hz", "240Hz"], "type": "checkbox"}]'),

('config', 'CONFIGURATEUR PC', 'Settings', '[]', '[]'),
('laptop', 'PC & ORDINATEUR PORTABLE', 'Laptop', '[]', '[]'),
('gaming', 'CONSOLES & JEUX & VR', 'Gamepad2', '[]', '[]'),
('furniture', 'MOBILIER DE BUREAU', 'Armchair', '[]', '[]'),
('photo', 'UNIVERS PHOTO ET VIDEO', 'Camera', '[]', '[]'),
('software', 'LOGICIEL', 'Disc', '[]', '[]'),
('tv', 'TV, IMAGE & SON', 'Tv', '[]', '[]'),
('print', 'IMPRIMANTE & SCANNER & TRACEUR', 'Printer', '[]', '[]'),
('gadgets', 'ACCESSOIRES & GADGET', 'Headphones', '[]', '[]');

-- 2. PRODUCTS
INSERT INTO products (name, price, promo_price, category, sub_category, brand, image, images, description, specs, is_new, is_best_seller, is_promo, stock) VALUES
('PC Gamer Ultra Instinct', 15999, 14500, 'pc-gamer', 'PC Gamer Extreme', 'TechMaroc', 'https://picsum.photos/seed/pc1/400/400', 
 ARRAY['https://picsum.photos/seed/pc1/400/400', 'https://picsum.photos/seed/pc1-2/400/400', 'https://picsum.photos/seed/pc1-3/400/400'], 
 'Le PC Gamer Ultra Instinct est conçu pour les joueurs exigeants qui ne font aucun compromis.', 
 '{"gpu": "RTX 4090 24GB", "ram": "64GB DDR5", "storage": "2TB NVMe SSD", "processor": "Intel Core i9-13900K"}', 
 true, true, false, 5),

('PC Gamer Starter Pack', 8500, NULL, 'pc-gamer', 'PC Gamer Starter', 'TechMaroc', 'https://picsum.photos/seed/pc2/400/400', 
 '{}', 'Idéal pour débuter dans le gaming, ce PC offre un excellent rapport qualité/prix.', 
 '{"gpu": "RTX 3060 12GB", "ram": "16GB DDR4", "storage": "1TB NVMe SSD", "processor": "Intel Core i5-12400F"}', 
 false, true, false, 12),

('PC Gamer Pro Max', 22000, NULL, 'pc-gamer', 'PC Gamer Pro', 'TechMaroc', 'https://picsum.photos/seed/pc3/400/400', 
 '{}', 'Performance brute pour le streaming et le montage.', 
 '{"gpu": "RX 7900 XTX", "ram": "32GB DDR5", "storage": "2TB NVMe Gen4", "processor": "AMD Ryzen 9 7950X"}', 
 false, true, true, 3),

('PC Gamer White Edition', 12500, NULL, 'pc-gamer', 'PC Gamer Pro', 'TechMaroc', 'https://picsum.photos/seed/pc4/400/400', 
 '{}', 'Un design épuré pour des performances de haut vol.', 
 '{"gpu": "RTX 4070 12GB", "ram": "32GB DDR5", "storage": "1TB NVMe SSD", "processor": "Intel Core i7-13700K"}', 
 false, true, false, 8),

('MSI GeForce RTX 4060 Ti', 4500, NULL, 'components', 'Cartes Graphiques', 'MSI', 'https://picsum.photos/seed/gpu1/400/400', 
 '{}', 'Graphismes de nouvelle génération avec le DLSS 3.', 
 '{"gpu": "RTX 4060 Ti", "ram": "8GB GDDR6", "storage": "", "processor": ""}', 
 false, true, false, 15),

('AMD Ryzen 7 7800X3D', 4200, NULL, 'components', 'Processeurs', 'AMD', 'https://picsum.photos/seed/cpu1/400/400', 
 '{}', 'Le meilleur processeur gaming au monde.', 
 '{"gpu": "", "ram": "", "storage": "", "processor": "Ryzen 7 7800X3D"}', 
 false, true, false, 20),

('Samsung Odyssey G7', 6500, NULL, 'monitors', 'Écrans Gamer', 'Samsung', 'https://picsum.photos/seed/monitor1/400/400', 
 '{}', 'Immersion totale avec écran incurvé 240Hz.', 
 '{"gpu": "", "ram": "", "storage": "", "processor": ""}', 
 false, true, false, 7),

('Logitech G Pro X Superlight', 1500, NULL, 'peripherals', 'Souris Gamer', 'Logitech', 'https://picsum.photos/seed/mouse1/400/400', 
 '{}', 'La souris préférée des pros de l''e-sport.', 
 '{"gpu": "", "ram": "", "storage": "", "processor": ""}', 
 false, true, false, 25);

-- 3. SITE CONFIG
INSERT INTO site_config (id, logo, logo_url, primary_color, tax_rate, hero, contact) VALUES
(1, 'TECHMAROC', '', '#7c3aed', 20, 
 '{"image": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2574&auto=format&fit=crop", "title": "LEVEL UP YOUR GAMING EXPERIENCE", "subtitle": "Découvrez nos PC Gamer assemblés avec passion pour des performances extrêmes."}',
 '{"email": "contact@techmaroc.com", "phone": "+212 5 22 00 00 00", "address": "123 Boulevard Zerktouni, Casablanca, Maroc"}');

-- 4. STORES
INSERT INTO stores (id, city, address, phone, hours, map_url) VALUES
('casablanca', 'Casablanca', '123 Boulevard Zerktouni, Maarif', '05 22 11 11 11', 'Lundi - Samedi : 09h00 - 20h00', 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1000&auto=format&fit=crop'),
('marrakech', 'Marrakech', '45 Avenue Mohammed V, Guéliz', '05 24 00 00 00', 'Lundi - Samedi : 10h00 - 21h00', 'https://images.unsplash.com/photo-1597211661940-e0e74f43324e?q=80&w=1000&auto=format&fit=crop'),
('rabat', 'Rabat', '12 Rue Arroz, Agdal', '05 37 00 00 00', 'Lundi - Samedi : 09h30 - 19h30', 'https://images.unsplash.com/photo-1531846807986-df4636105699?q=80&w=1000&auto=format&fit=crop');

-- 5. PARTNERS
INSERT INTO partners (id, name, logo, description) VALUES
('asus', 'ASUS ROG', 'https://upload.wikimedia.org/wikipedia/commons/d/de/ROG_logo.png', 'Republic of Gamers'),
('msi', 'MSI', 'https://upload.wikimedia.org/wikipedia/commons/8/8c/MSI_Logo_2019.svg', 'True Gaming'),
('nvidia', 'NVIDIA', 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', 'GeForce RTX'),
('amd', 'AMD', 'https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg', 'Ryzen & Radeon'),
('logitech', 'Logitech G', 'https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg', 'Advanced Gaming Gear'),
('razer', 'Razer', 'https://upload.wikimedia.org/wikipedia/en/4/40/Razer_snake_logo.svg', 'For Gamers. By Gamers.');
