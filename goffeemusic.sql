-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: goffeemusic
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `albums`
--

DROP TABLE IF EXISTS `albums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `albums` (
  `albumId` int NOT NULL AUTO_INCREMENT,
  `albumName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `albumImg` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8_general_ci DEFAULT NULL,
  `albumDscrp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `canSee` int NOT NULL DEFAULT '1' COMMENT '1为可访问，0为不可访问',
  `status` int NOT NULL DEFAULT '0' COMMENT '1为过审，0为审核中，-1为打回修改',
  `createdById` int DEFAULT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`albumId`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `albums`
--

LOCK TABLES `albums` WRITE;
/*!40000 ALTER TABLE `albums` DISABLE KEYS */;
INSERT INTO `albums` VALUES (1,'Linkin Park','剑来了吗','https://i.ibb.co/6tvzTVB/1700725503991.jpg','林肯公园专场',1,1,1,NULL),(2,'小溜一下','剑来了吗','https://i.ibb.co/f0yDjNn/1707210684795.jpg','我超，冰！',1,1,1,NULL),(3,'Glitch Hop','剑来了吗','https://i.ibb.co/4WSDD1d/1700726603053.jpg','爆爆爆',1,1,1,NULL),(4,'Nightwish','剑来了吗','https://i.ibb.co/746z8jZ/1707996648677.jpg','夜愿专场',1,1,1,NULL),(5,'一厢情愿','SnhAenIgseAl','./assets/images/albumImg/1709815648079.jpg','感觉不如刻舟求剑',1,1,2,NULL),(19,'我和我想的那些','剑来了吗','https://i.ibb.co/DrHfLS1/1.png','你和你目空一切',1,1,1,NULL),(28,'刻舟求剑','SnhAenIgseAl','https://s2.loli.net/2024/06/29/BJrAvL4u1ltfYHj.jpg','感觉不如一厢情愿',1,1,2,NULL),(30,'丁真说唱专场','SAhneAInsgNeolt','https://i.ibb.co/nmRjKTy/1708926346337.jpg','The best rapper of China.',1,1,3,NULL),(48,'唉，唉！','SAhneAInsgNeolt','https://i.ibb.co/2SwSZYB/a0819f6b84a5c0c02cba4924044c142f401315430.jpg','你说得对，但是噼哩噼哩是听歌软件',1,1,3,NULL),(55,'枝江往事','SAhneAInsgNeolt','https://i.ibb.co/sbY2WsW/4.png',NULL,0,0,3,'歌单名称或简介存在违规信息');
/*!40000 ALTER TABLE `albums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `albumsongs`
--

