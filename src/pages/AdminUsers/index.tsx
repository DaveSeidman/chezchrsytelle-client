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

function getEffectiveStatus(user: User) {
  return user.isAdmin ? 'approved' : user.status;
}

function getUsersById(users: User[]) {
  return Object.fromEntries(users.map((user) => [user._id, user]));
}

function haveSameStoreIds(left: string[], right: string[]) {
  const normalizedLeft = [...left].sort();
  const normalizedRight = [...right].sort();

  return normalizedLeft.length === normalizedRight.length && normalizedLeft.every((storeId, index) => storeId === normalizedRight[index]);
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [savedUsers, setSavedUsers] = useState<Record<string, User>>({});
  const [stores, setStores] = useState<Store[]>([]);
  const [message, setMessage] = useState('');

  async function loadUsers() {
    const [userResponse, storeResponse] = await Promise.all([
      apiRequest<User[]>('/api/admin/users'),
      apiRequest<Store[]>('/api/admin/stores')
    ]);

    setUsers(userResponse);
    setSavedUsers(getUsersById(userResponse));
    setStores(storeResponse);
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  function updateDraftUser(userId: string, updates: Partial<User>) {
    setUsers((currentUsers) =>
      currentUsers.map((user) => {
        if (user._id !== userId) {
          return user;
        }

        return {
          ...user,
          ...updates
        };
      })
    );
  }

  function isDirty(user: User) {
    const savedUser = savedUsers[user._id];

    if (!savedUser) {
      return false;
    }

    return (
      savedUser.status !== user.status ||
      Boolean(savedUser.isAdmin) !== Boolean(user.isAdmin) ||
      !haveSameStoreIds(savedUser.assignedStoreIds, user.assignedStoreIds)
    );
  }

  async function saveUser(user: User) {
    await apiRequest(`/api/admin/users/${user._id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: user.status,
        isAdmin: user.isAdmin,
        assignedStoreIds: user.assignedStoreIds
      })
    });
    setMessage('User updated');
    await loadUsers();
  }

  return (
    <div className="admin-users stack">
      <div>
        <h2>Users</h2>
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
            {!user.isAdmin ? (
              <div className="admin-users__status">
                <div className="admin-users__actions">
                  <button
                    className={getEffectiveStatus(user) === 'approved' ? 'is-active' : ''}
                    onClick={() => updateDraftUser(user._id, { status: 'approved' })}
                    type="button"
                  >
                    Approved
                  </button>
                  <button
                    className={getEffectiveStatus(user) === 'denied' ? 'is-active' : ''}
                    onClick={() => updateDraftUser(user._id, { status: 'denied' })}
                    type="button"
                  >
                    Denied
                  </button>
                  <button
                    className={getEffectiveStatus(user) === 'pending' ? 'is-active' : ''}
                    onClick={() => updateDraftUser(user._id, { status: 'pending' })}
                    type="button"
                  >
                    Pending
                  </button>
                </div>
              </div>
            ) : null}
            <div className="admin-users__stores">
              <select
                className="admin-users__store-select"
                multiple
                onChange={(event) => {
                  const nextStoreIds = Array.from(event.target.selectedOptions, (option) => option.value);
                  updateDraftUser(user._id, { assignedStoreIds: nextStoreIds } as Partial<User>);
                }}
                size={Math.min(Math.max(stores.length, 2), 6)}
                value={user.assignedStoreIds}
              >
                {stores.map((store) => (
                  <option key={`${user._id}-${store._id}`} value={store._id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
            <label className="admin-users__admin">
              Admin
              <input
                checked={user.isAdmin}
                onChange={(event) => updateDraftUser(user._id, { isAdmin: event.target.checked })}
                type="checkbox"
              />
            </label>
            <div className="admin-users__save">
              <button disabled={!isDirty(user)} onClick={() => void saveUser(user)} type="button">
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
