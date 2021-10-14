-- phpMyAdmin SQL Dump
-- version 5.1.1deb3+bionic1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 14, 2021 at 06:35 AM
-- Server version: 5.7.35-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `waterzen`
--

-- --------------------------------------------------------

--
-- Table structure for table `government`
--

CREATE TABLE `government` (
  `id` int(11) NOT NULL,
  `officialName` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `managerName` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phoneNum` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `merchant`
--

CREATE TABLE `merchant` (
  `id` int(11) NOT NULL,
  `brand` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `businessCategory` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postcode` int(11) NOT NULL,
  `managerName` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phoneNum` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `qualityData`
--

CREATE TABLE `qualityData` (
  `id` int(11) NOT NULL,
  `placeName` varchar(256) NOT NULL,
  `country` varchar(256) NOT NULL DEFAULT 'Australia',
  `state` varchar(256) NOT NULL,
  `city` varchar(256) DEFAULT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `electricalConductivity` float DEFAULT NULL,
  `pH` double DEFAULT NULL,
  `temperature` double NOT NULL,
  `totalDissolvedSolids` float DEFAULT NULL,
  `waterTurbidity` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `qualityData`
--

INSERT INTO `qualityData` (`id`, `placeName`, `country`, `state`, `city`, `latitude`, `longitude`, `date`, `electricalConductivity`, `pH`, `temperature`, `totalDissolvedSolids`, `waterTurbidity`) VALUES
(1, 'Portsea Beach', 'Australia', 'VIC', 'Melbourne', -38.3183, 144.717, '2021-09-16 05:50:22', 412.9, 7.84, 22.6, 554.23, 2.3),
(2, 'Sorrento Beach', 'Australia', 'VIC', 'Melbourne', -38.3378, 144.744, '2021-09-14 13:07:38', 662.4, 7.36, 23.5, 134.76, 3.5),
(3, 'Dandenong Creek', 'Australia', 'VIC', 'Melbourne', -37.94, 145.22, '2021-09-19 09:30:33', 368.3, 7.67, 21.4, 227.99, 2.2),
(4, 'St Kilda beach', 'Australia', 'VIC', 'Melbourne', -37.8667, 144.974, '2021-09-28 03:25:40', 159.6, 7.21, 22.5, 386.21, 1.6),
(5, 'Yarra River', 'Australia', 'VIC', 'Melbourne', -37.82, 144.95, '2021-09-16 06:48:51', 276.2, 7.37, 23.6, 267.6, 2.6),
(6, 'De Grey River - Coolenar Pool', 'Australia', 'WA', 'De Grey', -20.31, 119.25, '2021-09-16 00:00:00', 115.4, 9.09, 29.1, 436, 2.1),
(7, 'Gungahlin Catchment West', 'Australia', 'ACT', 'Canberra', -35.21, 149.1, '2021-09-16 06:51:52', 244.2, 9.09, 25.1, 5.51, 4.4),
(8, 'Mackintosh River', 'Australia', 'TAS', 'below Mount Remus', -41.44, 145.3, '2021-09-16 06:51:58', 155, 7.6, 32, 452, 2.5),
(9, 'Flowerdale River', 'Australia', 'TAS', 'North West Tasmania', -40.58, 145.39, '2021-09-16 06:54:45', 452, 4.1, 29.2, 817, 3.1),
(10, 'Turner at Barry Drive', 'Australia', 'ACT', 'Canberra', -35.27, 149.12, '2021-09-16 06:57:24', 424.7, 7.76, 24.8, 201.2, 2.1),
(11, 'Calder River', 'Australia', 'TAS', 'Henrietta', -41.1, 145.41, '2021-09-16 06:57:51', 352, 8.2, 21, 821, 3),
(12, 'Harding River 2 - Lyre Creek Well', 'Australia', 'WA', 'Cooya Pooya', -21.18, 117.22, '2021-09-16 07:03:39', 173.8, 6.95, 25.1, 98, 11.2),
(13, 'Davey River', 'Australia', 'TAS', 'Port Davey', -43.12, 145.56, '2021-09-16 07:07:38', 523, 8.2, 22.6, 782, 4.1),
(14, 'Cane River - Toolunga', 'Australia', 'WA', 'Pilbara', -22.02, 115.59, '2021-09-16 07:09:12', 111.9, 8.82, 29.2, 74, 2),
(15, 'Frankland River', 'Australia', 'TAS', 'Sumac Forest Reserve', -41.15, 144.57, '2021-09-16 07:10:17', 378, 5.3, 23, 798, 3.2),
(16, 'Spero River', 'Australia', 'TAS', 'Point Hibbs', -42.4, 145.34, '2021-09-16 07:13:13', 387, 7.1, 20.4, 498, 2.4),
(17, 'Lyndon River - Badyeeda Pool', 'Australia', 'WA', 'Carnarvon', -23.48, 114.18, '2021-09-16 07:14:55', 111, 9.36, 30.3, 521, 3),
(18, 'Wooramel River - Steadmans', 'Australia', 'WA', 'Carnarvon', -25.76, 114.28, '2021-09-16 07:18:22', 244.2, 6.97, 25.8, 243, 2.9),
(19, 'Hellyer River', 'Australia', 'TAS', 'North-western Tasmania', -41.16, 145.46, '2021-09-16 07:18:22', 598, 5.9, 19.2, 642, 2.9),
(20, 'Nokanena Brook - Wootachooka', 'Australia', 'WA', 'Northampton', -28.37, 114.52, '2021-09-16 07:21:56', 213.7, 7.27, 27.2, 42.7, 2.5),
(21, 'Pithara - Pithara D Strm PTDWS', 'Australia', 'WA', 'Pithara', -30.36, 116.87, '2021-09-16 07:29:44', 269.3, 7.46, 25.1, 236, 3.9),
(22, 'Molonglo Temporary AWS East', 'Australia', 'ACT', 'Canberra', -35.3, 149.06, '2021-09-16 07:34:23', 329.7, 7.76, 25.2, 96.4, 1.3),
(23, 'Long Gully Creek at Phillip', 'Australia', 'ACT', 'Canberra', -35.35, 149.1, '2021-09-16 07:34:23', 452.6, 6.53, 20.6, 100.8, 2.3),
(24, 'Yarralumla Creek at Curtin', 'Australia', 'ACT', 'Canberra', -35.33, 149.09, '2021-09-16 07:34:23', 238.7, 7.45, 23.6, 657.4, 3),
(26, 'Tweed River', 'Australia', 'NSW', 'Tweed', -28.2848, 153.461, '2021-09-16 07:36:07', 27621.5, 7.38, 27.17, 690.4, 2.37),
(27, 'Cudgen Creek', 'Australia', 'NSW', 'Cudgen', -28.2662, 153.58, '2021-09-16 07:36:07', 52327.5, 7.61, 19.03, 772, 0.66),
(34, 'Tamar River', 'Australia', 'TAS', 'Launceston', -41.26, 147.7, '2021-09-16 07:37:08', 558, 7.2, 24.2, 513, 3),
(35, 'Queanbeyan River U/S Googong Dam', 'Australia', 'ACT', 'Canberra', -35.52, 149.29, '2021-09-16 07:40:03', 583.4, 7.8, 21.9, 583.4, 2.4),
(36, 'Cudgera Creek', 'Australia', 'NSW', 'Cudgera Creek', -28.3771, 153.566, '2021-09-16 07:41:21', 12691.9, 6.91, 28.9, 268, 10.8),
(37, 'Mooball Creek\r\n', 'Australia', 'NSW', 'Mooball', -28.3934, 153.566, '2021-09-16 07:41:21', 53487.6, 7.73, 19.47, 635.66, 3.28),
(38, 'Pieman River', 'Australia', 'TAS', 'below Tullah', -41.4, 144.55, '2021-09-16 07:41:35', 401, 6.7, 19.8, 571, 4.2),
(39, 'Artesian Monitoring - AM21C', 'Australia', 'WA', 'Perth', -31.87, 115.76, '2021-09-16 07:41:46', 122.8, 7.39, 18.5, 72, 2.5),
(40, 'Hobart Rivulet', 'Australia', 'TAS', 'Hobart', -42.54, 147.14, '2021-09-16 07:43:53', 623, 7.6, 25, 101, 2.3),
(41, 'Brunswick River', 'Australia', 'NSW', 'Brunswick Heads', -28.5426, 153.501, '2021-09-16 07:45:27', 30550, 7.55, 25.54, 115, 8.1),
(42, 'Belongil Creek', 'Australia', 'NSW', 'Belongil', -28.6364, 153.595, '2021-09-16 07:45:27', 50241.5, 7.41, 22.62, 268.33, 3.03),
(43, 'Nambeelup Brook - Kielman', 'Australia', 'WA', 'Nambeelup', -32.52, 115.83, '2021-09-16 07:46:05', 245.1, 7, 25.8, 234, 1.3),
(44, 'Isis River', 'Australia', 'TAS', 'north west of Campbell Town', -41.49, 147.14, '2021-09-16 07:46:18', 381, 5.5, 24.7, 902, 1.2),
(45, 'Denison River', 'Australia', 'TAS', 'South West region', -41.2, 146.22, '2021-09-16 07:48:14', 536, 7, 25.1, 892, 2.7),
(46, 'Tallow Creek', 'Australia', 'NSW', 'Tallow', -28.6686, 153.619, '2021-09-16 07:48:41', 11383.2, 7.48, 24.27, 269.45, 1.12),
(47, 'Broken Head Creek', 'Australia', 'NSW', 'Broken Head', -28.9093, 153.507, '2021-09-16 07:48:41', 30769.3, 7.67, 24.85, 39.64, 3.23),
(49, 'Queen River', 'Australia', 'TAS', 'Queenstown', -42, 145.34, '2021-09-16 07:50:52', 554, 4.8, 21.2, 716, 3.4),
(50, 'Kambah Pluvio at Woolshed', 'Australia', 'ACT', 'Canberra', -35.39, 149.06, '2021-09-16 07:52:06', 635.4, 6.84, 20.3, 466.1, 4.1),
(51, 'Deakin behind Telecom Centre', 'Australia', 'ACT', 'Canberra', -35.33, 149.1, '2021-09-16 07:52:06', 445.6, 6.74, 19.4, 521.2, 1.2),
(52, 'Stirling College', 'Australia', 'ACT', 'Canberra', -35.35, 149.05, '2021-09-16 07:53:33', 185.4, 6.84, 20.4, 485.1, 2.1),
(53, 'Chifley at Waldock Street', 'Australia', 'ACT', 'Canberra', -35.35, 149.07, '2021-09-16 07:53:33', 246.5, 7.56, 23.4, 854.6, 3.4),
(54, 'Farrer at Hawkesbury Crescent', 'Australia', 'ACT', 'Canberra', -35.38, 149.11, '2021-09-16 07:53:33', 456.1, 6.52, 20.8, 652.1, 1.3),
(55, 'Torrens at Batchelor Street', 'Australia', 'ACT', 'Canberra', -35.37, 149.09, '2021-09-16 07:53:34', 458.4, 6.32, 23.6, 568.1, 1.6),
(56, 'Lake Burley Griffin at Scrivener Dam HW', 'Australia', 'ACT', 'Canberra', -35.34, 149.24, '2021-09-16 07:53:34', 758.6, 6.98, 20.4, 465.4, 2.6),
(57, 'Queanbeyan River at A.C.T. Border', 'Australia', 'ACT', 'Canberra', -35.34, 149.23, '2021-09-16 07:53:34', 634.1, 7.65, 21.6, 854.2, 2.3),
(58, 'Lake Ginninderra at Dam', 'Australia', 'ACT', 'Canberra', -35.22, 149.07, '2021-09-16 07:53:34', 635.4, 7.65, 19.8, 684.4, 3.6),
(60, 'Molonglo River below Coppins Crossing', 'Australia', 'ACT', 'Molonglo Valley', -35.27, 149.01, '2021-09-16 07:53:34', 758.2, 6.34, 18.65, 758.5, 3.4),
(61, 'Molonglo Temporary AWS West', 'Australia', 'ACT', 'Molonglo Valley', -35.28, 149.03, '2021-09-16 07:53:34', 753.1, 7.85, 21.83, 682.4, 1),
(62, 'Murrumbidgee River at Lobbs Hole Creek', 'Australia', 'ACT', 'Monaro Hwy', -35.54, 149.1, '2021-09-16 07:53:34', 854, 6.38, 23.4, 272.1, 1.1),
(63, 'Back Flats', 'Australia', 'ACT', 'Canberra', -35.52, 148.91, '2021-09-16 07:53:34', 738.8, 7.9, 21, 282.1, 0.4),
(64, 'Lagoon/Purplevale at Burra', 'Australia', 'ACT', 'Burra', -35.54, 149.22, '2021-09-16 07:53:34', 824.2, 7.5, 20.1, 572.1, 2.1),
(65, 'Harvey River - Forrest Highway', 'Australia', 'WA', 'Waroona', -32.82, 115.74, '2021-09-16 07:58:05', 169, 7.23, 25, 124.9, 2.6),
(66, 'Guolburn River', 'Australia', 'VIC', 'Eildon', -37.23, 145.91, '2021-09-16 08:05:39', 132.4, 7.11, 24.5, 356.7, 2.1),
(67, 'Koonya Beach', 'Australia', 'VIC', 'Blairgowrie', -38.3617, 144.752, '2021-09-16 08:16:49', 427.4, 7.21, 22.1, 574.3, 0),
(68, 'Tennant Crk - Central', 'Australia', 'NT', 'Tennant Creek', -19.57, 134.21, '2021-09-19 08:30:22', 539.8, 7.95, 21.65, 226.5, 1.6),
(69, 'Jilkminggan', 'Australia', 'NT', 'Jilkminggan', -14.96, 133.27, '2021-09-19 08:30:22', 641.5, 6.53, 19.4, 654.6, 3.3),
(70, 'Kintore Crk - D/S', 'Australia', 'NT', 'Kintore', -23.29, 129.39, '2021-09-19 08:30:22', 695.1, 8.43, 22.8, 653.1, 4.3),
(71, 'Finniss River - Gitchams Xng', 'Australia', 'NT', 'Darwin', -12.97, 130.76, '2021-09-19 08:30:22', 158.4, 7.32, 19.6, 206.5, 3.8),
(72, 'Goyder River - Central Arnhemland Hwy', 'Australia', 'NT', 'Arnhem Land', -12.97, 135.01, '2021-09-19 08:30:22', 650.1, 7.98, 19.4, 665.4, 2.9),
(73, ' Todd River - Heavitree Gap', 'Australia', 'NT', 'Ilparpa', -23.73, 133.86, '2021-09-19 08:30:22', 234.1, 6.65, 21.9, 804.2, 2.1),
(74, 'Gunn Point Rd', 'Australia', 'NT', 'Darwin', -12.46, 131.08, '2021-09-19 08:30:22', 335.4, 6.55, 21.8, 954.4, 4.2),
(75, 'Goulburn River', 'Australia', 'VIC', 'Seymour', -37.02, 145.11, '2021-09-16 13:38:17', 213.5, 7.17, 22.8, 381.3, 1.1),
(76, 'Lake Eppalock', 'Australia', 'VIC', 'Eppalock', -36.85, 144.53, '2021-09-16 13:47:40', 197.7, 7.24, 21.2, 153.9, 2.5),
(77, 'Loddon River', 'Australia', 'VIC', 'Bendigo', -36.99, 143.97, '2021-09-16 13:51:08', 236.1, 7.31, 21.5, 458.3, 1.7),
(78, 'Tullaroop Reservoir', 'Australia', 'VIC', NULL, -37.09, 143.86, '2021-09-16 14:13:40', 674.2, 6.99, 23.3, 589.3, 2),
(79, 'Ocean Grove', 'Australia', 'VIC', 'Ocean Grove', -38.27, 144.53, '2021-09-16 14:14:59', 753.2, 7.33, 24.6, 692.1, 3.6),
(80, 'Anglesea River', 'Australia', 'VIC', NULL, -38.41, 144.19, '2021-09-16 14:16:24', 426.9, 6.89, 19.4, 327.6, 1.4),
(81, 'Cumberland River', 'Australia', 'VIC', NULL, -38.57, 143.95, '2021-09-16 14:17:37', 323.4, 7.33, 19.9, 284.9, 1.9),
(82, 'Barham River', 'Australia', 'VIC', 'Marengo', -38.77, 143.63, '2021-09-16 14:19:22', 165.7, 7.01, 20.3, 179, 2.1),
(83, 'Gellibrand River', 'Australia', 'VIC', 'Princetown', -38.7, 143.16, '2021-09-16 14:21:46', 642.1, 6.89, 17.9, 431.5, 3.2),
(84, 'Merri River', 'Australia', 'VIC', 'Warrnambool', -38.38, 142.44, '2021-09-16 14:23:05', 197.5, 7.1, 23.4, 541.2, 2.5),
(85, 'Curdies River', 'Australia', 'VIC', 'Peterborough', -38.56, 142.86, '2021-09-16 14:24:25', 650.9, 7.23, 24.1, 521.3, 2.8),
(86, 'Lake Colac', 'Australia', 'VIC', 'Colac', -38.34, 143.59, '2021-09-16 14:25:48', 131.1, 7.01, 19.8, 120.7, 1.1),
(88, 'Richmond River', 'Australia', 'NSW', 'Hawkesbury', -28.8993, 153.523, '2021-09-16 14:37:37', 26604.5, 7.67, 24.32, 546.2, 12.1),
(89, 'Salty Lagoon', 'Australia', 'NSW', 'Broadwater', -29.0764, 153.432, '2021-09-16 14:37:37', 34172, 7.53, 30.62, 585.63, 0.71),
(90, 'Lake Borrie', 'Australia', 'VIC', 'Melbourne', -38, 144.55, '2021-09-16 14:40:58', 132.4, 7.02, 23.6, 199.6, 1.5),
(91, 'Evans River', 'Australia', 'NSW', 'Evans Head', -29.085, 153.34, '2021-09-16 14:42:29', 36600, 8.36, 26.49, 113.44, 5.6),
(92, 'Jerusalem Creek\r\n', 'Australia', 'NSW', 'Chichester', -29.2451, 153.368, '2021-09-16 14:42:29', 35769.7, 7.59, 24.88, 20.36, 1.46),
(97, 'Lake Arragan', 'Australia', 'NSW', 'Yuraygir', -29.5629, 153.332, '2021-09-16 14:48:58', 30807, 6.02, 28.38, 486.1, 8.1),
(98, 'Cakora Lagoon\r\n', 'Australia', 'NSW', 'Brooms Head', -29.5954, 153.33, '2021-09-16 14:48:58', 1952, 6.02, 27.97, 25.69, 11.85),
(99, 'Sandon River', 'Australia', 'NSW', NULL, -29.7082, 153.284, '2021-09-16 14:52:51', 30000, 6, 18, 852.4, 7.5),
(100, 'Wooli Wooli River', 'Australia', 'NSW', 'Wooli', -29.8486, 153.235, '2021-09-16 14:52:51', 46262.3, 7.74, 22.82, NULL, 1.66),
(101, 'Station Creek', 'Australia', 'NSW', 'Barcoongere', -29.9429, 153.244, '2021-09-16 14:57:01', 51480.8, 7.81, 20.25, 22.1, 1.69),
(102, 'Corindi River', 'Australia', 'NSW', NULL, -29.9942, 153.207, '2021-09-16 14:57:01', 48336.9, 7.64, 21.68, 258.36, 3.1),
(103, 'Pipe Clay Creek', 'Australia', 'NSW', 'Big Yengo', -30.0214, 153.206, '2021-09-16 14:59:48', 5706.7, 8.1, 22.27, NULL, 0.91),
(104, 'Arrawarra Creek', 'Australia', 'NSW', 'Woolgoolga', -30.0649, 153.19, '2021-09-16 14:59:48', 53967.6, 7.83, 25.75, 484.1, 13.69),
(105, 'Blackwood Trib Beenup Wetlands - Outflow', 'Australia', 'WA', 'Augusta', -34.23, 115.25, '2021-09-18 08:40:17', 82.8, 6.92, 32.2, 201.8, 1.7),
(106, 'Barlee Brook - Andrew Road', 'Australia', 'WA', 'Manjimup', -34.12, 115.87, '2021-09-18 08:44:34', 48.1, 7.57, 27.5, 87.2, 0.78),
(107, 'Deep River - Teds Pool', 'Australia', 'WA', 'Manjimup', -34.77, 116.62, '2021-09-18 08:47:55', 52.5, 8.95, 29.6, 22.7, 1.2),
(108, 'Kalgan River - Geriberiwelup Swamp', 'Australia', 'WA', 'Cranbrook', -34.47, 117.84, '2021-09-18 08:50:27', 41.9, 8.59, 27.9, 323.1, 3.3),
(109, 'Pallinup River - Bull Crossing', 'Australia', 'WA', 'Albany', -34.34, 118.66, '2021-09-18 08:53:36', 133.9, 8.21, 28.1, 38.2, 0.7),
(110, 'Fitzgerald River - Jacup', 'Australia', 'WA', 'West Fitzgerald', -33.88, 119.32, '2021-09-18 08:56:57', 221.6, 7.24, 30.1, 62.7, 3.7),
(111, 'Lort River - Dundas Goldfield', 'Australia', 'WA', 'Goldfields-Esperance', -33.35, 121.34, '2021-09-18 08:59:27', 67, 8.23, 33.6, 50, 1.3),
(112, 'Drysdale River - Donkey Road', 'Australia', 'WA', 'Kimberley', -15.95, 126.33, '2021-09-18 09:02:13', 70.2, 6.33, 28.7, 672, 3.7),
(113, 'Shaw River - Bamboo Spring No 1', 'Australia', 'WA', 'Nullagine', -22.07, 119.71, '2021-09-18 09:04:45', 48.9, 6.16, 27.1, 73.9, 1.6),
(114, 'Lyons River - Homestead', 'Australia', 'WA', 'Gascoyne', -24.63, 115.34, '2021-09-18 09:07:56', 81.4, 7.7, 28, 182, 10.8),
(115, 'Hill River - Hill River Springs', 'Australia', 'WA', 'Wheatbelt', -30.28, 115.37, '2021-09-18 09:10:37', 106.7, 6.83, 27.2, 223, 20.5),
(116, 'Bore Hole at Streaky Bay', 'Australia', 'SA', 'Forrest', -32.85, 134.28, '2021-09-18 09:40:26', 124.7, 7.05, 26, 130.2, 2.9),
(117, 'Tod River Catchment Pluviometer at Kopulta Well', 'Australia', 'SA', 'Yallunda Flat', -34.38, 135.85, '2021-09-18 09:44:18', 238.2, 7.35, 27.6, 12.4, 3.3),
(118, 'Willochra Creek at Partacoona', 'Australia', 'SA', 'Far North', -31.95, 138.1, '2021-09-18 09:47:04', 55.9, 8.72, 27.8, 25, 2.9),
(119, 'Broughton River at Mooroola', 'Australia', 'SA', 'Yacka', -33.53, 138.52, '2021-09-18 09:50:27', 642.4, 7.45, 26.7, 311, 2.4),
(120, 'Gawler River at Gawler Junction', 'Australia', 'SA', 'Adelaide', -34.6, 138.74, '2021-09-18 09:52:13', 178.5, 7.83, 30, 228, 2.13),
(121, 'Sturt River upstream Flood Control Dam', 'Australia', 'SA', 'Adelaide', -35.04, 138.59, '2021-09-18 12:37:35', 53.5, 7.37, 27.5, 90.6, 3.1),
(122, 'MYPONGA RIVER @ U/S Dam And Road Bridge', 'Australia', 'SA', 'Yankalilla', -35.38, 138.48, '2021-09-18 12:41:01', 396, 6.77, 26.5, 225.7, 2.2),
(123, 'River Murray EC Pontoon at Tailem Bend', 'Australia', 'SA', 'Rural City of Murray Bridge', -35.28, 139.45, '2021-09-18 12:43:56', 68.2, 8.26, 29, 30, 1.6),
(124, 'Brisbane River', 'Australia', 'QLD', 'Brisbane', -26.39, 152.22, '2021-09-20 05:40:30', 355.2, 9.4, 29.3, 456.3, 3.2),
(125, 'Flinders River', 'Australia', 'QLD', 'North West Queensland', -17.35, 140.35, '2021-09-20 05:42:56', 753.4, 6.4, 23.5, 544.3, 0.2),
(126, 'Condamine River', 'Australia', 'QLD', 'Darling Downs', -28.14, 152.28, '2021-09-20 05:42:56', 843.2, 6.4, 23.1, 433.2, 4.2),
(127, 'Fitzroy River', 'Australia', 'QLD', 'Rockhampton', -23.37, 149.46, '2021-09-20 05:44:54', 532.5, 9.4, 32.4, 344.2, 3.2),
(128, 'Mary River', 'Australia', 'QLD', 'South East Queensland', -26.47, 152.44, '2021-09-20 05:44:54', 355.6, 5.6, 23.8, 356.3, 2.4),
(129, 'Macintyre River', 'Australia', 'QLD', 'Northern Tablelands', -28.37, 149.53, '2021-09-20 05:56:05', 694.2, 9.6, 32.3, 554.32, 1.3),
(130, 'Herbert River', 'Australia', 'QLD', 'Ingham', -17.41, 145.15, '2021-09-20 05:56:05', 455.6, 6.4, 32.1, 754.3, 2.3),
(131, 'Burdekin River', 'Australia', 'QLD', 'Charters Towers', -18.42, 145.44, '2021-09-20 05:56:05', 643.22, 5.6, 23.6, 664.32, 1.9),
(132, 'Logan River', 'Australia', 'QLD', 'Beaudesert', -27.41, 153.2, '2021-09-20 05:56:05', 743.2, 6.4, 33.5, 557.4, 2.7),
(133, 'Tully River', 'Australia', 'QLD', 'Tully', -17.58, 145.37, '2021-09-20 05:56:05', 544.3, 3.7, 32.6, 445.7, 2.73),
(134, 'Pimpama River', 'Australia', 'QLD', 'Gold Coast', -27.47, 153.21, '2021-09-20 05:56:05', 743.1, 8.5, 34.5, 113.5, 2.1),
(135, 'Paroo River', 'Australia', 'QLD', 'South West Queensland', -26.07, 145.1, '2021-09-20 05:56:05', 754.2, 3.6, 32.1, 443.7, 3.5),
(136, 'Balonne River', 'Australia', 'QLD', 'St George', -28.43, 148.03, '2021-09-20 05:56:05', 575.3, 6.4, 23.6, 567.3, 3.5),
(137, 'Severn River', 'Australia', 'QLD', 'Darling Downs', -28.4, 151.54, '2021-09-20 05:56:05', 533.2, 13.5, 25.7, 459.7, 4.3),
(138, 'Russell River', 'Australia', 'QLD', 'Far North Queensland', -17.23, 145.44, '2021-09-20 05:56:05', 346.3, 5.4, 31.3, 765.4, 3.1),
(139, 'Clyde River', 'Australia', 'TAS', 'south of Hamilton', -42.34, 146.48, '2021-09-20 05:56:07', 472, 5.3, 23, 821, 0.2),
(150, 'River Derwent', 'Australia', 'TAS', 'Hobart', -43.3, 147.22, '2021-09-20 05:57:53', 325, 8.4, 21.2, 712, 3.4),
(151, 'Styx River', 'Australia', 'TAS', 'Macquarie Plains', -42.43, 146.54, '2021-09-20 06:01:10', 392, 5.6, 21.9, 553, 3.2),
(152, 'Lea River', 'Australia', 'TAS', 'Lake Lea', -41.28, 146.03, '2021-09-20 06:02:55', 466, 4, 32, 325, 7.1),
(153, 'Henty River', 'Australia', 'TAS', 'Henty Dunes', -42.2, 145.14, '2021-09-20 06:05:16', 398, 5.9, 23.5, 121, 5.2),
(154, 'Huon River', 'Australia', 'TAS', 'Surveyors Bay', -43.16, 147.6, '2021-09-20 06:06:26', 585, 6.9, 18.2, 998, 1.3),
(165, 'North Esk River', 'Australia', 'TAS', 'Launceston', -41.42, 147.13, '2021-09-20 06:11:06', 255, 5.5, 17.5, 799, 0.8),
(171, 'Nive River', 'Australia', 'QLD', 'South West Queensland', -24.56, 146.51, '2021-09-20 06:12:18', 346.7, 6.7, 31.5, 455.8, 2.4),
(172, 'Thomson River', 'Australia', 'QLD', 'Longreach', -25.1, 142.53, '2021-09-20 06:12:18', 642.5, 3.6, 23.6, 566.4, 4.3),
(173, 'Burnett River', 'Australia', 'QLD', 'Mundubbera', -24.51, 151.36, '2021-09-20 06:12:18', 566.4, 7.4, 32.1, 467.8, 3.2),
(174, 'Coomera River', 'Australia', 'QLD', 'Scenic Rim Region ', -28.13, 153.11, '2021-09-20 06:12:18', 567.4, 6.8, 32.7, 458.6, 3.2),
(175, 'Stewart River', 'Australia', 'QLD', 'Far North Queensland', -14.04, 143.41, '2021-09-20 06:12:18', 643.2, 8.6, 23.4, 654.8, 4.6),
(176, 'Limmen Bight River', 'Australia', 'NT', 'Gulf of Carpentaria', -15.11, 135.37, '2021-09-20 06:16:26', 524, 5.9, 24.5, 653, 2.8),
(177, 'Wickham River', 'Australia', 'NT', 'Victoria Bonaparte', -17.01, 129.57, '2021-09-20 06:18:24', 515, 7.5, 23, 235, 2.6),
(178, 'Wildman River', 'Australia', 'NT', 'southwest of Kapalga', -12.18, 132.03, '2021-09-20 06:19:32', 399, 8.2, 27, 687, 2.5),
(179, 'Daly River', 'Australia', 'NT', 'Darwin', -13.35, 130.38, '2021-09-20 06:20:16', 642.6, 10.2, 23.7, 643.2, 3.6),
(180, 'Mary River', 'Australia', 'NT', 'Arnhem Land', -12.26, 131.42, '2021-09-20 06:20:16', 465.4, 4.6, 31.2, 567.3, 3.4),
(181, 'Adelaide River', 'Australia', 'NT', 'Adam Bay', -12.13, 131.14, '2021-09-20 06:20:16', 457.4, 4.6, 28.4, 477.3, 3.4),
(182, 'Towns River', 'Australia', 'NT', 'Limmen Bight', -14.55, 135.25, '2021-09-20 06:20:36', 523, 5.3, 22.6, 817, 3.4),
(183, 'Negri River', 'Australia', 'NT', 'Confluence with the Ord River', -17.04, 128.54, '2021-09-20 06:21:45', 378, 5.3, 29.5, 451, 0.3),
(184, 'Murray River', 'Australia', 'SA', 'Albury', -36.47, 148.11, '2021-09-20 06:31:02', 783.2, 4.6, 32.1, 556.2, 2.6),
(185, 'Norht Para River', 'Australia', 'SA', 'Gawler', -34.36, 138.45, '2021-09-20 06:31:02', 466.3, 7.5, 25.3, 442.6, 5.3),
(186, 'Kallakoopah Creek', 'Australia', 'SA', 'Far North', -27.29, 138.15, '2021-09-20 06:31:02', 345.3, 5.3, 31.1, 344.5, 2.1),
(187, 'Aroona Dam', 'Australia', 'SA', NULL, -30.59, 138.36, '2021-09-23 04:33:32', 247.6, 6.8, 18.5, 632.5, 2.1),
(188, 'Fowlers Bay', 'Australia', 'SA', NULL, -32.0041, 132.408, '2021-09-23 04:37:35', 543.23, 7.02, 17.4, 246.2, 2.4),
(189, 'Ceduna Jetty', 'Australia', 'SA', 'Ceduna', -32.1255, 133.671, '2021-09-23 04:39:22', 436.2, 6.92, 17.6, 537.2, 2.5),
(190, 'Laura Bay', 'Australia', 'SA', NULL, -32.2396, 133.826, '2021-09-23 04:45:20', 735.1, 6.9, 15.4, 547.8, 3.2),
(191, 'Neales River', 'Australia', 'SA', NULL, -27.89, 135.83, '2021-09-23 04:45:53', 363, 5.26, 15.5, 115, 1.12),
(192, 'RoseBay Beach', 'Australia', 'SA', NULL, -32.2567, 133.84, '2021-09-23 04:46:45', 842.4, 6.98, 13.6, 890.54, 4.3),
(193, 'Coffin Bay', 'Australia', 'SA', 'Coffin Bay National Park', -34.6247, 135.442, '2021-09-23 04:49:14', 564.2, 7.02, 21.4, 784.2, 2.7),
(194, 'Penong Roaded Catchment Pluviometer', 'Australia', 'SA', 'Penong', -31.93, 133.02, '2021-09-23 04:50:50', 1154.2, 7.58, 25.54, 268, 5.6),
(195, 'Koonibba Catchment Pluviometer', 'Australia', 'SA', NULL, -31.89, 133.42, '2021-09-23 04:50:50', 50245.5, 7.14, 30.525, 20.347, 1.46),
(196, 'Donington Beach', 'Australia', 'SA', 'Lincoln National Park', -34.722, 135.983, '2021-09-23 04:52:20', 389.2, 6.98, 16.8, 345.2, 3.1),
(197, 'Macumba Creek', 'Australia', 'SA', NULL, -27.2, 135.82, '2021-09-23 04:56:16', 374, 7.55, 21.25, 113.44, 1.12),
(198, 'Warburton River', 'Australia', 'SA', NULL, -27.08, 138.75, '2021-09-23 04:56:16', 969, 7.67, -8104.8, 20.36, 0.71),
(199, 'Lwalg Creek', 'Australia', 'NT', 'Endyalgout Island', -11.651, 132.608, '2021-09-23 05:37:33', 352.6, 7.11, 24.7, 685.3, 3.4),
(200, 'Lake Sylvester', 'Australia', 'NT', NULL, -18.8524, 135.509, '2021-09-23 05:43:19', 457.2, 6.93, 23.1, 648.2, 2.6),
(201, 'Tarrabool Lake', 'Australia', 'TA', NULL, -18.5408, 134.781, '2021-09-23 05:44:55', 456.2, 6.92, 17.9, 846.2, 3.5),
(202, 'Tennant Crk - W', 'Australia', 'NT', 'Warumungu', -19.56, 134.14, '2021-09-23 07:21:03', 169.3, 7.53, 30.8, 37.3, 4.7),
(203, 'Jilkminggan', 'Australia', 'NT', 'Elsey', -14.96, 133.27, '2021-09-23 07:24:10', 199, 7.8, 31.4, 256.3, 3.08),
(204, 'Dry River - Manbulloo Boundary', 'Australia', 'NT', 'Manbulloo', -15.09, 132.41, '2021-09-23 07:27:59', 232.6, 7.15, 31.7, 69.2, 1.63);

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `reportID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `date` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `title` text COLLATE utf8_unicode_ci NOT NULL,
  `level` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `details` text COLLATE utf8_unicode_ci NOT NULL,
  `status` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `governmentID` int(11) DEFAULT NULL,
  `reply` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `session_store`
--

CREATE TABLE `session_store` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `nickname` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` char(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatarPath` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isEmailVerified` tinyint(1) NOT NULL,
  `verificationKey` char(128) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `nickname`, `email`, `password`, `avatarPath`, `isEmailVerified`, `verificationKey`) VALUES
(10, 'ninggg', 's4652737@student.uq.edu.au', '$2b$10$YQl2BVJzyRiph/b2IQbjfeoMFHT7IQy8lYOVBhYNdGJNDIjs52gqu', 'default', 1, '784b0cea20fd469a4bedcb061a662ec86b8d5f47'),
(12, 'wzy', '851998299@qq.com', '$2b$10$4E0UIHU/M4X/VQTjPjXe1.T4WigeF.BMjEEor8zEXNsFE6.pHHzTe', 'default', 1, 'c343855b69d57e35a82dea997e82c6e2bc40b75a'),
(13, 'Superman', 'narcy188@outlook.com', '$2b$10$Lqw2A2yb/Qs1fwHYqd1fGOcOA6uBLwkvA6yN/B8D0d7Jmi7/bxBxi', 'default', 1, 'b2727d4a856723a9933cb25bec77e0f1ea30711e'),
(14, 'chou', 'liangb2@126.com', '$2b$10$M3uyScTjgxQZL7daeaPdue0kUY2GDqiqPx1NI523axxX5KN46V.0K', 'default', 0, 'cdde505e78c4eac23c1dc83353cf325d38fc6b6d'),
(15, '唐', 'seiinpock@gmail.com', '$2b$10$zVfDBNCLhRJq431tkTNZ3uIqkk33z2soC2TWWxstkpgB52M5QjbZG', 'default', 0, '4713a509594f387b4f7eacba0e2fcb9ef60d9287');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `government`
--
ALTER TABLE `government`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `merchant`
--
ALTER TABLE `merchant`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `qualityData`
--
ALTER TABLE `qualityData`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`reportID`),
  ADD KEY `FK_ReportID` (`userID`),
  ADD KEY `FK_governmentID` (`governmentID`);

--
-- Indexes for table `session_store`
--
ALTER TABLE `session_store`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `USER EMAIL` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `government`
--
ALTER TABLE `government`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `qualityData`
--
ALTER TABLE `qualityData`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=205;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `reportID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `government`
--
ALTER TABLE `government`
  ADD CONSTRAINT `FK_UserID` FOREIGN KEY (`id`) REFERENCES `user` (`id`);

--
-- Constraints for table `merchant`
--
ALTER TABLE `merchant`
  ADD CONSTRAINT `FK_MerchantID` FOREIGN KEY (`id`) REFERENCES `user` (`id`);

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `FK_ReportID` FOREIGN KEY (`userID`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_governmentID` FOREIGN KEY (`governmentID`) REFERENCES `government` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
