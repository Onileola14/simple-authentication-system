const User = require("../models/User");
const { createPermission } = require("../utils/checkPermission");
const { StatusCodes } = require("http-status-codes");

const getAllUsers = async (req, res) => {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.status(StatusCodes.OK).json({ users });
};
const getSingleUser = async (req, res) => {
    const { id: userId } = req.params;
    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) {
        res.status(StatusCodes.NOT_FOUND).json({ msg: `No user with id : ${userId}` });
    }
    createPermission(req.user, userId);
    res.status(StatusCodes.OK).json({ user });
}

 const deleteUser = async (req, res) => {
    const { id: userId } = req.params;
    const user = await User.findOneAndDelete({ _id: userId });
    if (!user) {
        res.status(StatusCodes.NOT_FOUND).json({ msg: `No user with id : ${userId}` });
    }
    createPermission(req.user, userId);
    res.status(StatusCodes.OK).json({ msg: "user deleted successfully" });
};

const updateUser = async (req, res) => {
    const { id: userId } = req.params;
    const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
        new: true,
        runValidators: true,
    }).select("-password");
    if (!user) {
        res.status(StatusCodes.NOT_FOUND).json({ msg: `No user with id : ${userId}` });
    } 
    
    createPermission(req.user, userId);

    res.status(StatusCodes.OK).json({ user });
}   



module.exports = { getAllUsers, getSingleUser, deleteUser, updateUser };