"use strict";
// models/User.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(username, email, privilege, password) {
        this.username = username;
        this.email = email;
        this.privilege = privilege;
        this.password = password;
    }
}
exports.User = User;
