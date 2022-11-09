import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { JwtTokenType } from '../constants/index'
import { sendVerificationMail } from "../services/emails";

const userSchema = new mongoose.Schema(
    {
        //user data
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
        }, // will be hidden
        bio: String,
        avater: String,
        location: String,
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        tokens: [
            {
                accessToken: String,
                refreshToken: String,
            },
        ]
    },
    {
        timestamps: true,
        toObject: {
            virtuals: true,

        }
    }
);


// populate
// this feature is really cool... it reduces some code
// userSchema.virtual('products', {
//     localField: 'username',
//     foreignField: 'owner',
// })

// Obscuring the user details
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// this method generates a new token for a user
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const accessToken = jwt.sign({ _id: user._id.toString(), type: JwtTokenType.auth }, `${process.env.JWT_SECRET}`)
    const refreshToken = jwt.sign({ _id: user._id.toString(), type: JwtTokenType.refresh }, `${process.env.JWT_SECRET}`)

    user.tokens = user.tokens.concat({ accessToken, refreshToken })
    await user.save()

    return { accessToken, refreshToken }
}

userSchema.methods.refreshAuthToken = async function () {
    const user = this

    const tokens = await user.generateAuthToken()
    const obscuredUser = user.toJSON()

    return { ...obscuredUser, ...tokens, }
}

// verification ...
userSchema.methods.generateVerificationToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id, type: JwtTokenType.verification }, process.env.JWT_SECRET as string, {
        expiresIn: 600, // expire time is very important for verifications
    })

    return token
}

userSchema.methods.generateToken = async function (type: JwtTokenType) {
    const user = this
    const token = jwt.sign({ _id: user._id, type, }, process.env.JWT_SECRET as string, {
        expiresIn: 600, // expire time is very important for verifications
    })

    return token
}


userSchema.methods.verify = async function () {
    const user = this

    const token = await user.generateVerificationToken()

    //note: CLIENT_REQUEST_TOKEN_URL must follow this pattern http://localhost:3000/auth/verify?token=
    const client_path = process.env.CLIENT_REQUEST_TOKEN_URL
    const link = `${client_path}${token}`

    return await sendVerificationMail(user.email, link)
}

userSchema.statics.login = async (by = 'email' || 'username', string, password) => {
    const user: any = await User.findOne({ [by]: string })

    if (!user) {
        // 404 but lets keep it simple bcuz of hackers
        throw new Error('Pls provide valid credentials')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) throw new Error('Pls provide valid credentials')

    const tokens = await user.generateAuthToken()
    const obsuredUser: object = user.toJSON()

    return { ...obsuredUser, ...tokens }
}

userSchema.methods.logout = async function (token, by) {
    const user = this
    try {
        user.tokens = user.tokens.filter((t: any) => t[by] !== token)
        await user.save()
        console.log('i wnt to')
    } catch (e) {
        console.log(e)
    }
    return user
}

// this middleware of mongodb is so powerful
// this will be called right b4 we save the user
userSchema.pre('save', async function (next) {
    const user: any = this

    // const previousUser: any = await User.findById(user.id)
    // console.log(previousUser?.firstName)

    // Hash the plain text password before saving
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    // this will rename the user's username in all the products created
    // if (user.isModified('username')) {
    //     console.log('yes')
    //     await Product.where('owner', previousUser.username)
    //         .updateMany({ owner: user.username })
    // }

    next()
})

// Delete user products when user is removed
userSchema.pre('remove', async function (next) {
    const user: any = this


    next()
})

const User = mongoose.model("users", userSchema);

module.exports = User;
export default User;
