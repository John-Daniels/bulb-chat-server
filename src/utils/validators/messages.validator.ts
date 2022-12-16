import { body } from "express-validator";

export const validateSendMessage = [
        body('message')
                .exists({ checkNull: true, checkFalsy: true })
                .withMessage("Message is required"),
        body('from')
                .exists({ checkNull: true, checkFalsy: true })
                .withMessage("is required"),
        body('to')
                .exists({ checkNull: true, checkFalsy: true })
                .withMessage("is required")
]