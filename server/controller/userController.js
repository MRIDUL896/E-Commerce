const Users = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const salt = 10;

const userController = {
    handleRegister: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            let user = await Users.findOne({ email: email });

            if (user) return res.status(409).json({ message: "User already registered" });

            //Password encryption
            const hashedPass = await bcrypt.hash(password, salt)
            user = new Users({ name, email, password: hashedPass });
            await user.save();

            //JWT tokens
            const accessToken = createAccessToken({ id: user._id });
            const refToken = createRefToken({ id: user._id });

            //handle cookies
            res.cookie('refreshtoken', refToken, {
                httpOnly: true,
                path: '/ecomm/user/refresh_token'
            })
            res.json(accessToken);
        } catch (err) {
            res.status(500).json({ err: err.message });
        }
    },
    refreshToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please login or register" });

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET_KEY, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please login or register" });
                else {
                    const accessToken = createAccessToken({ id: user._id })
                    res.json({user,accessToken});
                }
            })
        }catch (err){
            res.status(500).json({ msg : err.msg })
        }
    }
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1d' })
}

const createRefToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' })
}

module.exports = userController;