const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const getAllUsers = async (req, res) => {
    const users = await User.find({}).select("-password");
    res.status(StatusCodes.OK).json({ users });
};
const getSingleUser = async (req, res) => {
    const { id: userId } = req.params;
    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) {
        res.status(StatusCodes.NOT_FOUND).json({ msg: `No user with id : ${userId}` });
    }
    res.status(StatusCodes.OK).json({ user });
}

module.exports = { getAllUsers, getSingleUser };