const User = require("../model/User");
const bcrypt = require("bcryptjs");

const userController = {}

userController.createUser = async (req, res) => {
  try {
    const {email, name, password} = req.body
    const user = await User.findOne({email})
    if (user) {
      throw new Error('이미 가입된 유저 입니다.')
    }
    // required : true 한곳을 빼먹고 요청을 보냈을때
    // Illegal arguments: undefined, string
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    console.log("hash", hash)
    const newUser = new User({email, name, password:hash})
    await newUser.save()
    res.status(200).json({status:"success"})
  } catch(error) {
    res.status(400).json({status: "fail", error: error.message})
  }
};

userController.loginWithEmail = async (req, res)=>{
  try {
    const {email, password} = req.body
    const user = await User.findOne({email}, "-createdAt -updatedAt -__v")
    if(user){
      // 이 유저의 디비에 있는 패스워드와 프론트엔드가 보낸 패스워드가 같은지 비교
      // compareSync 를 통해 hash화 된 비밀번호와 프론트엔드에서 보낸 패스워드를 매치시켜 bool 값 반환
      const isMatch = bcrypt.compareSync(password, user.password);
      if (isMatch) {
        const token = user.generateToken();
        return res.status(200).json({status:"success", user, token})
      }
    }
    throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.")
  } catch (error) {
    return res.status(400).json({status:"fail", message : error.message});
  }
}

userController.getUser = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId);
    if (!user){
      throw new Error("can not find user")
    }
    res.status(200).json({status : "success", user})
  } catch(error){
    res.status(400).json({status : "fail", message : error.message})
  }
}


module.exports = userController