DROP TABLE IF EXISTS `albumsongs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `albumsongs` (
  `albumId` int DEFAULT NULL,
  `songId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `songName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `songType` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `songImg` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `albumsongs`
--

LOCK TABLES `albumsongs` WRITE;
/*!40000 ALTER TABLE `albumsongs` DISABLE KEYS */;
INSERT INTO `albumsongs` VALUES (28,'29814898','可惜没如果','1','https://p2.music.126.net/QXZRckFTN5375vdQSyG0jA==/109951166919095160.jpg'),(1,'2095245665','In the End','1','https://p1.music.126.net/5YKqoun-X9j7WRob8cwLwA==/109951169019585713.jpg'),(1,'5191402','Numb','1','https://p1.music.126.net/dpcwR4BAM7Wp70h9T03Eyw==/776255209254840.jpg'),(1,'26711610','Crawling','1','https://p1.music.126.net/v0tZtHx5bexdnKRaZhCebA==/2590449395069810.jpg'),(3,'28923131','Pure Sunlight','1','https://p2.music.126.net/Qfvcm6wIfIf1K6NbezlEsQ==/109951163311230983.jpg'),(3,'1381414166','Cyberpunk','1','https://p2.music.126.net/IFEQzVmnUL5-L_JiI8C4hg==/109951164256042240.jpg'),(4,'545799707','Nemo (Remastered)','1','https://p1.music.126.net/9zGRzGtZRhjV0ywCZVv2vQ==/109951168195105067.jpg'),(4,'1429731759','I Want My Tears Back','1','https://p2.music.126.net/wYtAg4B0m2vN_6grbmXPGA==/109951164788987105.jpg'),(4,'4209157','She Is My Sin','1','https://p2.music.126.net/TK4eehKaatnOgvkUFW8AkQ==/1743825441666319.jpg'),(19,'1889581842','单流神','1','https://p2.music.126.net/dNyiuO3drb8R-alQTi6_gQ==/109951165928212749.jpg'),(19,'2071556965','扣下扳机 (Feat.普信主义)','1','https://p2.music.126.net/DiP_0d1Pw-YbxWwNPpcWaA==/109951168772171547.jpg'),(30,'2104787139','1376赫兹（痛苦琉说唱）','1','https://p2.music.126.net/39ZjsYRGEik6aeHkU6Jktw==/109951169027182725.jpg'),(30,'2065920991','［丁真］Da Da Da（大大大）','1','https://p1.music.126.net/a94HKpnll7JHuei_xAalIQ==/109951168753741739.jpg'),(30,'2042679946','自抽巷','1','https://p1.music.126.net/-mK8pP1yon36qwPFGIsZpQ==/109951169241930290.jpg'),(30,'2017473479','Nayanion (V Remastered)','1','https://p2.music.126.net/TmeXAjRSIRBbEUwom9w3cw==/109951168262329478.jpg'),(30,'2015403477','One Last Smoke(L.T.C Version)','1','https://p1.music.126.net/DeWwdNumwZJVObITnRuK3A==/109951168243054818.jpg'),(5,'150852','耶利亚女郎','1','https://p1.music.126.net/jtADdORWDEOF51rBq27Yqg==/109951165875960562.jpg\")'),(2,'MUSIC_244258616','秒针 (热歌DJ串烧版)','4','https://img2.kuwo.cn/star/albumcover/1120/89/71/1547734945.jpg'),(2,'0B564404087174C2430B32914538E7E5','执迷不悟','3','http://singerimg.kugou.com/uploadpic/softhead/////20230420/20230420152509532219.jpg'),(2,'936594FA1EE794EDFFF061B70D95E03A','吻得太逼真','3','http://singerimg.kugou.com/uploadpic/softhead/////20231023/20231023095914645.jpg'),(2,'2015301843','I Got Love (Rakurs ','1','https://p2.music.126.net/81QsjtBacKgZ856Qy2IMAg==/109951168242157204.jpg'),(30,'2111394143','Smoke Forever','1','https://p1.music.126.net/wJ5mvPPEh6441CIqIGNeqw==/109951169205704129.jpg'),(2,'1493721315','断水流','1','https://p1.music.126.net/pnwb8qdjDCYH_GWsPv9FDw==/109951165450525058.jpg'),(1,'30148051','What I\'ve Done','1','https://p1.music.126.net/XVjxBCeGLyVbJGvipXFOvw==/7703178464355911.jpg'),(48,'BV11d4y1f7wz','百万级装备试听 Billie Jean - Michael Jackson 迈克尔杰克逊【Hi-Res】','4','https://images.weserv.nl/?url=//i1.hdslb.com/bfs/archive/6aa90385d534b651706e1258423c41d5b2e7cb53.jpg'),(48,'BV1gk4y1A7Zx','百万级装备试听Dangerous - Michael Jackson 迈克尔·杰克逊【Hi-Res】','4','https://images.weserv.nl/?url=//i2.hdslb.com/bfs/archive/bf323468f1690f17459b69140d8cf92e3197afaa.jpg'),(48,'BV1Ek4y1r7Rg','【4K修复】周杰伦 - 夜曲 MV 2160P修复版 新专辑《最伟大的作品》即将发行','4','https://images.weserv.nl/?url=//i1.hdslb.com/bfs/archive/276f0b99946cc11ba336b7f46f69611f1c892b15.jpg'),(48,'BV12o4y1N7kc','【4K Hi-Res】烟花易冷-周杰伦   我听闻 你始终一个人','4','https://images.weserv.nl/?url=//i0.hdslb.com/bfs/archive/e563b722fa087a07f34aa28abb17ff6a5355da75.jpg'),(48,'BV1EG411P7Su','在百万级录音棚听周杰伦《<em class=\"keyword\">飘移</em>》【Hi-Res】','4','https://images.weserv.nl/?url=//i1.hdslb.com/bfs/archive/2c742349d03a3a1316eff7514c3f373a195677ec.jpg'),(48,'BV1rN411p7R5','在百万豪装录音棚大声听 林俊杰《杀手》【Hi-res】','4','https://images.weserv.nl/?url=//i0.hdslb.com/bfs/archive/8fdc257ccd6502c99945d0bb99c619c8de8b610b.jpg'),(30,'2164150974','I Got Smoke - Explicit Ver. (2024) (Extended Mix)','1','https://p2.music.126.net/9F_3Wp5UZPyD44Msbe5Yvg==/109951169663125259.jpg'),(30,'BV1KC411V7nw','孩子们我回来了！Mamba Out主理人Ice Smoker 《烟如止水》','4','https://images.weserv.nl/?url=//i1.hdslb.com/bfs/archive/09f09553532de082e4949fa61097ef5773e9237b.jpg'),(55,'BV1vQ4y1Z7C2','【原创音乐】《超级敏感》A-SOUL全新团曲MV','4','https://images.weserv.nl/?url=http://i0.hdslb.com/bfs/archive/61ef98427554f1a9cd7eed7c8bb2871d5d59d94c.jpg'),(55,'BV1M64y1a7zh','【A-SOUL/贝&珈&嘉】太潮啦！师徒三人演绎《隔岸 (DJ)》','4','https://images.weserv.nl/?url=http://i2.hdslb.com/bfs/archive/d9cf05f76bec37d9333415d528e24a341872e681.jpg'),(55,'BV1PN411X7QW','【A-SOUL/珈乐】《红色高跟鞋》','4','https://images.weserv.nl/?url=http://i0.hdslb.com/bfs/archive/9dbd47dd81ce7e16871738a61d5c5fb0ba8faf14.jpg'),(55,'BV1yF411q774','最后的温柔给珈乐。','4','https://images.weserv.nl/?url=http://i0.hdslb.com/bfs/archive/92c6697184b396072e48ea249f44f9deab66cb3c.jpg');
/*!40000 ALTER TABLE `albumsongs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `managehistory`
--

