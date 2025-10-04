// posts için gerekli routerları buraya yazın
const express = require('express');
const Posts = require('./posts-model.js');

const router = express.Router();

// 1. GET /api/posts - Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({
            message: "Gönderiler alınamadı"
        });
    }
});

// 2. GET /api/posts/:id - Get post by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Posts.findById(id);

        if (!post) {
            return res.status(404).json({
                message: "Belirtilen ID'li gönderi bulunamadı"
            });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({
            message: "Gönderi bilgisi alınamadı"
        });
    }
});

// 3. POST /api/posts - Create new post
router.post('/', async (req, res) => {
    try {
        const { title, contents } = req.body;

        if (!title || !contents) {
            return res.status(400).json({
                message: "Lütfen gönderi için bir title ve contents sağlayın"
            });
        }

        const newPostId = await Posts.insert({ title, contents });
        const newPost = await Posts.findById(newPostId.id);

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({
            message: "Veritabanına kaydedilirken bir hata oluştu"
        });
    }
});

// 4. PUT /api/posts/:id - Update post
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, contents } = req.body;

        const existingPost = await Posts.findById(id);
        if (!existingPost) {
            return res.status(404).json({
                message: "Belirtilen ID'li gönderi bulunamadı"
            });
        }

        if (!title || !contents) {
            return res.status(400).json({
                message: "Lütfen gönderi için title ve contents sağlayın"
            });
        }

        const updatedCount = await Posts.update(id, { title, contents });

        if (updatedCount > 0) {
            const updatedPost = await Posts.findById(id);
            res.json(updatedPost);
        } else {
            res.status(500).json({
                message: "Gönderi bilgileri güncellenemedi"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Gönderi bilgileri güncellenemedi"
        });
    }
});

// 5. DELETE /api/posts/:id - Delete post
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const existingPost = await Posts.findById(id);
        if (!existingPost) {
            return res.status(404).json({
                message: "Belirtilen ID li gönderi bulunamadı"
            });
        }

        const deletedCount = await Posts.remove(id);

        if (deletedCount > 0) {
            res.json(existingPost);
        } else {
            res.status(500).json({
                message: "Gönderi silinemedi"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Gönderi silinemedi"
        });
    }
});

// 6. GET /api/posts/:id/comments - Get comments for post
router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;

        const existingPost = await Posts.findById(id);
        if (!existingPost) {
            return res.status(404).json({
                message: "Girilen ID'li gönderi bulunamadı."
            });
        }

        const comments = await Posts.findPostComments(id);
        res.json(comments);
    } catch (error) {
        res.status(500).json({
            message: "Yorumlar bilgisi getirilemedi"
        });
    }
});

module.exports = router;