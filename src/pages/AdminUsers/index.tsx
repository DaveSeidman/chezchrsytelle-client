import './index.scss';

import { useEffect, useState } from 'react';

import { apiRequest } from '../../services/api';
import type { Store, User } from '../../types/api';

function getReviewPriority(user: User) {
  if (user.isAdmin) {
    return 2;
  }

  if (user.status === 'pending') {
    return 0;
  }

  return 1;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [message, setMessage] = useState('');

  async function loadUsers() {
    const [userResponse, storeResponse] = await Promise.all([
      apiRequest<User[]>('/api/admin/users'),
      apiRequest<Store[]>('/api/admin/stores')
    ]);

    setUsers(userResponse);
    setStores(storeResponse);
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
        <p>Review new signups, approve or deny access, grant admin access, and adjust user-specific markup.</p>
      </div>
      {message ? <p>{message}</p> : null}
      <div className="admin-users__table">
        {[...users]
          .sort((left, right) => {
            const priorityDifference = getReviewPriority(left) - getReviewPriority(right);

            if (priorityDifference !== 0) {
              return priorityDifference;
            }

            return right.createdAt.localeCompare(left.createdAt);
          })
          .map((user) => (
          <div className="admin-users__row" key={user._id}>
            <div className="admin-users__identity">
              <strong>{user.displayName}</strong>
              <p>{user.email}</p>
            </div>
            <div className="admin-users__status">
              <span>Status: {user.isAdmin ? 'approved' : user.status}</span>
              <div className="admin-users__actions">
                <button onClick={() => updateUser(user._id, { status: 'approved' })} type="button">
                  Approve
                </button>
                <button onClick={() => updateUser(user._id, { status: 'denied' })} type="button">
                  Deny
                </button>
                <button onClick={() => updateUser(user._id, { status: 'pending' })} type="button">
                  Reset
                </button>
              </div>
            </div>
            <div className="admin-users__stores">
              <span>Stores</span>
              <div className="admin-users__store-list">
                {stores.map((store) => (
                  <label key={`${user._id}-${store._id}`}>
                    <input
                      checked={user.assignedStoreIds.includes(store._id)}
                      onChange={(event) => {
                        const nextStoreIds = event.target.checked
                          ? [...user.assignedStoreIds, store._id]
                          : user.assignedStoreIds.filter((storeId) => storeId !== store._id);

                        void updateUser(user._id, { assignedStoreIds: nextStoreIds } as Partial<User>);
                      }}
                      type="checkbox"
                    />
                    {store.name}
                  </label>
                ))}
              </div>
            </div>
            <label>
              Admin
              <input
                checked={user.isAdmin}
                onChange={(event) => updateUser(user._id, { isAdmin: event.target.checked })}
                type="checkbox"
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
