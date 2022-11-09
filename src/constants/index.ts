/**
 * JwtType is a constant which helps to keep the state of our tokens.
 */
export enum JwtTokenType {
        auth = 'auth',
        refresh = 'refresh',
        verification = 'verification',
        passwordReset = 'reset'
}

export enum NODE_ENV {
        dev = 'development',
        prod = 'production'
}

// enum ResponseMessages {
//         success = 'Succesfully created',
//         updated = 'Succesfully updated'
// }