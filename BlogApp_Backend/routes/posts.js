import express from 'express';
import Post from '../models/Post.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

/* ➕ Yeni yazı */
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = await Post.create({
      title,
      content,
      author: req.userId
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

/* 📄 Kullanıcının tüm yazıları */
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* 🔍 Tek yazı (görüntüleme) */
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.userId });
    if (!post) return res.status(404).json({ message: 'Yazı bulunamadı' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ✏️ Güncelleme */
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const updated = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      { title, content },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Yazı bulunamadı' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* 🗑️ Silme */
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Post.findOneAndDelete({ _id: req.params.id, author: req.userId });
    if (!deleted) return res.status(404).json({ message: 'Yazı bulunamadı' });
    res.json({ message: 'Yazı silindi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
