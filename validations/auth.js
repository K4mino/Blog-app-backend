import { body } from "express-validator";

export const authValidator = [
    body('email','Неверный формат почты').isEmail(),
    body('password', 'Неверный формат пароля').isLength({min: 5}),
    body('fullName').isLength({min:3}),
    body('avatarUrl').optional().isURL()
]

export const loginValidator = [
    body('email','Неверный формат почты').isEmail(),
    body('password', 'Неверный формат пароля').isLength({min: 5}),
]