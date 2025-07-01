import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';
import axiosInstance from "../api/axios";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log("İstekten çönce");
      const res = await axiosInstance.post('/login', { email, password });
      console.log("İstekten sonra");
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız');
    }
  };

  return (
     <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Giriş Yap</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
}

export default LoginPage;
