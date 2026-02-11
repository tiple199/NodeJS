import { isEmailExists } from "services/client/auth.service";
import {z} from "zod"; 
const emailSchema = z.string().email("Email không đúng định dạng")
  .refine(async (email) => {
    const existingUser = await isEmailExists(email);
    return !existingUser;
  },{
    message: "Email đã tồn tại",
    path: ["email"]
  });

const passwordSchema = z.string().min(6,"Password phải có ít nhất 6 ký tự")
.max(20,"Password không được vượt quá 20 ký tự");
export const RegisterSchema = z.object({ 
  fullName: z.string().trim().min(1,{message: "fullName không được để trống"}),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],

 

});
export type TRegisterSchema = z.infer<typeof RegisterSchema>;