/*
 Navicat Premium Data Transfer

 Source Server         : game
 Source Server Type    : MySQL
 Source Server Version : 50744
 Source Host           : localhost:3306
 Source Schema         : bycw_center

 Target Server Type    : MySQL
 Target Server Version : 50744
 File Encoding         : 65001

 Date: 09/05/2024 11:14:56
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for phone_chat
-- ----------------------------
DROP TABLE IF EXISTS `phone_chat`;
CREATE TABLE `phone_chat`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '\"\"',
  `code` varchar(8) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '\"\"' COMMENT '用户验证码',
  `opt_type` int(11) NOT NULL DEFAULT 0 COMMENT '操作类型0, 游客升级 1 修改密码 2 手机注册拉取验证码',
  `end_time` int(11) NOT NULL DEFAULT 0 COMMENT '验证码结束的时间戳',
  `count` int(11) NOT NULL DEFAULT 0 COMMENT '拉取验证码的次数',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '手机短信验证码' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for uinfo
-- ----------------------------
DROP TABLE IF EXISTS `uinfo`;
CREATE TABLE `uinfo`  (
  `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户唯一的id号',
  `unick` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '\"\"' COMMENT '用户的昵称',
  `uname` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '\"\"' COMMENT '用户名,全局唯一的 ',
  `upwd` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '\"\"' COMMENT '用户密码,32位md5值',
  `usex` int(11) NOT NULL DEFAULT 0 COMMENT '用户的性别0，男，1女',
  `uface` int(11) NOT NULL DEFAULT 0 COMMENT '用户图像',
  `uphone` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '\"\"' COMMENT '用户联系方式',
  `uemail` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '\"\"' COMMENT '绑定用户的邮箱',
  `ucity` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '\"\"' COMMENT '用户所在的城市',
  `uvip` int(11) NOT NULL DEFAULT 0 COMMENT '用户VIP的等级',
  `vip_endtime` int(11) NOT NULL DEFAULT 0 COMMENT 'vip结束的时间搓',
  `guest_key` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '\"\"' COMMENT '游客注册的时候使用的key',
  `is_guest` int(11) NOT NULL DEFAULT 0 COMMENT '是否为游客账号',
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '0为有效,1为封号',
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 80 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '存储用户信息的表' ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
