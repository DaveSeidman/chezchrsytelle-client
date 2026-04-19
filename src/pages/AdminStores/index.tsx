import './index.scss';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

import { apiRequest } from '../../services/api';
import type { Product, Store } from '../../types/api';

const emptyStore = {
  name: '',
  slug: '',
  description: '',
  isActive: true,
  pickupAddress: '',
  pickupNotes: '',
  markupAmount: 0,
  availableProductIds: [] as string[],
  options: {} as Record<string, unknown>
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

export default function AdminStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState(emptyStore);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState(emptyStore);

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
    await apiRequest('/api/admin/stores', { method: 'POST', body: JSON.stringify(draft) });
    setDraft(emptyStore);
    await loadData();
  }

  async function saveEditedStore() {
    if (!editingStoreId) {
      return;
    }

    await apiRequest(`/api/admin/stores/${editingStoreId}`, {
      method: 'PATCH',
      body: JSON.stringify(editingDraft)
    });

    setEditingStoreId(null);
    setEditingDraft(emptyStore);
    await loadData();
  }

  async function deleteStore(storeId: string) {
    const confirmed = window.confirm('Are you sure you want to delete this store?');

    if (!confirmed) {
      return;
    }

    await apiRequest(`/api/admin/stores/${storeId}`, { method: 'DELETE' });

    if (editingStoreId === storeId) {
      setEditingStoreId(null);
      setEditingDraft(emptyStore);
    }

    await loadData();
  }

  function resetEditor() {
    setDraft(emptyStore);
  }

  function startEditingStore(store: Store) {
    setEditingStoreId(store._id);
    setEditingDraft({
      name: store.name,
      slug: store.slug,
      description: store.description,
      isActive: store.isActive,
      pickupAddress: store.pickupAddress,
      pickupNotes: store.pickupNotes,
      markupAmount: store.markupAmount,
      availableProductIds: store.availableProductIds,
      options: store.options
    });
  }

  function cancelEditingStore() {
    setEditingStoreId(null);
    setEditingDraft(emptyStore);
  }

  function renderStoreForm(
    storeDraft: typeof emptyStore,
    setStoreDraft: Dispatch<SetStateAction<typeof emptyStore>>,
    onSave: () => Promise<void> | void,
    onCancel: () => void,
    submitLabel: string,
    title: string,
    description: string,
    className = 'admin-stores__editor'
  ) {
    return (
      <div className={`${className} stack`}>
        <div>
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
        <div className="field-grid">
          <label>
            Name
            <input onChange={(event) => setStoreDraft((current) => ({ ...current, name: event.target.value }))} value={storeDraft.name} />
          </label>
          <label>
            Slug
            <input onChange={(event) => setStoreDraft((current) => ({ ...current, slug: event.target.value }))} value={storeDraft.slug} />
          </label>
        </div>
        <div className="field-grid">
          <label>
            Pickup address
            <input
              onChange={(event) => setStoreDraft((current) => ({ ...current, pickupAddress: event.target.value }))}
              value={storeDraft.pickupAddress}
            />
          </label>
          <label>
            Store markup
            <input
              min="0"
              onChange={(event) => setStoreDraft((current) => ({ ...current, markupAmount: Number(event.target.value) }))}
              step="0.01"
              type="number"
              value={storeDraft.markupAmount.toFixed(2)}
            />
          </label>
          <label>
            Pickup notes
            <input
              onChange={(event) => setStoreDraft((current) => ({ ...current, pickupNotes: event.target.value }))}
              value={storeDraft.pickupNotes}
            />
          </label>
        </div>
        <label>
          Description
          <textarea onChange={(event) => setStoreDraft((current) => ({ ...current, description: event.target.value }))} rows={3} value={storeDraft.description} />
        </label>
        <label className="admin-stores__checkbox">
          <input
            checked={storeDraft.isActive}
            onChange={(event) => setStoreDraft((current) => ({ ...current, isActive: event.target.checked }))}
            type="checkbox"
          />
          Active store
        </label>
        <div className="admin-stores__products">
          {products.map((product) => (
            <label key={product._id}>
              <input
                checked={storeDraft.availableProductIds.includes(product._id)}
                onChange={(event) => {
                  setStoreDraft((current) => ({
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
          <button className="primary" onClick={() => void onSave()} type="button">
            {submitLabel}
          </button>
          <button onClick={onCancel} type="button">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-stores stack">
      <div>
        <h2>Stores</h2>
        <p>Admins control which products appear at each store and add store-specific notes.</p>
      </div>

      <div className="admin-stores__list">
        {stores.map((store) => (
          <article className="admin-stores__card" key={store._id}>
            <div className="admin-stores__card-top">
              <div>
                <strong>{store.name}</strong>
                <p>{store.pickupAddress}</p>
                <p>Markup: {formatCurrency(store.markupAmount)}</p>
              </div>
              <div className="admin-stores__actions">
                <button onClick={() => startEditingStore(store)} type="button">
                  Edit
                </button>
                <button onClick={() => deleteStore(store._id)} type="button">
                  Delete
                </button>
              </div>
            </div>
            {editingStoreId === store._id
              ? renderStoreForm(
                  editingDraft,
                  setEditingDraft,
                  saveEditedStore,
                  cancelEditingStore,
                  'Save changes',
                  `Edit ${store.name}`,
                  'Update pickup details, markup, and product availability for this store.',
                  'admin-stores__editor admin-stores__editor--inline'
                )
              : null}
          </article>
        ))}
      </div>

      {renderStoreForm(
        draft,
        setDraft,
        saveStore,
        resetEditor,
        'Create store',
        'Add new store',
        'Set up a store, define pickup details, and choose which products it can order.'
      )}
    </div>
  );
}
