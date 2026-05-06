-- ================================================================
-- XGROW Platform — Kenya Counties Seed Data v1.0
-- Regions: 8 | Counties: 47 | Sub-Counties: 290+
-- Run AFTER xgrow_schema.sql | Database: xgrow_db
-- ================================================================
USE xgrow_db;
SET FOREIGN_KEY_CHECKS=0;
DELETE FROM county_crops; DELETE FROM sub_counties; DELETE FROM counties; DELETE FROM regions;
SET FOREIGN_KEY_CHECKS=1;
ALTER TABLE regions AUTO_INCREMENT=1;
ALTER TABLE counties AUTO_INCREMENT=1;
ALTER TABLE sub_counties AUTO_INCREMENT=1;

-- ── 8 REGIONS ──────────────────────────────────────────────────
INSERT INTO regions(id,name) VALUES
  (1,'Central'),(2,'Coast'),(3,'Eastern'),(4,'Nairobi'),
  (5,'North Eastern'),(6,'Nyanza'),(7,'Rift Valley'),(8,'Western');

-- ── 47 COUNTIES ────────────────────────────────────────────────
INSERT INTO counties(code,name,capital,region_id,agri_zone,lat,lng,population,area_km2,rainfall_mm,elevation_m) VALUES
('001','Mombasa','Mombasa City',2,'Coastal Lowlands',-4.0435,39.6682,1208333,229,'700-1200','0-100'),
('002','Kwale','Kwale Town',2,'Coastal Lowlands',-4.1833,39.4500,866820,8270,'600-1200','0-600'),
('003','Kilifi','Kilifi Town',2,'Coastal Lowlands',-3.5107,39.9093,1453787,12610,'500-1200','0-400'),
('004','Tana River','Hola',2,'Semi-Arid',-1.4977,40.0285,315943,35375,'250-600','0-300'),
('005','Lamu','Lamu Town',2,'Coastal Lowlands',-2.2686,40.9020,143920,6497,'600-900','0-100'),
('006','Taita-Taveta','Voi',2,'Semi-Arid',-3.3667,38.5500,340671,17083,'400-1000','600-2200'),
('007','Garissa','Garissa Town',5,'Very Arid',-0.4532,39.6460,841353,44175,'150-400','50-400'),
('008','Wajir','Wajir Town',5,'Very Arid',1.7472,40.0573,781263,55840,'100-300','100-400'),
('009','Mandera','Mandera Town',5,'Very Arid',3.9366,41.8670,1025756,25797,'100-300','200-500'),
('010','Marsabit','Marsabit Town',3,'Very Arid',2.3284,37.9947,459785,70961,'150-650','300-1700'),
('011','Isiolo','Isiolo Town',3,'Arid',0.3556,38.0025,268002,25336,'200-500','300-1500'),
('012','Meru','Meru Town',3,'Semi-Humid Highlands',0.0474,37.6491,1545714,6936,'900-2000','500-5199'),
('013','Tharaka-Nithi','Chuka',3,'Semi-Arid',-0.3000,37.9500,393177,2661,'700-1400','400-1800'),
('014','Kitui','Kitui Town',3,'Semi-Arid',-1.3667,38.0167,1136187,30496,'400-1000','400-1600'),
('015','Machakos','Machakos Town',3,'Semi-Arid',-1.5177,37.2634,1421932,6208,'500-1200','600-2000'),
('016','Makueni','Wote',3,'Semi-Arid',-2.2553,37.8977,987653,8008,'400-900','500-2000'),
('017','Nyandarua','Ol Kalou',1,'Humid Highlands',-0.1804,36.3630,638289,3304,'1000-1800','2000-3000'),
('018','Nyeri','Nyeri Town',1,'Humid Highlands',-0.4167,36.9500,759164,3337,'900-2000','1500-5199'),
('019','Kirinyaga','Kerugoya',1,'Humid Highlands',-0.4921,37.2634,610411,1478,'900-2200','1000-5199'),
('020','Murang''a','Murang''a Town',1,'Humid Highlands',-0.7197,37.1566,1056640,2558,'1000-2000','1200-2200'),
('021','Kiambu','Kiambu Town',1,'Humid Highlands',-1.0319,36.8301,2417735,2543,'900-1500','1500-2400'),
('022','Turkana','Lodwar',7,'Very Arid',3.1192,35.5966,926976,68680,'100-400','300-2000'),
('023','West Pokot','Kapenguria',7,'Semi-Arid',1.2469,35.1179,621241,9169,'500-1500','1000-3200'),
('024','Samburu','Maralal',7,'Arid',1.0766,36.6958,310327,21022,'200-700','900-2400'),
('025','Trans-Nzoia','Kitale',7,'Humid Highlands',1.0159,35.0062,990341,2495,'1000-1800','1800-4300'),
('026','Uasin Gishu','Eldoret',7,'Semi-Humid Highlands',0.5143,35.2699,1163186,3345,'900-1600','1800-2800'),
('027','Elgeyo-Marakwet','Iten',7,'Semi-Humid Highlands',0.6833,35.5167,454480,3030,'800-2000','900-3200'),
('028','Nandi','Kapsabet',7,'Semi-Humid Highlands',0.1850,35.1025,885711,2884,'1200-2200','1500-2800'),
('029','Baringo','Kabarnet',7,'Semi-Arid',0.4726,35.7409,666763,11015,'400-1800','900-3100'),
('030','Laikipia','Nanyuki',7,'Semi-Arid',0.3606,36.7819,518560,9462,'500-1100','1600-3000'),
('031','Nakuru','Nakuru City',7,'Semi-Humid Highlands',-0.3031,36.0800,2162202,7495,'800-1500','1600-3000'),
('032','Narok','Narok Town',7,'Semi-Arid',-1.0804,35.8694,1157873,17944,'600-1400','1600-2700'),
('033','Kajiado','Kajiado Town',7,'Semi-Arid',-1.8520,36.7760,1117840,21901,'400-1200','600-2700'),
('034','Kericho','Kericho Town',7,'Humid Highlands',-0.3686,35.2863,901777,2454,'1400-2200','1800-2800'),
('035','Bomet','Bomet Town',7,'Humid Highlands',-0.7800,35.3420,875689,1997,'1200-1800','1700-2800'),
('036','Kakamega','Kakamega Town',8,'Humid Highlands',0.2827,34.7519,1867579,3050,'1400-2200','1200-1800'),
('037','Vihiga','Mbale',8,'Humid Highlands',0.0756,34.7234,590013,563,'1400-2000','1400-2000'),
('038','Bungoma','Bungoma Town',8,'Humid Highlands',0.5635,34.5606,1670570,3032,'1200-2000','1400-4300'),
('039','Busia','Busia Town',8,'Lake Basin',0.4604,34.1116,893681,1697,'900-1600','1100-1500'),
('040','Siaya','Siaya Town',6,'Lake Basin',-0.0607,34.2878,993183,2530,'800-1400','1100-1600'),
('041','Kisumu','Kisumu City',6,'Lake Basin',-0.0917,34.7680,1155574,2085,'900-1800','1100-1800'),
('042','Homa Bay','Homa Bay Town',6,'Lake Basin',-0.5273,34.4571,1131950,3183,'800-1600','1100-1700'),
('043','Migori','Migori Town',6,'Lake Basin',-1.0634,34.4731,1116436,2586,'800-1400','1200-2000'),
('044','Kisii','Kisii Town',6,'Humid Highlands',-0.6817,34.7667,1266860,1317,'1200-2000','1500-2200'),
('045','Nyamira','Nyamira Town',6,'Humid Highlands',-0.5667,34.9333,598252,912,'1200-2000','1500-2100'),
('046','Narok South','Kilgoris',7,'Semi-Arid',-1.2500,34.9000,450000,8800,'600-1200','1500-2400'),
('047','Nairobi','Nairobi City',4,'Semi-Humid Highlands',-1.2921,36.8219,4397073,696,'600-1200','1600-1850');

