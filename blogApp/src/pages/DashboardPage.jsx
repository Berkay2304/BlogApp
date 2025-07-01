import '../styles/dashboard.css';
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axiosInstance.get('/posts');
    setPosts(res.data);
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    await axiosInstance.post('/posts', { title, content });
    setTitle('');
    setContent('');
    fetchPosts();
  };

  const handleDeletePost = async (id) => {
    await axiosInstance.delete(`/posts/${id}`);
    fetchPosts();
  };

  const startEditing = (post) => {
    setEditId(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const saveEdit = async () => {
    await axiosInstance.put(`/posts/${editId}`, {
      title: editTitle,
      content: editContent,
    });
    setEditId(null);
    setEditTitle('');
    setEditContent('');
    fetchPosts();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Merhaba, {localStorage.getItem('username')}</h2>
        <button onClick={handleLogout}>Çıkış</button>
      </div>

      <form onSubmit={handleAddPost}>
        <input
          type="text"
          placeholder="Yazı başlığı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Yazı içeriği"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Ekle</button>
      </form>

      {posts.map((post) => (
        <div className="post-item" key={post._id}>
          {editId === post._id ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                rows={4}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <button onClick={saveEdit}>Kaydet</button>
              <button onClick={() => setEditId(null)}>İptal</button>
            </>
          ) : (
            <>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>Oluşturulma: {new Date(post.createdAt).toLocaleString()}</small>
              <br />
              <button onClick={() => startEditing(post)}>Düzenle</button>
              <button onClick={() => handleDeletePost(post._id)}>Sil</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
