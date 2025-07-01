import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  }

  return (
    <header style={{ background: '#eee', padding: '0.5rem 1rem', marginBottom: '1rem' }}>
      <span>Hoş geldin, <strong>{username}</strong></span>
      <button onClick={handleLogout} style={{ float: 'right' }}>Çıkış</button>
    </header>
  );
}

export default Navbar;
