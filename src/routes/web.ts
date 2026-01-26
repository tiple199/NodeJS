import express,{Express} from "express";
import { getHomePage, postCreateUser,postDeleteUser,getViewUser,postUpdateUser } from "controllers/user.controller";
import { getDashboardPage,getAdminUserPage,getAdminOrderPage,getCreateUserPage,getAdminProductPage } from "controllers/admin/dashboard.controller";

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const router = express.Router();


const webRoutes = (app: Express) => {
    router.get("/", getHomePage)

    // router.get("/create-user",getCreateUserPage);
    router.post("/handle-delete-user/:id",postDeleteUser);
    router.get("/handle-view-user/:id",getViewUser);
    router.post("/handle-update-user",postUpdateUser);

    // admin route
    router.get("/admin", getDashboardPage);
    router.get("/admin/dashboard", getDashboardPage);
    router.get("/admin/user", getAdminUserPage);
    router.get("/admin/create-user", getCreateUserPage);
    // router.post("/admin/handle-create-user",postCreateUser);
    router.post("/admin/handle-create-user",upload.single('avatar'),(req, res)=>{
        res.send('File uploaded successfully');
    });



    router.get("/admin/product", getAdminProductPage);
    router.get("/admin/order", getAdminOrderPage);

    app.use("/", router);
}

export default webRoutes;