DROP TABLE IF EXISTS `managehistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `managehistory` (
  `mngId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetId` int DEFAULT NULL,
  `time` int DEFAULT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`mngId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `managehistory`
--

LOCK TABLES `managehistory` WRITE;
/*!40000 ALTER TABLE `managehistory` DISABLE KEYS */;
INSERT INTO `managehistory` VALUES (1,3,'SAhneAInsgNeolt','U-1',1,1720767057,'用户名或简介存在违规信息'),(2,3,'SAhneAInsgNeolt','U1',1,1720767060,NULL),(3,3,'SAhneAInsgNeolt','A-1',1,1720768159,'歌单名称或简介存在违规信息'),(4,3,'SAhneAInsgNeolt','A-1',2,1720768175,'歌单名称或简介存在违规信息'),(5,3,'SAhneAInsgNeolt','A1',1,1720768366,NULL),(6,3,'SAhneAInsgNeolt','A1',2,1720768367,NULL),(7,3,'SAhneAInsgNeolt','A1',54,1720770874,NULL),(8,3,'SAhneAInsgNeolt','A-1',30,1720783190,'歌单名称或简介存在违规信息'),(9,3,'SAhneAInsgNeolt','A1',30,1720783514,NULL),(10,3,'SAhneAInsgNeolt','A1',55,1720848650,NULL),(11,3,'SAhneAInsgNeolt','A1',48,1720848897,NULL),(12,3,'SAhneAInsgNeolt','A1',55,1720852927,NULL),(13,3,'SAhneAInsgNeolt','A1',48,1721027646,NULL),(14,3,'SAhneAInsgNeolt','A-1',55,1721027774,'歌单名称或简介存在违规信息');
/*!40000 ALTER TABLE `managehistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userinfo`
--

DROP TABLE IF EXISTS `userinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userinfo` (
  `userId` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userImg` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8_general_ci DEFAULT NULL,
  `userDscrp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `canSee` int NOT NULL DEFAULT '1' COMMENT '1为可访问，0为不可访问',
  PRIMARY KEY (`userId`),
  KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userinfo`
--

LOCK TABLES `userinfo` WRITE;
/*!40000 ALTER TABLE `userinfo` DISABLE KEYS */;
INSERT INTO `userinfo` VALUES (1,'剑来了吗','https://i.ibb.co/GcdMnGb/1720354543.png','李淳罡大声道：“剑来！”   徽山所有剑士的数百佩剑一齐出鞘，向大雪坪飞来。   龙虎山道士合式千柄桃木剑一概出鞘，浩浩荡荡飞向牯牛大岗。   两波飞剑。   遮天蔽日。   这一日，李淳罡再入陆地剑仙境界。',0),(2,'SnhAenIgseAl','https://i.ibb.co/9N9wFSp/image.png','我感觉我是互联网皇帝。第一我阴晴不定；第二我生性多疑；第三看见美女就想占有；第四看谁不爽就想诛他九族；第五朕是天子从来不会有错。',1),(3,'SAhneAInsgNeolt','https://i.ibb.co/4W2fRj2/003412cd2d44d85703e23121d33f7f6b1795147802.jpg','扎西德勒',1),(4,'Kiddo','','',1),(5,'冯帅帅','','',1),(10,'太刀天才','','我不是虾头太刀',1),(21,'321','','321',1);
/*!40000 ALTER TABLE `userinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userRank` int DEFAULT '1' COMMENT '1位普通用户，9为管理员，9999为皇帝',
  `status` int DEFAULT '1' COMMENT '1为正常，0为冻结，-1为封号',
  `code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '管理员验证码',
  `errCount` int DEFAULT '0',
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'剑来了吗','3667399166@qq.com','613987','2f9c0de4e0a236c0a1597438b1091fcc',1,1,NULL,0,NULL),(2,'SnhAenIgseAl','2787824308@qq.com','613987','2f9c0de4e0a236c0a1597438b1091fcc',9,1,'802653',1,NULL),(3,'SAhneAInsgNeolt','1789561096@qq.com','613987','2f9c0de4e0a236c0a1597438b1091fcc',9999,1,'722525',0,NULL),(4,'Kiddo','','613987','2f9c0de4e0a236c0a1597438b1091fcc',1,1,NULL,0,NULL),(5,'冯帅帅','','613987','2f9c0de4e0a236c0a1597438b1091fcc',1,1,NULL,0,NULL),(10,'太刀天才',NULL,'613987','2f9c0de4e0a236c0a1597438b1091fcc',1,1,NULL,0,NULL),(21,'321',NULL,'613987','2f9c0de4e0a236c0a1597438b1091fcc',1,1,NULL,0,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-15 20:33:54
