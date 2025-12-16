-- Seed verified blood banks for India
INSERT INTO public.blood_banks (name, address, city, state, latitude, longitude, phone, is_24x7, is_verified, rating, has_component_facility) VALUES
('Indian Red Cross Society Blood Bank', '1, Red Cross Road, Near Connaught Place', 'New Delhi', 'Delhi', 28.6315, 77.2167, '+91-11-23711551', true, true, 4.8, true),
('Rotary Blood Bank', 'A-3, 56-57, Community Centre, Tughlakabad', 'New Delhi', 'Delhi', 28.5189, 77.2507, '+91-11-29957044', true, true, 4.9, true),
('AIIMS Blood Bank', 'All India Institute of Medical Sciences, Ansari Nagar', 'New Delhi', 'Delhi', 28.5672, 77.2100, '+91-11-26588500', true, true, 4.7, true),
('Apollo Hospitals Blood Bank', 'Sarita Vihar, Delhi Mathura Road', 'New Delhi', 'Delhi', 28.5322, 77.2886, '+91-11-26925858', true, true, 4.8, true),
('Fortis Blood Bank', 'Sector B, Pocket 1, Aruna Asaf Ali Marg, Vasant Kunj', 'New Delhi', 'Delhi', 28.5200, 77.1500, '+91-11-42776222', true, true, 4.6, true),
('Max Super Speciality Hospital Blood Bank', 'Press Enclave Road, Saket', 'New Delhi', 'Delhi', 28.5274, 77.2186, '+91-11-26515050', true, true, 4.7, true),
('Sir Ganga Ram Hospital Blood Bank', 'Rajinder Nagar, New Delhi', 'New Delhi', 'Delhi', 28.6412, 77.1821, '+91-11-25861831', true, true, 4.8, true),
('Prathama Blood Centre', 'Shahibaug', 'Ahmedabad', 'Gujarat', 23.0469, 72.5849, '+91-79-22861175', true, true, 4.9, true),
('Tata Memorial Hospital Blood Bank', 'Dr. E Borges Road, Parel', 'Mumbai', 'Maharashtra', 19.0045, 72.8426, '+91-22-24177000', true, true, 4.8, true),
('KEM Hospital Blood Bank', 'Acharya Donde Marg, Parel', 'Mumbai', 'Maharashtra', 19.0000, 72.8400, '+91-22-24136051', true, true, 4.7, true),
('Lilavati Hospital Blood Bank', 'Bandra Reclamation, Bandra West', 'Mumbai', 'Maharashtra', 19.0509, 72.8289, '+91-22-26568000', true, true, 4.6, true),
('CMC Vellore Blood Bank', 'Ida Scudder Road', 'Vellore', 'Tamil Nadu', 12.9237, 79.1350, '+91-416-2281000', true, true, 4.9, true),
('Apollo Hospitals Blood Bank Chennai', '21 Greams Lane, Off Greams Road', 'Chennai', 'Tamil Nadu', 13.0604, 80.2496, '+91-44-28293333', true, true, 4.8, true),
('Sankara Nethralaya Blood Bank', '21, Pycrofts Garden Road, Nungambakkam', 'Chennai', 'Tamil Nadu', 13.0633, 80.2497, '+91-44-28271616', false, true, 4.7, true),
('Narayana Health Blood Bank', '258/A, Bommasandra Industrial Area', 'Bangalore', 'Karnataka', 12.8152, 77.6567, '+91-80-27832100', true, true, 4.8, true),
('Manipal Hospital Blood Bank', '98, HAL Airport Road', 'Bangalore', 'Karnataka', 12.9596, 77.6476, '+91-80-25024444', true, true, 4.7, true),
('NIMHANS Blood Bank', 'Hosur Road', 'Bangalore', 'Karnataka', 12.9416, 77.5965, '+91-80-26995000', true, true, 4.6, true),
('Sanjay Gandhi PGIMS Blood Bank', 'Rae Bareli Road', 'Lucknow', 'Uttar Pradesh', 26.7493, 80.9532, '+91-522-2668700', true, true, 4.7, true),
('PGIMER Blood Bank', 'Sector 12', 'Chandigarh', 'Chandigarh', 30.7650, 76.7756, '+91-172-2756565', true, true, 4.8, true),
('Sankalp India Foundation', 'Jayanagar 4th Block', 'Bangalore', 'Karnataka', 12.9252, 77.5938, '+91-80-26630867', true, true, 4.9, true)
ON CONFLICT DO NOTHING;