-- ── SUB-COUNTIES (correlated subqueries — safe on any AUTO_INCREMENT) ────────
INSERT INTO sub_counties(county_id,name) SELECT id,'Changamwe'       FROM counties WHERE code='001';
INSERT INTO sub_counties(county_id,name) SELECT id,'Jomvu'           FROM counties WHERE code='001';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kisauni'         FROM counties WHERE code='001';
INSERT INTO sub_counties(county_id,name) SELECT id,'Nyali'           FROM counties WHERE code='001';
INSERT INTO sub_counties(county_id,name) SELECT id,'Likoni'          FROM counties WHERE code='001';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mvita'           FROM counties WHERE code='001';
INSERT INTO sub_counties(county_id,name) SELECT id,'Msambweni'       FROM counties WHERE code='002';
INSERT INTO sub_counties(county_id,name) SELECT id,'Lunga Lunga'     FROM counties WHERE code='002';
INSERT INTO sub_counties(county_id,name) SELECT id,'Matuga'          FROM counties WHERE code='002';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kinango'         FROM counties WHERE code='002';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kilifi North'    FROM counties WHERE code='003';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kilifi South'    FROM counties WHERE code='003';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kaloleni'        FROM counties WHERE code='003';
INSERT INTO sub_counties(county_id,name) SELECT id,'Rabai'           FROM counties WHERE code='003';
INSERT INTO sub_counties(county_id,name) SELECT id,'Ganze'           FROM counties WHERE code='003';
INSERT INTO sub_counties(county_id,name) SELECT id,'Malindi'         FROM counties WHERE code='003';
INSERT INTO sub_counties(county_id,name) SELECT id,'Magarini'        FROM counties WHERE code='003';
INSERT INTO sub_counties(county_id,name) SELECT id,'Garsen'          FROM counties WHERE code='004';
INSERT INTO sub_counties(county_id,name) SELECT id,'Galole'          FROM counties WHERE code='004';
INSERT INTO sub_counties(county_id,name) SELECT id,'Bura'            FROM counties WHERE code='004';
INSERT INTO sub_counties(county_id,name) SELECT id,'Lamu East'       FROM counties WHERE code='005';
INSERT INTO sub_counties(county_id,name) SELECT id,'Lamu West'       FROM counties WHERE code='005';
INSERT INTO sub_counties(county_id,name) SELECT id,'Taveta'          FROM counties WHERE code='006';
INSERT INTO sub_counties(county_id,name) SELECT id,'Wundanyi'        FROM counties WHERE code='006';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mwatate'         FROM counties WHERE code='006';
INSERT INTO sub_counties(county_id,name) SELECT id,'Voi'             FROM counties WHERE code='006';
INSERT INTO sub_counties(county_id,name) SELECT id,'Garissa Township'FROM counties WHERE code='007';
INSERT INTO sub_counties(county_id,name) SELECT id,'Balambala'       FROM counties WHERE code='007';
INSERT INTO sub_counties(county_id,name) SELECT id,'Lagdera'         FROM counties WHERE code='007';
INSERT INTO sub_counties(county_id,name) SELECT id,'Dadaab'          FROM counties WHERE code='007';
INSERT INTO sub_counties(county_id,name) SELECT id,'Fafi'            FROM counties WHERE code='007';
INSERT INTO sub_counties(county_id,name) SELECT id,'Ijara'           FROM counties WHERE code='007';
INSERT INTO sub_counties(county_id,name) SELECT id,'Wajir North'     FROM counties WHERE code='008';
INSERT INTO sub_counties(county_id,name) SELECT id,'Wajir East'      FROM counties WHERE code='008';
INSERT INTO sub_counties(county_id,name) SELECT id,'Tarbaj'          FROM counties WHERE code='008';
INSERT INTO sub_counties(county_id,name) SELECT id,'Wajir West'      FROM counties WHERE code='008';
INSERT INTO sub_counties(county_id,name) SELECT id,'Eldas'           FROM counties WHERE code='008';
INSERT INTO sub_counties(county_id,name) SELECT id,'Wajir South'     FROM counties WHERE code='008';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mandera West'    FROM counties WHERE code='009';
INSERT INTO sub_counties(county_id,name) SELECT id,'Banissa'         FROM counties WHERE code='009';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mandera North'   FROM counties WHERE code='009';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mandera South'   FROM counties WHERE code='009';
INSERT INTO sub_counties(county_id,name) SELECT id,'Lafey'           FROM counties WHERE code='009';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mandera East'    FROM counties WHERE code='009';
INSERT INTO sub_counties(county_id,name) SELECT id,'Moyale'          FROM counties WHERE code='010';
INSERT INTO sub_counties(county_id,name) SELECT id,'North Horr'      FROM counties WHERE code='010';
INSERT INTO sub_counties(county_id,name) SELECT id,'Saku'            FROM counties WHERE code='010';
INSERT INTO sub_counties(county_id,name) SELECT id,'Laisamis'        FROM counties WHERE code='010';
INSERT INTO sub_counties(county_id,name) SELECT id,'Isiolo North'    FROM counties WHERE code='011';
INSERT INTO sub_counties(county_id,name) SELECT id,'Isiolo South'    FROM counties WHERE code='011';
INSERT INTO sub_counties(county_id,name) SELECT id,'Imenti North'    FROM counties WHERE code='012';
INSERT INTO sub_counties(county_id,name) SELECT id,'Imenti South'    FROM counties WHERE code='012';
INSERT INTO sub_counties(county_id,name) SELECT id,'Imenti Central'  FROM counties WHERE code='012';
INSERT INTO sub_counties(county_id,name) SELECT id,'Tigania East'    FROM counties WHERE code='012';
INSERT INTO sub_counties(county_id,name) SELECT id,'Tigania West'    FROM counties WHERE code='012';
INSERT INTO sub_counties(county_id,name) SELECT id,'Igembe Central'  FROM counties WHERE code='012';
INSERT INTO sub_counties(county_id,name) SELECT id,'Igembe North'    FROM counties WHERE code='012';
INSERT INTO sub_counties(county_id,name) SELECT id,'Igembe South'    FROM counties WHERE code='012';
INSERT INTO sub_counties(county_id,name) SELECT id,'Buuri'           FROM counties WHERE code='012';
INSERT INTO sub_counties(county_id,name) SELECT id,'Maara'           FROM counties WHERE code='013';
INSERT INTO sub_counties(county_id,name) SELECT id,'Tharaka South'   FROM counties WHERE code='013';
INSERT INTO sub_counties(county_id,name) SELECT id,'Tharaka North'   FROM counties WHERE code='013';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mwingi North'    FROM counties WHERE code='014';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mwingi West'     FROM counties WHERE code='014';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mwingi Central'  FROM counties WHERE code='014';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kitui West'      FROM counties WHERE code='014';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kitui Rural'     FROM counties WHERE code='014';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kitui Central'   FROM counties WHERE code='014';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kitui East'      FROM counties WHERE code='014';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kitui South'     FROM counties WHERE code='014';
INSERT INTO sub_counties(county_id,name) SELECT id,'Masinga'         FROM counties WHERE code='015';
INSERT INTO sub_counties(county_id,name) SELECT id,'Yatta'           FROM counties WHERE code='015';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kangundo'        FROM counties WHERE code='015';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kathiani'        FROM counties WHERE code='015';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mavoko'          FROM counties WHERE code='015';
INSERT INTO sub_counties(county_id,name) SELECT id,'Machakos Town'   FROM counties WHERE code='015';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mwala'           FROM counties WHERE code='015';
INSERT INTO sub_counties(county_id,name) SELECT id,'Makueni'         FROM counties WHERE code='016';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kibwezi West'    FROM counties WHERE code='016';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kibwezi East'    FROM counties WHERE code='016';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kilome'          FROM counties WHERE code='016';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kaiti'           FROM counties WHERE code='016';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mbooni'          FROM counties WHERE code='016';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kinangop'        FROM counties WHERE code='017';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kipipiri'        FROM counties WHERE code='017';
INSERT INTO sub_counties(county_id,name) SELECT id,'Ol Kalou'        FROM counties WHERE code='017';
INSERT INTO sub_counties(county_id,name) SELECT id,'Ol Joro Orok'    FROM counties WHERE code='017';
INSERT INTO sub_counties(county_id,name) SELECT id,'Ndaragwa'        FROM counties WHERE code='017';
INSERT INTO sub_counties(county_id,name) SELECT id,'Tetu'            FROM counties WHERE code='018';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kieni'           FROM counties WHERE code='018';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mathira'         FROM counties WHERE code='018';
INSERT INTO sub_counties(county_id,name) SELECT id,'Othaya'          FROM counties WHERE code='018';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mukurweini'      FROM counties WHERE code='018';
INSERT INTO sub_counties(county_id,name) SELECT id,'Nyeri Town'      FROM counties WHERE code='018';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mwea'            FROM counties WHERE code='019';
INSERT INTO sub_counties(county_id,name) SELECT id,'Gichugu'         FROM counties WHERE code='019';
INSERT INTO sub_counties(county_id,name) SELECT id,'Ndia'            FROM counties WHERE code='019';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kirinyaga Central'FROM counties WHERE code='019';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kangema'         FROM counties WHERE code='020';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mathioya'        FROM counties WHERE code='020';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kiharu'          FROM counties WHERE code='020';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kigumo'          FROM counties WHERE code='020';
INSERT INTO sub_counties(county_id,name) SELECT id,'Maragwa'         FROM counties WHERE code='020';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kandara'         FROM counties WHERE code='020';
INSERT INTO sub_counties(county_id,name) SELECT id,'Gatanga'         FROM counties WHERE code='020';
INSERT INTO sub_counties(county_id,name) SELECT id,'Gatundu South'   FROM counties WHERE code='021';
INSERT INTO sub_counties(county_id,name) SELECT id,'Gatundu North'   FROM counties WHERE code='021';
INSERT INTO sub_counties(county_id,name) SELECT id,'Juja'            FROM counties WHERE code='021';
INSERT INTO sub_counties(county_id,name) SELECT id,'Thika Town'      FROM counties WHERE code='021';
INSERT INTO sub_counties(county_id,name) SELECT id,'Ruiru'           FROM counties WHERE code='021';
INSERT INTO sub_counties(county_id,name) SELECT id,'Githunguri'      FROM counties WHERE code='021';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kiambu'          FROM counties WHERE code='021';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kiambaa'         FROM counties WHERE code='021';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kabete'          FROM counties WHERE code='021';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kikuyu'          FROM counties WHERE code='021';
INSERT INTO sub_counties(county_id,name) SELECT id,'Limuru'          FROM counties WHERE code='021';
INSERT INTO sub_counties(county_id,name) SELECT id,'Lari'            FROM counties WHERE code='021';
INSERT INTO sub_counties(county_id,name) SELECT id,'Turkana North'   FROM counties WHERE code='022';
INSERT INTO sub_counties(county_id,name) SELECT id,'Turkana West'    FROM counties WHERE code='022';
INSERT INTO sub_counties(county_id,name) SELECT id,'Turkana Central' FROM counties WHERE code='022';
INSERT INTO sub_counties(county_id,name) SELECT id,'Loima'           FROM counties WHERE code='022';
INSERT INTO sub_counties(county_id,name) SELECT id,'Turkana South'   FROM counties WHERE code='022';
INSERT INTO sub_counties(county_id,name) SELECT id,'Turkana East'    FROM counties WHERE code='022';
INSERT INTO sub_counties(county_id,name) SELECT id,'North Pokot'     FROM counties WHERE code='023';
INSERT INTO sub_counties(county_id,name) SELECT id,'Pokot Central'   FROM counties WHERE code='023';
INSERT INTO sub_counties(county_id,name) SELECT id,'South Pokot'     FROM counties WHERE code='023';
INSERT INTO sub_counties(county_id,name) SELECT id,'West Pokot'      FROM counties WHERE code='023';
INSERT INTO sub_counties(county_id,name) SELECT id,'Samburu North'   FROM counties WHERE code='024';
INSERT INTO sub_counties(county_id,name) SELECT id,'Samburu East'    FROM counties WHERE code='024';
INSERT INTO sub_counties(county_id,name) SELECT id,'Samburu West'    FROM counties WHERE code='024';
INSERT INTO sub_counties(county_id,name) SELECT id,'Cherangany'      FROM counties WHERE code='025';
INSERT INTO sub_counties(county_id,name) SELECT id,'Endebess'        FROM counties WHERE code='025';
INSERT INTO sub_counties(county_id,name) SELECT id,'Saboti'          FROM counties WHERE code='025';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kiminini'        FROM counties WHERE code='025';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kwanza'          FROM counties WHERE code='025';
INSERT INTO sub_counties(county_id,name) SELECT id,'Ainabkoi'        FROM counties WHERE code='026';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kapseret'        FROM counties WHERE code='026';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kesses'          FROM counties WHERE code='026';
INSERT INTO sub_counties(county_id,name) SELECT id,'Moiben'          FROM counties WHERE code='026';
INSERT INTO sub_counties(county_id,name) SELECT id,'Soy'             FROM counties WHERE code='026';
INSERT INTO sub_counties(county_id,name) SELECT id,'Turbo'           FROM counties WHERE code='026';
INSERT INTO sub_counties(county_id,name) SELECT id,'Marakwet East'   FROM counties WHERE code='027';
INSERT INTO sub_counties(county_id,name) SELECT id,'Marakwet West'   FROM counties WHERE code='027';
INSERT INTO sub_counties(county_id,name) SELECT id,'Keiyo North'     FROM counties WHERE code='027';
INSERT INTO sub_counties(county_id,name) SELECT id,'Keiyo South'     FROM counties WHERE code='027';
INSERT INTO sub_counties(county_id,name) SELECT id,'Chesumei'        FROM counties WHERE code='028';
INSERT INTO sub_counties(county_id,name) SELECT id,'Emgwen'          FROM counties WHERE code='028';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mosop'           FROM counties WHERE code='028';
INSERT INTO sub_counties(county_id,name) SELECT id,'Nandi Hills'     FROM counties WHERE code='028';
INSERT INTO sub_counties(county_id,name) SELECT id,'Aldai'           FROM counties WHERE code='028';
INSERT INTO sub_counties(county_id,name) SELECT id,'Tindiret'        FROM counties WHERE code='028';
INSERT INTO sub_counties(county_id,name) SELECT id,'Tiaty'           FROM counties WHERE code='029';
INSERT INTO sub_counties(county_id,name) SELECT id,'Baringo North'   FROM counties WHERE code='029';
INSERT INTO sub_counties(county_id,name) SELECT id,'Baringo Central' FROM counties WHERE code='029';
INSERT INTO sub_counties(county_id,name) SELECT id,'Baringo South'   FROM counties WHERE code='029';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mogotio'         FROM counties WHERE code='029';
INSERT INTO sub_counties(county_id,name) SELECT id,'Eldama Ravine'   FROM counties WHERE code='029';
INSERT INTO sub_counties(county_id,name) SELECT id,'Laikipia West'   FROM counties WHERE code='030';
INSERT INTO sub_counties(county_id,name) SELECT id,'Laikipia East'   FROM counties WHERE code='030';
INSERT INTO sub_counties(county_id,name) SELECT id,'Laikipia North'  FROM counties WHERE code='030';
INSERT INTO sub_counties(county_id,name) SELECT id,'Molo'            FROM counties WHERE code='031';
INSERT INTO sub_counties(county_id,name) SELECT id,'Njoro'           FROM counties WHERE code='031';
INSERT INTO sub_counties(county_id,name) SELECT id,'Naivasha'        FROM counties WHERE code='031';
INSERT INTO sub_counties(county_id,name) SELECT id,'Gilgil'          FROM counties WHERE code='031';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kuresoi South'   FROM counties WHERE code='031';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kuresoi North'   FROM counties WHERE code='031';
INSERT INTO sub_counties(county_id,name) SELECT id,'Subukia'         FROM counties WHERE code='031';
INSERT INTO sub_counties(county_id,name) SELECT id,'Rongai'          FROM counties WHERE code='031';
INSERT INTO sub_counties(county_id,name) SELECT id,'Bahati'          FROM counties WHERE code='031';
INSERT INTO sub_counties(county_id,name) SELECT id,'Nakuru Town West'FROM counties WHERE code='031';
INSERT INTO sub_counties(county_id,name) SELECT id,'Nakuru Town East'FROM counties WHERE code='031';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kilgoris'        FROM counties WHERE code='032';
INSERT INTO sub_counties(county_id,name) SELECT id,'Emurua Dikirr'   FROM counties WHERE code='032';
INSERT INTO sub_counties(county_id,name) SELECT id,'Narok North'     FROM counties WHERE code='032';
INSERT INTO sub_counties(county_id,name) SELECT id,'Narok East'      FROM counties WHERE code='032';
INSERT INTO sub_counties(county_id,name) SELECT id,'Narok South'     FROM counties WHERE code='032';
INSERT INTO sub_counties(county_id,name) SELECT id,'Narok West'      FROM counties WHERE code='032';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kajiado North'   FROM counties WHERE code='033';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kajiado Central' FROM counties WHERE code='033';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kajiado East'    FROM counties WHERE code='033';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kajiado West'    FROM counties WHERE code='033';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kajiado South'   FROM counties WHERE code='033';
INSERT INTO sub_counties(county_id,name) SELECT id,'Ainamoi'         FROM counties WHERE code='034';
INSERT INTO sub_counties(county_id,name) SELECT id,'Belgut'          FROM counties WHERE code='034';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kipkelion East'  FROM counties WHERE code='034';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kipkelion West'  FROM counties WHERE code='034';
INSERT INTO sub_counties(county_id,name) SELECT id,'Soin/Sigowet'    FROM counties WHERE code='034';
INSERT INTO sub_counties(county_id,name) SELECT id,'Sotik'           FROM counties WHERE code='035';
INSERT INTO sub_counties(county_id,name) SELECT id,'Chepalungu'      FROM counties WHERE code='035';
INSERT INTO sub_counties(county_id,name) SELECT id,'Konoin'          FROM counties WHERE code='035';
INSERT INTO sub_counties(county_id,name) SELECT id,'Bomet Central'   FROM counties WHERE code='035';
INSERT INTO sub_counties(county_id,name) SELECT id,'Bomet East'      FROM counties WHERE code='035';
INSERT INTO sub_counties(county_id,name) SELECT id,'Lugari'          FROM counties WHERE code='036';
INSERT INTO sub_counties(county_id,name) SELECT id,'Likuyani'        FROM counties WHERE code='036';
INSERT INTO sub_counties(county_id,name) SELECT id,'Malava'          FROM counties WHERE code='036';
INSERT INTO sub_counties(county_id,name) SELECT id,'Lurambi'         FROM counties WHERE code='036';
INSERT INTO sub_counties(county_id,name) SELECT id,'Navakholo'       FROM counties WHERE code='036';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mumias West'     FROM counties WHERE code='036';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mumias East'     FROM counties WHERE code='036';
INSERT INTO sub_counties(county_id,name) SELECT id,'Matungu'         FROM counties WHERE code='036';
INSERT INTO sub_counties(county_id,name) SELECT id,'Butere'          FROM counties WHERE code='036';
INSERT INTO sub_counties(county_id,name) SELECT id,'Khwisero'        FROM counties WHERE code='036';
INSERT INTO sub_counties(county_id,name) SELECT id,'Shinyalu'        FROM counties WHERE code='036';
INSERT INTO sub_counties(county_id,name) SELECT id,'Ikolomani'       FROM counties WHERE code='036';
INSERT INTO sub_counties(county_id,name) SELECT id,'Vihiga'          FROM counties WHERE code='037';
INSERT INTO sub_counties(county_id,name) SELECT id,'Sabatia'         FROM counties WHERE code='037';
INSERT INTO sub_counties(county_id,name) SELECT id,'Hamisi'          FROM counties WHERE code='037';
INSERT INTO sub_counties(county_id,name) SELECT id,'Luanda'          FROM counties WHERE code='037';
INSERT INTO sub_counties(county_id,name) SELECT id,'Emuhaya'         FROM counties WHERE code='037';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mt Elgon'        FROM counties WHERE code='038';
INSERT INTO sub_counties(county_id,name) SELECT id,'Sirisia'         FROM counties WHERE code='038';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kabuchai'        FROM counties WHERE code='038';
INSERT INTO sub_counties(county_id,name) SELECT id,'Bumula'          FROM counties WHERE code='038';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kanduyi'         FROM counties WHERE code='038';
INSERT INTO sub_counties(county_id,name) SELECT id,'Webuye East'     FROM counties WHERE code='038';
INSERT INTO sub_counties(county_id,name) SELECT id,'Webuye West'     FROM counties WHERE code='038';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kimilili'        FROM counties WHERE code='038';
INSERT INTO sub_counties(county_id,name) SELECT id,'Tongaren'        FROM counties WHERE code='038';
INSERT INTO sub_counties(county_id,name) SELECT id,'Teso North'      FROM counties WHERE code='039';
INSERT INTO sub_counties(county_id,name) SELECT id,'Teso South'      FROM counties WHERE code='039';
INSERT INTO sub_counties(county_id,name) SELECT id,'Nambale'         FROM counties WHERE code='039';
INSERT INTO sub_counties(county_id,name) SELECT id,'Matayos'         FROM counties WHERE code='039';
INSERT INTO sub_counties(county_id,name) SELECT id,'Butula'          FROM counties WHERE code='039';
INSERT INTO sub_counties(county_id,name) SELECT id,'Funyula'         FROM counties WHERE code='039';
INSERT INTO sub_counties(county_id,name) SELECT id,'Bunyala'         FROM counties WHERE code='039';
INSERT INTO sub_counties(county_id,name) SELECT id,'Ugenya'          FROM counties WHERE code='040';
INSERT INTO sub_counties(county_id,name) SELECT id,'Ugunja'          FROM counties WHERE code='040';
INSERT INTO sub_counties(county_id,name) SELECT id,'Alego Usonga'    FROM counties WHERE code='040';
INSERT INTO sub_counties(county_id,name) SELECT id,'Gem'             FROM counties WHERE code='040';
INSERT INTO sub_counties(county_id,name) SELECT id,'Bondo'           FROM counties WHERE code='040';
INSERT INTO sub_counties(county_id,name) SELECT id,'Rarieda'         FROM counties WHERE code='040';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kisumu East'     FROM counties WHERE code='041';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kisumu West'     FROM counties WHERE code='041';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kisumu Central'  FROM counties WHERE code='041';
INSERT INTO sub_counties(county_id,name) SELECT id,'Seme'            FROM counties WHERE code='041';
INSERT INTO sub_counties(county_id,name) SELECT id,'Nyando'          FROM counties WHERE code='041';
INSERT INTO sub_counties(county_id,name) SELECT id,'Muhoroni'        FROM counties WHERE code='041';
INSERT INTO sub_counties(county_id,name) SELECT id,'Nyakach'         FROM counties WHERE code='041';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kasipul'         FROM counties WHERE code='042';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kabondo Kasipul' FROM counties WHERE code='042';
INSERT INTO sub_counties(county_id,name) SELECT id,'Karachuonyo'     FROM counties WHERE code='042';
INSERT INTO sub_counties(county_id,name) SELECT id,'Rangwe'          FROM counties WHERE code='042';
INSERT INTO sub_counties(county_id,name) SELECT id,'Homa Bay Town'   FROM counties WHERE code='042';
INSERT INTO sub_counties(county_id,name) SELECT id,'Ndhiwa'          FROM counties WHERE code='042';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mbita'           FROM counties WHERE code='042';
INSERT INTO sub_counties(county_id,name) SELECT id,'Suba'            FROM counties WHERE code='042';
INSERT INTO sub_counties(county_id,name) SELECT id,'Rongo'           FROM counties WHERE code='043';
INSERT INTO sub_counties(county_id,name) SELECT id,'Awendo'          FROM counties WHERE code='043';
INSERT INTO sub_counties(county_id,name) SELECT id,'Suna East'       FROM counties WHERE code='043';
INSERT INTO sub_counties(county_id,name) SELECT id,'Suna West'       FROM counties WHERE code='043';
INSERT INTO sub_counties(county_id,name) SELECT id,'Uriri'           FROM counties WHERE code='043';
INSERT INTO sub_counties(county_id,name) SELECT id,'Nyatike'         FROM counties WHERE code='043';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kuria West'      FROM counties WHERE code='043';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kuria East'      FROM counties WHERE code='043';
INSERT INTO sub_counties(county_id,name) SELECT id,'Bonchari'        FROM counties WHERE code='044';
INSERT INTO sub_counties(county_id,name) SELECT id,'South Mugirango' FROM counties WHERE code='044';
INSERT INTO sub_counties(county_id,name) SELECT id,'Bomachoge Borabu'FROM counties WHERE code='044';
INSERT INTO sub_counties(county_id,name) SELECT id,'Bobasi'          FROM counties WHERE code='044';
INSERT INTO sub_counties(county_id,name) SELECT id,'Bomachoge Chache'FROM counties WHERE code='044';
INSERT INTO sub_counties(county_id,name) SELECT id,'Nyaribari Masaba'FROM counties WHERE code='044';
INSERT INTO sub_counties(county_id,name) SELECT id,'Nyaribari Chache'FROM counties WHERE code='044';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kitutu Chache North'FROM counties WHERE code='044';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kitutu Chache South'FROM counties WHERE code='044';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kitutu Masaba'   FROM counties WHERE code='045';
INSERT INTO sub_counties(county_id,name) SELECT id,'West Mugirango'  FROM counties WHERE code='045';
INSERT INTO sub_counties(county_id,name) SELECT id,'North Mugirango' FROM counties WHERE code='045';
INSERT INTO sub_counties(county_id,name) SELECT id,'Borabu'          FROM counties WHERE code='045';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kilgoris Central'FROM counties WHERE code='046';
INSERT INTO sub_counties(county_id,name) SELECT id,'Transmara East'  FROM counties WHERE code='046';
INSERT INTO sub_counties(county_id,name) SELECT id,'Transmara West'  FROM counties WHERE code='046';
INSERT INTO sub_counties(county_id,name) SELECT id,'Westlands'       FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Dagoretti North' FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Dagoretti South' FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Langata'         FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kibra'           FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Roysambu'        FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kasarani'        FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Ruaraka'         FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Embakasi South'  FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Embakasi North'  FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Embakasi Central'FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Embakasi East'   FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Embakasi West'   FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Makadara'        FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Kamukunji'       FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Starehe'         FROM counties WHERE code='047';
INSERT INTO sub_counties(county_id,name) SELECT id,'Mathare'         FROM counties WHERE code='047';

