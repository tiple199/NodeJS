import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { prisma } from "config/client";
import { comparePassword } from "services/user.service";

const configPassportLocal = () => {
    passport.use(new LocalStrategy({},async function verify(username, password, cb) {
        console.log("check username, password", username, password);
        
    const user = await prisma.user.findUnique({
        where: {
            username
        }
    });
    if (!user) {
        // throw new Error("Username: " + username + " not found");
        return cb(null, false, { message: "Username: " + username + " not found"});
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        // throw new Error("Incorrect password");
        return cb(null, false, { message: "Incorrect password" });
    }
    return cb(null, user);
    }));
    passport.serializeUser(function(user: any, cb) {
      process.nextTick(function() {
        cb(null, { id: user.id, username: user.username });
      });
    });

    passport.deserializeUser(function(user, cb) {
      process.nextTick(function() {
        return cb(null, user);
      });
    });

}

export default configPassportLocal;