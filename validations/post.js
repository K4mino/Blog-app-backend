import { body } from "express-validator";

export const postCreateValidator = [
    body('title').isLength({ min:3 }).isString(),
    body('text').isLength({min:5}).isString(),
    body('tags').optional().isArray(),
    body('imageUrl').optional().isString()
]