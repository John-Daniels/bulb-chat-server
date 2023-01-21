import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import User from "../../models/User.model";
import { duplicateValidator, isDuplicate } from ".";
import respond from "../respond";

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
  body("username")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Username cannot be empty!")
    .isLength({ min: 3 })
    .withMessage("Username must contain at least 3 characters.")
    .custom((value: string) => duplicateValidator(value, 'username', User))
    .trim(),

  body("email")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Email cannot be empty!")
    .isEmail()
    .withMessage('Provide a valid email!')
    .custom((value: string) => duplicateValidator(value, 'email', User)),

  body("password")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Password cannot be empty!')
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters")
    .trim(),
]

export const validateRequestResetPassword = [
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
  validateLogin,
  validateSignup
}