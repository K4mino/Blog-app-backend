import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from 'cors'
import { getMe, login, register } from "./controllers/UserController.js";
import { createPost, getAllPosts, getOnePost,deletePost, updatePost, getLastTags, getPopularPosts, getPostsByTag } from "./controllers/PostController.js";
import checkAuth from "./utils/checkAuth.js";
import { authValidator, loginValidator } from "./validations/auth.js";
import { postCreateValidator } from "./validations/post.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose
  .connect(
    process.env.REACT_APP_DB
  )
  .then(() => {
    console.log("db connect");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_,__,cb) => {
    cb(null,'uploads')
  },
  filename: (_,file,cb) => {
    cb(null,file.originalname)
  }
})

const upload = multer({ storage })

app.use(cors())
app.use(express.json());

app.use('/uploads', express.static('uploads'))

app.post("/auth/login", loginValidator, handleValidationErrors, login);
app.get("/auth/me", checkAuth, getMe);
app.post("/auth/register", authValidator, handleValidationErrors,register);

app.post("/upload", checkAuth, upload.single("image"), (req,res) => {
  res.json({
    url:`/uploads/${req.file.originalname}`
  })
})

app.get("/posts/tags", getLastTags)
app.get("/posts/bytag/:tag", getPostsByTag)
app.get("/posts/popular", getPopularPosts)
app.get("/posts/:id", getOnePost)
app.get("/posts", getAllPosts)
app.post("/posts", checkAuth ,postCreateValidator, handleValidationErrors,createPost);
app.delete("/posts/:id", checkAuth , deletePost)
app.patch("/posts/:id", checkAuth, postCreateValidator, handleValidationErrors,updatePost)


app.listen(8081, (err) => {
  if (err) {
    console.log(err);
  }

  console.log("server running");
});