-- ── COUNTY CROPS (flagship export crops) ────────────────────────
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Avocado',1    FROM counties WHERE code='020';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Tea',0        FROM counties WHERE code='020';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Coffee',0     FROM counties WHERE code='020';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Macadamia',0  FROM counties WHERE code='020';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Coffee',1     FROM counties WHERE code='018';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Tea',0        FROM counties WHERE code='018';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Macadamia',0  FROM counties WHERE code='018';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Macadamia',1  FROM counties WHERE code='012';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Coffee',0     FROM counties WHERE code='012';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Tea',0        FROM counties WHERE code='012';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Miraa',0      FROM counties WHERE code='012';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Purple Tea',1 FROM counties WHERE code='034';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Tea',1        FROM counties WHERE code='034';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Pyrethrum',1  FROM counties WHERE code='034';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Tea',1        FROM counties WHERE code='021';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Coffee',0     FROM counties WHERE code='021';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Avocado',0    FROM counties WHERE code='021';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Camel Milk',1 FROM counties WHERE code='010';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Livestock',0  FROM counties WHERE code='010';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Moringa',1    FROM counties WHERE code='011';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Camel Milk',0 FROM counties WHERE code='011';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Honey',0      FROM counties WHERE code='011';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Coconut Oil',1FROM counties WHERE code='003';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Cashew',1     FROM counties WHERE code='003';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Coconut Oil',1FROM counties WHERE code='002';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Cashew',1     FROM counties WHERE code='002';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Honey',1      FROM counties WHERE code='029';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Sorghum',0    FROM counties WHERE code='029';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Nile Perch',1 FROM counties WHERE code='042';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Tilapia',1    FROM counties WHERE code='042';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Mango',1      FROM counties WHERE code='016';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Green Grams',1FROM counties WHERE code='016';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Wheat',1      FROM counties WHERE code='026';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Maize',1      FROM counties WHERE code='026';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Wheat',1      FROM counties WHERE code='031';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Pyrethrum',1  FROM counties WHERE code='031';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Sugarcane',1  FROM counties WHERE code='036';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Maize',0      FROM counties WHERE code='036';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Rice',1       FROM counties WHERE code='019';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Coffee',0     FROM counties WHERE code='019';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Tea',1        FROM counties WHERE code='044';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Avocado',0    FROM counties WHERE code='044';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Tea',1        FROM counties WHERE code='035';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Pyrethrum',0  FROM counties WHERE code='035';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Irish Potatoes',1 FROM counties WHERE code='017';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Wheat',0      FROM counties WHERE code='017';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Pyrethrum',1  FROM counties WHERE code='017';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Sugarcane',1  FROM counties WHERE code='041';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Fish',0       FROM counties WHERE code='041';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Maize',1      FROM counties WHERE code='025';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Wheat',0      FROM counties WHERE code='025';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Sugarcane',1  FROM counties WHERE code='038';
INSERT INTO county_crops(county_id,crop_name,is_primary) SELECT id,'Maize',0      FROM counties WHERE code='038';

-- ── VERIFICATION QUERY ────────────────────────────────────────
SELECT r.name AS region,
       COUNT(c.id) AS county_count,
       SUM(sc_c.sub_count) AS sub_county_count,
       SUM(c.population) AS total_population
FROM   regions r
JOIN   counties c ON c.region_id = r.id
LEFT JOIN (
  SELECT county_id, COUNT(*) AS sub_count
  FROM   sub_counties
  GROUP  BY county_id
) sc_c ON sc_c.county_id = c.id
GROUP  BY r.id, r.name
ORDER  BY r.name;
-- Expected: 8 rows — total counties=47, total sub-counties=290+
