const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const openAiController = require("../controller/openAi");
const userAuthentication = require("../middlewares/userAuthentication");


router.post('/signUp',userController.signUp)
router.post('/logIn',userController.logIn)

router.get('/profile',userAuthentication,userController.users)
router.post('/init',userAuthentication,openAiController.init)
router.post('/newPage',userAuthentication,openAiController.newPage)
router.post('/aiResponce',userAuthentication,openAiController.aiResponce)
router.post('/close',userAuthentication,openAiController.close)

module.exports = router;