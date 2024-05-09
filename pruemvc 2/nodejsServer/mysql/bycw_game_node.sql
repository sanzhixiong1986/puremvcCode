/*
 Navicat Premium Data Transfer

 Source Server         : game
 Source Server Type    : MySQL
 Source Server Version : 50744
 Source Host           : localhost:3306
 Source Schema         : bycw_game_node

 Target Server Type    : MySQL
 Target Server Version : 50744
 File Encoding         : 65001

 Date: 09/05/2024 11:10:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for login_bonues
-- ----------------------------
DROP TABLE IF EXISTS `login_bonues`;
CREATE TABLE `login_bonues`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL DEFAULT 0 COMMENT '用户uid',
  `bonues` int(11) NOT NULL DEFAULT 0 COMMENT '奖励的多少？',
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '表示是否领取过了，0表示未领取,1就表示领取了',
  `bunues_time` int(11) NOT NULL DEFAULT 0 COMMENT '上一次发放登陆奖励的时间',
  `days` int(11) NOT NULL DEFAULT 0 COMMENT '连续登录的天数',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '每日登录奖励' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of login_bonues
-- ----------------------------
INSERT INTO `login_bonues` VALUES (1, 79, 300, 0, 1714102902, 3);
INSERT INTO `login_bonues` VALUES (2, 78, 300, 0, 1714102904, 3);

-- ----------------------------
-- Table structure for ugame
-- ----------------------------
DROP TABLE IF EXISTS `ugame`;
CREATE TABLE `ugame`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ugame表唯一ID',
  `uid` int(11) NOT NULL COMMENT '用户的ID号',
  `uexp` int(11) NOT NULL COMMENT '用户的经验值',
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '0为正常，1为非发的数据记录',
  `uchip` int(11) NOT NULL COMMENT '主金币值',
  `udata` int(11) NOT NULL DEFAULT 0 COMMENT '游戏的一些统计数据等',
  `uvip` int(11) NOT NULL DEFAULT 0 COMMENT '游戏的uvip',
  `uvip_endtime` int(11) NOT NULL DEFAULT 0 COMMENT '游戏VIP结束的时间戳',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '存放我们的玩家的游戏数据' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ugame
-- ----------------------------
INSERT INTO `ugame` VALUES (1, 79, 1000, 0, 1097, 0, 0, 0);
INSERT INTO `ugame` VALUES (2, 78, 1000, 0, 1003, 0, 0, 0);

SET FOREIGN_KEY_CHECKS = 1;
