"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const functions_1 = require("./../util/functions");
const bcryptjs_1 = __importDefault(require("bcryptjs")); //encrypt password
const jsonwebtoken_1 = require("jsonwebtoken"); //tokenSecurity
const boom_1 = __importDefault(require("@hapi/boom")); //errorHandling
//* Database models
const users_1 = __importDefault(require("../models/users"));
const date_fns_1 = require("date-fns");
const login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await users_1.default.findOne({ where: { email: email } });
        if (!user)
            return next(boom_1.default.unauthorized("This user doesn't exist."));
        if (user.tries >= 5) {
            const now = new Date();
            const lastUpdatedDate = new Date(user.updatedAt);
            if ((0, date_fns_1.differenceInMinutes)(now, lastUpdatedDate) < 1) {
                return next(boom_1.default.unauthorized("You have reached the limit of tries, wait 5 minutes to try again."));
            }
            else {
                await users_1.default.update({ tries: 0 }, { where: { id: user.id } });
            }
        }
        const completeName = `${user.names} ${user.lastName}`;
        const isEqual = await bcryptjs_1.default.compare(password, user.password);
        if (!isEqual) {
            await users_1.default.update({ tries: (user.tries || 0) + 1 }, { where: { id: user.id } });
            return next(boom_1.default.unauthorized("Wrong password"));
        }
        const token = (0, jsonwebtoken_1.sign)({
            email: email,
            id: user.id.toString(),
        }, "$77E2@%y4@9K", { expiresIn: "12h" });
        res.status(200).json({
            id: user.id,
            token: token,
            expiresIn: 43200,
            role: user.role,
            completeName: completeName,
        });
    }
    catch (err) {
        return next(boom_1.default.badImplementation("Ocurrio un error"));
    }
};
exports.login = login;
const register = async (req, res, next) => {
    const names = req.body.names;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    const tries = 0;
    try {
        // Hashing the password so its harder to crack when seeing in the database.
        const hashedPw = await bcryptjs_1.default.hash(password, 12);
        // This is because sometimes the Increment seed of SQL doesnt work and jumps from 2 digits ids, to a 4-digit id.
        // With this function I make sure that it gives me the next id in the database.
        const idUser = await (0, functions_1.findNext)(users_1.default);
        const [createdUser, isCreated] = await users_1.default.findOrCreate({
            where: { email: email },
            defaults: {
                names: names,
                lastName: lastName,
                password: hashedPw,
                id: idUser,
                role: role,
                tries,
            },
        });
        if (isCreated) {
            // It's a new user.
            const token = (0, jsonwebtoken_1.sign)({
                email: createdUser.email,
                id: idUser.toString(),
            }, "$77E2@%y4@9K", { expiresIn: "12h" });
            const completeName = `${createdUser.names} ${createdUser.lastName}`;
            // We send the token so that in the frontend it can automatically do a log-in.
            res.status(200).json({
                id: idUser,
                token: token,
                expiresIn: 43200,
                role: createdUser.role,
                completeName: completeName,
            });
        }
        else {
            // We tell the user that this email is already in use.
            return next(boom_1.default.conflict("This e-mail is already in use"));
        }
    }
    catch (err) {
        return next(boom_1.default.badImplementation("An error occured"));
    }
};
exports.register = register;
//# sourceMappingURL=auth.js.map