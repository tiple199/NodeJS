import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "config/client";
import { comparePassword } from "services/user.service";
import { getUserSumCart, getUserWithRoleById } from "services/client/auth.service";

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
    return cb(null, user as any);
    }));
    // dùng để lưu dữ liệu user vào session, mỗi khi có request gửi lên, passport sẽ gọi hàm deserializeUser để lấy dữ liệu user từ session
    passport.serializeUser(function(user: any, cb) {
        cb(null, { id: user.id, username: user.username });
    });

    passport.deserializeUser(async function(user: any, cb) {
      const {id, username} = user;
      const userInDb: any = await getUserWithRoleById(id);
        const sumCart = await getUserSumCart(id);

        return cb(null, {...userInDb,sumCart});
    });

}

export default configPassportLocal;