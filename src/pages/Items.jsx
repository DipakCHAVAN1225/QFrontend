import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function Items({ user }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true; // guard to avoid setting state after unmount
    const controller = new AbortController(); // optional: cancel fetch if needed

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get('/items', { signal: controller.signal });
        if (!mounted) return; // component unmounted — don't call setState
        setItems(res.data);
      } catch (err) {
        if (!mounted) return;
        // handle abort vs real errors
        if (err.name === 'CanceledError' || err.name === 'AbortError') {
          // request was cancelled — do nothing
        } else {
          console.error('Failed to fetch items', err);
          setError('Failed to load items');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []); // run once on mount

  const addItem = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await API.post('/items', { title, desc: '' });
      // optimistically add the created item to UI
      setItems(prev => [res.data, ...prev]);
      setTitle('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Add failed');
    }
  };

  const deleteItem = async (id) => {
    try {
      await API.delete(`/items/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (
    <div>
      <h2>Items</h2>

      {loading && <p>Loading items…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {user ? (
        <form onSubmit={addItem}>
          <input
            placeholder="New item title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      ) : (
        <p>Please login to add items.</p>
      )}

      <div>
        {items.map(i => (
          <div key={i._id} style={{ border: '1px solid #ddd', margin: 8, padding: 8 }}>
            <h3>{i.title}</h3>
            <p>{i.desc}</p>
            <small>Owner: {i.owner?.name || 'N/A'}</small>
            {user && (user.id === i.owner?._id || user.id === i.owner) && (
              <button onClick={() => deleteItem(i._id)}>Delete</button>
            )}
          </div>
        ))}

        {!loading && items.length === 0 && <p>No items yet.</p>}
      </div>
    </div>
  );
}
