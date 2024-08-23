"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAbility = void 0;
const caslAbility_1 = require("../config/caslAbility");
const checkAbility = (action, subject) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.role) {
            console.error('User or user role not found in request:', user);
            return res.status(403).json({ error: 'Unauthorized: User role not found' });
        }
        const ability = (0, caslAbility_1.buildAbility)(user.role);
        if (ability.can(action, subject)) {
            next();
        }
        else {
            console.error(`Authorization failed for ${user.role} trying to ${action} on ${subject}`);
            res.status(403).json({ error: 'Unauthorized' });
        }
    };
};
exports.checkAbility = checkAbility;
