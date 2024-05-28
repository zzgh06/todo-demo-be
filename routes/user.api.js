const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const authController = require('../controller/auth.controller');
// 1. 회원가입 endpoint
router.post("/", userController.createUser);

// 로그인 get 대신 post를 쓰는 이유
// 이메일과 패스워드 정보를 읽어와야하지만 get은 추가적인 정보를 request body에 담아서 보낼 수 없음
// get 요청은 uri에 노출되는 위험이 있음
router.post("/login", userController.loginWithEmail);
// 토큰을 통해 유저 id 빼내고 => 그 아이디 유저 객체 찾아서 보내주기

router.get("/me", authController.authenticate, userController.getUser);
module.exports = router