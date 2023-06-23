import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
import { validationResult } from "express-validator";


export const register = async(req, res) => {
    try {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
  
      const doc = new UserModel({
        email: req.body.email,
        password: passwordHash,
        avatarUrl: req.body.avatarUrl,
        fullName: req.body.fullName
      });
  
      const user = await doc.save();
  
      const token = jwt.sign(
        {
          _id:user._id
        },
          'secretKey',
        {
          expiresIn:'30d'
        }
      )
  
      res.json({
        ...user,
        token
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({
          message:'Не удалось зарегестрироваться'
      })
    }
  }

export const login = async(req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email})
  
      if(!user){
        return res.status(404).join({
          message: 'Пользователь не найден'
        })
      }
  
      const isValidPassword = await bcrypt.compare(req.body.password, user._doc.password);
  
      if(!isValidPassword){
        return res.status(404).join({
          message: 'Не верный логин или пароль'
        })
      }
  
      const token = jwt.sign(
        {
          _id:user._id
        },
          'secretKey',
        {
          expiresIn:'30d'
        } 
      )
  
      res.json({
        ...user._doc,
        token
      })
  
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message:'Не удалось авторизоваться'
    })
    }
  }

export const getMe  = async(req,res) => {
    try {
        const user = await UserModel.findById(req.userId)
  
        if(!user){
          return res.status(404).json({
            message:"Пользователь не найден"
          })
        }
  
        res.json({
          ...user._doc
        })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message:"Нет доступа"
      })
    }
  }