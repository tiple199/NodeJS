import { Request, Response } from "express";
import { registerNewUser } from "services/client/auth.service";
import { RegisterSchema, TRegisterSchema } from "src/validation/register.schema";

const getLoginPage = async (req: Request,res: Response) => {
    res.render("client/auth/login");
}
const getRegisterPage = async (req: Request,res: Response) => {
    const errors = [];
    const oldData = {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    };
    
    res.render("client/auth/register",{ errors, oldData });
}
const postRegister = async (req: Request,res: Response) => {
    const { fullName,email, password, confirmPassword } = req.body as TRegisterSchema;
    const validation = await RegisterSchema.safeParseAsync(req.body);
        if (!validation.success) {
            // error
            const errorZod = validation.error.issues;
            const errors = errorZod?.map(item => `${item.message} (${item.path[0]})`);
    
            const oldData = {
                fullName, email, password, confirmPassword 
            };
    
            return res.render("client/auth/register", { errors,oldData });
        }
    // success
    // const hashPassword = ; // TODO: hash password
    await registerNewUser(fullName, email, password);

    return res.redirect("/login");
    
}

export { getLoginPage,getRegisterPage,postRegister };