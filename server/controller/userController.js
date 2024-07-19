const Users = require("../model/User");

const userController = {
    handleRegister: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            let user = await Users.findOne({ email: email });
            if (user) res.status(409).json({ message: "User already registered" });
            user = new Users({ name,email,password });
            console.log("inside ",user)
            await user.save();
            console.log("success");
            res.json({ message: "success" });
        } catch (err) {
            res.status(500).json({ err: err });
        }
    }
}

module.exports = userController;