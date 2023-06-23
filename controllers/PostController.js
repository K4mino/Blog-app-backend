import PostModel from "../models/Post.js"

export const createPost = async(req,res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        })

        const post = await doc.save()
        
        res.json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({
          message:'Не удалось создать пост'
      })
    }
}

export const getAllPosts = async(req,res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()

        res.json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({
          message:'Не удалось получить посты'
      })
    }
}

export const getOnePost = async(req,res)=> {
    try {
        const id = req.params.id

        const post = await PostModel.findOneAndUpdate(
            {
                _id:id
            },
            {
                $inc:{ viewsCount:1 }
            },
            {
                returnDocument: 'after'
            },
        ).populate('user')

        res.json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({
          message:'Не удалось получить пост'
      })
    }
}

export const deletePost = async(req,res) => {
    try {
        const id = req.params.id

        PostModel.findByIdAndDelete(
            {
                _id:id
            },
        ).then((_) => {
            return res.json({success:true})
        }).catch((err) => {
            console.log(err)
            return res.status(500).json({
                message:'Не удалось удалить пост'
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
          message:'Не удалось удалить пост'
      })
    }
}

export const updatePost = async(req,res) => {
    try {
        const id = req.params.id

        await PostModel.findOneAndUpdate(
            {
                _id:id
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            }
        )

        res.json({
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
          message:'Не удалось обновить пост'
      })
    }
}

export const getLastTags = async(req,res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()
        const tags = Array.from(new Set(posts.map((post) => post.tags).flat().slice(0,5)))
        res.json(tags)
    } catch (error) {
        console.log(error)
        res.status(500).json({
          message:'Не удалось получить тэги'
      })
    }
}

export const getPopularPosts = async(req,res) => {
    try {
        const posts = await PostModel.find().sort({viewsCount: -1}).populate('user').exec()
        console.log(posts)
        res.json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({
          message:'Не удалось получить посты'
      })
    }
}

export const getPostsByTag = async(req,res) => {
    try {
        const tag = req.params.tag

        const posts = await PostModel.find({ tags: { $in: [tag] } });
        res.json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({
          message:'Не удалось получить посты'
      })
    }
}