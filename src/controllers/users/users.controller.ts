const User = require('../../models/User.model')
import { JwtTokenType, NODE_ENV } from '../../constants'
import { sendResetPasswordEmail, sendVerificationMail } from '../../services/emails'
import respond from '../../utils/respond'
import jwt from 'jsonwebtoken'
import { isDuplicate } from '../../utils/validators'

import { isEmail } from 'validator'

export const getAllUsers = async (req: any, res: any) => {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(['email', 'username', 'avater', '_id'])
    respond(res, 200, 'Fetched all users', users)
}

// /POST /signup
export const signupUser = async (req: any, res: any) => {
    const newUser = {
        ...req.body,
        isEmailVerified: false,
        isAdmin: false,
    }

    try {
        const user = new User(newUser)

        await user.save()
        await user.verify();
        const obsuredUser: any = user.toJSON()

        const tokens = await user.generateAuthToken()
        respond(res, 201, 'Succesfully registered, verification code has been sent to your email!', { ...obsuredUser, ...tokens })
    } catch (e) {
        respond(res, 500, 'Something went wrong!, try again later.', e)
    }
}

// /POST /login
export const loginUser = async (req: any, res: any) => {
    const username = req.body.username
    const by = isEmail(username) ? 'email' : 'username'

    const credentials = {
        [by]: username,
        password: req.body.password
    }

    try {
        const user = await User.findOne({ [by]: credentials[by] })
        // catch the error b4 it actually happens
        if (!user) return respond(res, 404, 'Please provide valid credentials')


        // verification wall!!!!!
        // if we are here --- that means that the user is available.... so lets check for verification
        // if (user.isEmailVerified !== true)
        //     return respond(res, 403, "Please verify your account b4 you login"); // this is a custom one for login...


        const userDetails = await User.login(by, credentials[by], credentials.password)
        respond(res, 200, 'Succesfully signed in', userDetails)
    } catch (e: any) {
        const error = e.toString().split('Error: ')[1]
        respond(res, 403, error)
    }
}

export const getUserProfile = async (req, res) => {
    respond(res, 200, 'Fetched User profile', req.user)
}

//must be with auth middleware
export const logoutUser = async (req: any, res: any) => {
    try {

        if (req.query.all) {
            req.user.tokens = req.user.tokens.filter((token: any) => token.accessToken === req.token)
            await req.user.save()
        }
        else {
            req.user.tokens = req.user.tokens.filter((token: any) => token.accessToken !== req.token)
            await req.user.save()
        }

        respond(res, 200, 'Succesfully logged out user!')
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

// /Put / 
export const updateUser = async (req: any, res: any) => {
    const allowedUpdates = [
        'username',
        'email',
        'firstName',
        'lastName',
        'password',
        'avater',
        'phone',
        'location',
    ]

    try {
        const updates = req.body
        const user = req.user

        const updatedUser: any = await User.findByIdAndUpdate(user._id, updates, { new: true })

        respond(res, 200, 'succesfully updated the user', updatedUser)
    } catch (e) {
        res.status(500).send(e)
    }
}

// /DELETE /
export const deleteUser = async (req: any, res: any) => {
    try {
        await req.user.remove()
        respond(res, 200, 'Successfully deleted user')
    } catch (e) {
        respond(res, 500, 'Something went wrong!, try again later')

    }

}

export const requestPasswordReset = async (req: any, res: any) => {
    // generate a token
    // send an email to the user... with the url of the frontend which take so url search params
    // take the email and the mail to it

    try {
        const { email } = req.body

        const foundUser: any = await User.findOne({ email })
        if (!foundUser) return respond(res, 404, "User with this email is not found!")


        const token = await foundUser.generateToken(JwtTokenType.passwordReset)
        const clientResetPasswordpath = process.env.CLIENT_PASSWORD_RESET_URL
        const testResetPasswordpath = 'http://localhost:5000/users/auth/reset-password?token=' // debug

        /**
         * clientUrl - should be this pattern
         * protocol + hostname + {password_reset_path?token=} + {token}
         * localhost example
         *                                                  {url}+{token}
         * {http://localhost:3000/recovery/reset-password/?token=}{token}
         */
        const testLink = `${testResetPasswordpath}${token}` // debug
        const clientLink = `${clientResetPasswordpath}${token}`

        const link: string = process.env.NODE_ENV == NODE_ENV.prod ? clientLink : testLink

        await sendResetPasswordEmail({ email: foundUser.email }, link)
        respond(res, 200, 'The Password reset link has been sent to you!')

    } catch (e) {
        console.log(e)
        respond(res, 500, 'Something went wrong!, try again later')
    }

}

export const resetPassword = async (req: any, res: any) => {
    // validate the token...
    // get the new input... password

    const { user, decodedToken } = req
    if (decodedToken?.type !== JwtTokenType.passwordReset) return respond(res, 403, 'Your token is either invalid or expired')

    // continue to update
    const { password } = req.body
    user.password = password
    await user.save()

    respond(res, 200, 'successfully retieved your account!', user)
}

export const verifyUser = async (req, res) => {
    try {
        const token = req.query.token;

        // check if it exists
        if (!token) return respond(res, 400, "token is required");

        // check if it's valid
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        if (!decoded) return respond(res, 400, "token is required");

        const user = await User.findOne({ _id: decoded._id });
        if (!user) return respond(res, 404, "This user does not exist");

        if (user.isEmailVerified) return respond(res, 200, "Nothing todo here");

        user.isEmailVerified = true;
        user.save();

        // send welcome email...
        respond(res, 200, "You have successfully verified your email");
    } catch (e: any) {
        if (e.name === "TokenExpiredError")
            return respond(
                res,
                400,
                "Your token has expired, pls request for a new one"
            );

        respond(res, 400, "Unable to verify, Please try again");
    }
};

export const requestVerificationToken = async (req, res) => {
    try {
        const email = req.query.email;

        if (!email) return respond(res, 400, "the email is required");

        const user: any = await User.findOne({ email });
        if (!user) return respond(res, 404, "This user does not exist");

        await user.verify();
        respond(res, 200, "Successfully processed your request");
    } catch (e) {
        respond(res, 500, "Something went wrong!, try again later");
    }
};

// users/auth/refresh?token={refreshToken}
export const refreshUserByToken = async (req, res) => {
    try {

        const { type, _id }: any = req.decodedToken;
        const token = req.query?.token

        const user = await User.findOne({
            _id,
            "tokens.refreshToken": token,
        });


        if (!user) return respond(res, 403, "Please provide a valid token");

        if (type !== JwtTokenType.refresh)
            return respond(res, 403, "Please provide a valid token");

        await user.logout(token, 'refreshToken')
        const refreshedUser = await user.refreshAuthToken();

        respond(res, 200, 'successfully refreshed your token!', refreshedUser)
    } catch (e: any) {
        if (e.name === "TokenExpiredError")
            return respond(res, 400, "Your token has expired, pls login again");

        respond(res, 400, "Unable to refresh, try again later!");
    }
};


export const setAvater = async (req, res) => {
    try {
        const { _id } = req.user
        const avater = req.body.avater

        if (!avater) respond(res, 400, 'avater is required!')
        const user = await User.findByIdAndUpdate(_id, {
            avater,
        }, { new: true })

        respond(res, 201, 'Sucessfully set the avater', user)

    } catch (e) {
        respond(res, 500, 'Something went wrong!, try again later.', e)
    }
}

export default {
    signupUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    refreshVerificationToken: refreshUserByToken,
    requestPasswordReset,
    resetPassword,
    verifyUser,
    setAvater,
}