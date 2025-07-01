import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  // Header →  Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Yetkisiz – token yok' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // İlerde ihtiyaç olursa userId’yi req nesnesine ekliyoruz
    req.userId = decoded.userId;
    next();                               // → bir sonraki middleware/route
  } catch (err) {
    return res.status(401).json({ message: 'Geçersiz token' });
  }
}
