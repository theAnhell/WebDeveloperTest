"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.patchUser = exports.getAllUsers = exports.getUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs")); //encrypt password
const boom_1 = __importDefault(require("@hapi/boom")); //errorHandling
//* Database models
const users_1 = __importDefault(require("../models/users"));
const getUser = async (req, res, next) => {
    const idUser = req.params.idUser;
    try {
        const foundUser = await users_1.default.findByPk(idUser, {
            attributes: { exclude: ["password", "tries", "createdAt", "updatedAt"] },
        });
        if (!foundUser)
            return next(boom_1.default.badData("This user doesn't exist"));
        res.status(200).json({ user: foundUser });
    }
    catch (err) {
        return next(boom_1.default.badImplementation("Ocurrio un error"));
    }
};
exports.getUser = getUser;
const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await users_1.default.findAll({
            attributes: { exclude: ["password", "tries", "createdAt", "updatedAt"] },
        });
        res.status(200).json({ users: allUsers });
    }
    catch (err) {
        return next(boom_1.default.badImplementation("Ocurrio un error"));
    }
};
exports.getAllUsers = getAllUsers;
const patchUser = async (req, res, next) => {
    const idUser = req.params.idUser;
    const names = req.body.names;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    const resetPassword = req.body.resetPassword;
    try {
        if (resetPassword) {
            const hashedPw = await bcryptjs_1.default.hash(password, 12);
            await users_1.default.update({ names, lastName, email, password: hashedPw, role }, { where: { id: idUser } });
        }
        else {
            await users_1.default.update({ names, lastName, email, role }, { where: { id: idUser } });
        }
        res.status(201).json({ message: "Se actualizo este usuario" });
    }
    catch (err) {
        return next(boom_1.default.badImplementation("Ocurrio un error"));
    }
};
exports.patchUser = patchUser;
const deleteUser = async (req, res, next) => {
    const idUser = req.params.idUser;
    try {
        const foundUser = await users_1.default.findByPk(idUser);
        if (!foundUser)
            return next(boom_1.default.badData("This user doesn't exist"));
        await users_1.default.destroy({ where: { id: idUser } });
        res
            .status(201)
            .json({
            message: `The user ${foundUser.names} ${foundUser.lastName} has been deleted`,
        });
    }
    catch (err) {
        return next(boom_1.default.badImplementation("Ocurrio un error"));
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=dashboard.js.map