// import userValidator from "./user.validator"


/**** 
 * @params props is like a referennce to find a dupulicate document
 * @params model is a Moongose.model like User
*/
export const isDuplicate = (props: object, model: any) => model.findOne(props)
export const isEmpty = (string: any) => {
    if (string == '' || string == null) return true

    return false
}

export default {
    isDuplicate,
    isEmpty,
}

export { default as userValidator } from './user.validator'
