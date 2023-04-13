// import userValidator from "./user.validator"

import { NextFunction, Response, Request } from 'express'
import { validationResult } from 'express-validator'
import respond from '../respond'


/**** 
 * @params props is like a referennce to find a dupulicate document
 * @params model is a Moongose.model like User
*/
export const isDuplicate = (props: object, model: any) => model.findOne(props)
export const isEmpty = (string: any) => {
    if (string == '' || string == null) return true

    return false
}


/**
 * Duplicate validator, is a validation helper that validates a value based on the query passed
 * @param value - value to search!
 * @param query - param @Model 
 * @param Model - a mongoose model you want to query 
 */
export const duplicateValidator = async (value: string, query: string, Model: any) => {
    if (value) {
        const _isDuplicate = await isDuplicate({ [query]: value }, Model)
        if (_isDuplicate) throw new Error(`${query} is taken`);
    }

    return true;
}



// function to return errors compiled together in an array as feedback for user registation.
export const checkErrors = (req: Request, res: Response, next: NextFunction) => {
    let errorValidation = validationResult(req);
    const errors: any = {}
    if (!errorValidation.isEmpty()) {
        // this will minify the errors for the frontend guys
        for (let error of errorValidation?.array({ onlyFirstError: true })) {
            const { param, msg } = error

            errors[param] = msg
        }

        return respond(res, 400, 'validation error', errors);
    }

    return next();
}


export default {
    isDuplicate,
    isEmpty,
    duplicateValidator,
    checkErrors,
}

export { default as userValidator } from './user.validator'
