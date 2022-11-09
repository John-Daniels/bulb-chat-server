import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import User from "../../models/User.model";
import { isDuplicate } from ".";
import respond from "../respond";

// function to return errors compiled together in an array as feedback for user registation.
export function checkErrors(req: Request, res: Response, next: NextFunction) {
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

/**
 * Duplicate validator, is a validation helper that validates a value based on the query passed
 * @param value - value to search!
 * @param query - param @User.model 
 */
const duplicateValidator = async (value: string, query: string) => {
  if (value) {
    const _isDuplicate = await isDuplicate({ [query]: value }, User)
    if (_isDuplicate) throw new Error(`${query} is taken`);
  }

  return true;
}

export const validateLogin = [
  body("username")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Username cannot be empty!"),

  // body("email").exists().withMessage('Provide a valid email!').isEmail().withMessage('Provide a valid email!'),

  body("password")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Password is required!")
    .trim()
  // .isLength({ min: 8 })
  // .withMessage("Password must have at least 8 characters"),
]

// using express validator middleware to check for errors in all fields for user model.
export const validateSignup = [
  body("firstName")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Firstname cannot be empty!")
    .isLength({ min: 3 })
    .withMessage("Firstname must have at least 3 characters"),

  body("lastName")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Lastname cannot be empty!")
    .isLength({ min: 3 })
    .withMessage("Lastname should have at least 3 characters"),

  body("username")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Username cannot be empty!")
    .isLength({ min: 3 })
    .withMessage("Username must contain at least 3 characters.")
    .custom((value: string) => duplicateValidator(value, 'username'))
    .trim(),

  body("email")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Email cannot be empty!")
    .isEmail()
    .withMessage('Provide a valid email!')
    .custom((value: string) => duplicateValidator(value, 'email')),

  body("phone")
    .isLength({ min: 3 })
    .withMessage('Provide a valid phone number!')
    .custom((value: string) => duplicateValidator(value, 'phone')),

  body("password")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Password cannot be empty!')
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters")
    .trim(),
  body("location")
    .isLength({ min: 3 })
    .withMessage("Provide a valid location!"),
]

export const validateRequestResetPassword = [
  // body("email")
  //   .exists({ checkNull: true, checkFalsy: true })
  //   .trim()
  //   .isEmail()
  //   .withMessage("Provide a valid email"),


  body("email").exists().withMessage('Email address cannot be empty').isEmail().withMessage('Provide a valid email address!'),

]



export const validateResetPassword = [
  body("password")
    .exists({ checkNull: true, checkFalsy: true },)
    .withMessage("Password is required!")
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters").trim()
]



export default {
  check: checkErrors,
  validateLogin,
  validateSignup
}