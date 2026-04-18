import './index.scss';

import { useEffect, useState } from 'react';

import { apiRequest } from '../../services/api';
import type { User } from '../../types/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');

  async function loadUsers() {
    const response = await apiRequest<User[]>('/api/admin/users');
    setUsers(response);
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function updateUser(userId: string, updates: Partial<User>) {
    await apiRequest(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    setMessage('User updated');
    await loadUsers();
  }

  return (
    <div className="admin-users stack">
      <div>
        <h2>Users</h2>
        <p>Approve clients, grant admin access, and adjust user-specific markup.</p>
      </div>
      {message ? <p>{message}</p> : null}
      <div className="admin-users__table">
        {users.map((user) => (
          <div className="admin-users__row" key={user._id}>
            <div>
              <strong>{user.displayName}</strong>
              <p>{user.email}</p>
            </div>
            <label>
              Approved
              <input
                checked={user.isApproved}
                onChange={(event) => updateUser(user._id, { isApproved: event.target.checked })}
                type="checkbox"
              />
            </label>
            <label>
              Admin
              <input
                checked={user.isAdmin}
                onChange={(event) => updateUser(user._id, { isAdmin: event.target.checked })}
                type="checkbox"
              />
            </label>
            <label>
              Markup
              <input
                min="0"
                onBlur={(event) => updateUser(user._id, { markupAmount: Number(event.target.value) })}
                step="0.01"
                type="number"
                defaultValue={user.markupAmount}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
