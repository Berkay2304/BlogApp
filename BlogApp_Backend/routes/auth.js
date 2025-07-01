import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Kayıt
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email zaten kayıtlı" });

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı kaydet
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Token oluştur
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.status(201).json({
      message: "Kayıt başarılı",
      token,
      username: newUser.username
    });

  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});


// Giriş
router.post('/login', async (req, res) => {
  try {
    console.log("Login isteğine girildi");
    const { email, password } = req.body;

    // Kullanıcı var mı?
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Geçersiz e-posta veya şifre" });

    // Şifre doğru mu?
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Geçersiz e-posta veya şifre" });

    // JWT oluştur
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '2h' });

    res.status(200).json({
      message: "Giriş başarılı",
      token,
      username: user.username
    });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

export default router;
