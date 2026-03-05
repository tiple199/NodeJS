import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { prisma } from "config/client";
import { comparePassword } from "services/user.service";

const configPassportLocal = () => {
    passport.use(new LocalStrategy({
      passReqToCallback: true
    },async function verify(req,username, password, cb) {
      const {session} = req as any;
      if(session?.messages?.length) {
        session.messages = [];
      }
      console.log("check username, password", username, password);
        
    const user = await prisma.user.findUnique({
        where: {
            username
        }
    });
    if (!user) {
        // throw new Error("Username: " + username + " not found");
        return cb(null, false, { message: "Username/password invalided" });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        // throw new Error("Incorrect password");
        return cb(null, false, { message: "Username/password invalided" });
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