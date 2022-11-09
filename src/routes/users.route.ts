import { User } from '../models'
import express from "express"

//controllers
import { verifyAuthToken, verifyAuthStateByTokenQuery } from '../middlewares/auth.middleware';
import { signupUser, loginUser, logoutUser, updateUser, deleteUser, verifyUser, requestVerificationToken, requestPasswordReset, resetPassword, refreshUserByToken } from '../controllers/users/users.controller';

//validators
import { validateSignup, checkErrors, validateLogin, validateRequestResetPassword, validateResetPassword } from '../utils/validators/user.validator';

const router = express.Router()

// just for test...
router.get("/", async (req: any, res: any) => {
    const users = await User.find()
    res.send(users)
});

// signup model
// signup  --> verication --> login  --> authenication

//                 validate --> checkforerrors --> nextfunc
router.post('/signup', validateSignup, checkErrors, signupUser)

// POST /login?by=username
router.post('/login', validateLogin, checkErrors, loginUser)

// POST /logout?all=true
router.post('/logout', verifyAuthToken, logoutUser)

// update by id
router.put('/', verifyAuthToken, updateUser)

// delete user
router.delete('/', verifyAuthToken, deleteUser)

// /verificatiion?token=askdfr0i2dfksad;lkfpqdwiafisdfjds
router.post("/verification/verify", verifyUser)
// /verification/request/?email=test@gmail.com
router.post("/verification/request", requestVerificationToken)

// password reset
router.post('/auth/reset-password/request', validateRequestResetPassword, checkErrors, requestPasswordReset) // - done
router.post('/auth/reset-password', verifyAuthStateByTokenQuery, validateResetPassword, checkErrors, resetPassword) // - done
// refresh auth token when it has expired
router.post('/auth/refresh', verifyAuthStateByTokenQuery, refreshUserByToken) // - done

export default router
