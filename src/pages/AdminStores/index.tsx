import './index.scss';

import { useEffect, useState } from 'react';

import { apiRequest } from '../../services/api';
import type { Product, Store } from '../../types/api';

const emptyStore = {
  name: '',
  slug: '',
  description: '',
  isActive: true,
  pickupAddress: '',
  pickupNotes: '',
  availableProductIds: [] as string[],
  options: {} as Record<string, unknown>
};

export default function AdminStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState(emptyStore);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);

  async function loadData() {
    const [storeResponse, productResponse] = await Promise.all([
      apiRequest<Store[]>('/api/admin/stores'),
      apiRequest<Product[]>('/api/admin/products')
    ]);

    setStores(storeResponse);
    setProducts(productResponse);
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function saveStore() {
    const path = editingStoreId ? `/api/admin/stores/${editingStoreId}` : '/api/admin/stores';
    const method = editingStoreId ? 'PATCH' : 'POST';
    const body = JSON.stringify(draft);

    await apiRequest(path, { method, body });
    setEditingStoreId(null);
    setDraft(emptyStore);
    await loadData();
  }

  async function deleteStore(storeId: string) {
    await apiRequest(`/api/admin/stores/${storeId}`, { method: 'DELETE' });
    if (editingStoreId === storeId) {
      setEditingStoreId(null);
      setDraft(emptyStore);
    }
    await loadData();
  }

  function startEdit(store: Store) {
    setEditingStoreId(store._id);
    setDraft({
      name: store.name,
      slug: store.slug,
      description: store.description,
      isActive: store.isActive,
      pickupAddress: store.pickupAddress,
      pickupNotes: store.pickupNotes,
      availableProductIds: store.availableProductIds,
      options: store.options
    });
  }

  function resetEditor() {
    setEditingStoreId(null);
    setDraft(emptyStore);
  }

  return (
    <div className="admin-stores stack">
      <div>
        <h2>Stores</h2>
        <p>Admins control which products appear at each store and add store-specific notes.</p>
      </div>

      <div className="admin-stores__editor stack">
        <div className="field-grid">
          <label>
            Name
            <input onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} value={draft.name} />
          </label>
          <label>
            Slug
            <input onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))} value={draft.slug} />
          </label>
        </div>
        <div className="field-grid">
          <label>
            Pickup address
            <input
              onChange={(event) => setDraft((current) => ({ ...current, pickupAddress: event.target.value }))}
              value={draft.pickupAddress}
            />
          </label>
          <label>
            Pickup notes
            <input
              onChange={(event) => setDraft((current) => ({ ...current, pickupNotes: event.target.value }))}
              value={draft.pickupNotes}
            />
          </label>
        </div>
        <label>
          Description
          <textarea onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} rows={3} value={draft.description} />
        </label>
        <label className="admin-stores__checkbox">
          <input
            checked={draft.isActive}
            onChange={(event) => setDraft((current) => ({ ...current, isActive: event.target.checked }))}
            type="checkbox"
          />
          Active store
        </label>
        <div className="admin-stores__products">
          {products.map((product) => (
            <label key={product._id}>
              <input
                checked={draft.availableProductIds.includes(product._id)}
                onChange={(event) => {
                  setDraft((current) => ({
                    ...current,
                    availableProductIds: event.target.checked
                      ? [...current.availableProductIds, product._id]
                      : current.availableProductIds.filter((value) => value !== product._id)
                  }));
                }}
                type="checkbox"
              />
              {product.name}
            </label>
          ))}
        </div>
        <div className="admin-stores__editor-actions">
          <button className="primary" onClick={saveStore} type="button">
            {editingStoreId ? 'Update store' : 'Save new store'}
          </button>
          <button onClick={resetEditor} type="button">
            Clear
          </button>
        </div>
      </div>

      <div className="admin-stores__list">
        {stores.map((store) => (
          <article className="admin-stores__card" key={store._id}>
            <div>
              <strong>{store.name}</strong>
              <p>{store.pickupAddress}</p>
            </div>
            <div className="admin-stores__actions">
              <button onClick={() => startEdit(store)} type="button">
                Load into editor
              </button>
              <button onClick={() => deleteStore(store._id)} type="button">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
