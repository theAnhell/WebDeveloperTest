"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
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
        // Check the database if there are 5 tries, if there are and more than 5 minutes have passed since this user was modified, clear the tries and let the user try again.
        if (user.tries >= 5) {
            const now = new Date();
            const lastUpdatedDate = new Date(user.updatedAt);
            if ((0, date_fns_1.differenceInMinutes)(now, lastUpdatedDate) < 5) {
                return next(boom_1.default.unauthorized("You have reached the limit of tries, wait 5 minutes to try again."));
            }
            else {
                await users_1.default.update({ tries: 0 }, { where: { id: user.id } });
            }
        }
        const completeName = `${user.names} ${user.lastName}`;
        const isEqual = await bcryptjs_1.default.compare(password, user.password);
        // Everytime it gets the password wrong it adds a try to the tries column in the database, once it reaches 5, the user can't no longer try connecting again for 5 minutes
        if (!isEqual) {
            await users_1.default.update({ tries: (user.tries || 0) + 1 }, { where: { id: user.id } });
            return next(boom_1.default.unauthorized("Wrong password"));
        }
        // The token expires in 12 hour, the frontend has an autologout method that logouts the user after the token expires.
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
        console.log(err);
        return next(boom_1.default.badImplementation("An error occured"));
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
        const [createdUser, isCreated] = await users_1.default.findOrCreate({
            where: { email: email },
            defaults: {
                names: names,
                lastName: lastName,
                password: hashedPw,
                role: role,
                tries,
            },
        });
        if (isCreated) {
            // It's a new user.
            const token = (0, jsonwebtoken_1.sign)({
                email: createdUser.email,
                id: createdUser.id.toString(),
            }, "$77E2@%y4@9K", { expiresIn: "12h" });
            const completeName = `${createdUser.names} ${createdUser.lastName}`;
            // We send the token so that in the frontend it can automatically do a log-in.
            res.status(200).json({
                id: createdUser.id,
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