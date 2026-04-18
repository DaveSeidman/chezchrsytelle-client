import './index.scss';

import { useEffect, useState } from 'react';

import { apiRequest } from '../../services/api';
import type { Product } from '../../types/api';

const emptyProduct = {
  name: '',
  slug: '',
  baseName: '',
  size: 'small' as 'small' | 'large',
  ingredients: '',
  price: 0,
  isActive: true,
  sortOrder: 0
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  async function loadProducts() {
    const response = await apiRequest<Product[]>('/api/admin/products');
    setProducts(response);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  async function saveProduct() {
    await apiRequest(editingProductId ? `/api/admin/products/${editingProductId}` : '/api/admin/products', {
      method: editingProductId ? 'PATCH' : 'POST',
      body: JSON.stringify({
        ...draft,
        ingredients: draft.ingredients
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      })
    });

    setEditingProductId(null);
    setDraft(emptyProduct);
    await loadProducts();
  }

  async function updateProduct(product: Product, updates: Partial<Product>) {
    await apiRequest(`/api/admin/products/${product._id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });

    await loadProducts();
  }

  async function deleteProduct(productId: string) {
    await apiRequest(`/api/admin/products/${productId}`, { method: 'DELETE' });
    if (editingProductId === productId) {
      setEditingProductId(null);
      setDraft(emptyProduct);
    }
    await loadProducts();
  }

  function startEdit(product: Product) {
    setEditingProductId(product._id);
    setDraft({
      name: product.name,
      slug: product.slug,
      baseName: product.baseName,
      size: product.size,
      ingredients: product.ingredients.join(', '),
      price: product.price,
      isActive: product.isActive,
      sortOrder: product.sortOrder
    });
  }

  function resetEditor() {
    setEditingProductId(null);
    setDraft(emptyProduct);
  }

  return (
    <div className="admin-products stack">
      <div>
        <h2>Products</h2>
        <p>Manage the global product catalog here. Store availability is controlled from the stores screen.</p>
      </div>

      <div className="admin-products__create stack">
        <div className="field-grid">
          <label>
            Name
            <input onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} value={draft.name} />
          </label>
          <label>
            Slug
            <input onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))} value={draft.slug} />
          </label>
          <label>
            Base name
            <input onChange={(event) => setDraft((current) => ({ ...current, baseName: event.target.value }))} value={draft.baseName} />
          </label>
          <label>
            Size
            <select onChange={(event) => setDraft((current) => ({ ...current, size: event.target.value as 'small' | 'large' }))} value={draft.size}>
              <option value="small">small</option>
              <option value="large">large</option>
            </select>
          </label>
          <label>
            Price
            <input min="0" onChange={(event) => setDraft((current) => ({ ...current, price: Number(event.target.value) }))} step="0.01" type="number" value={draft.price} />
          </label>
          <label>
            Sort order
            <input min="0" onChange={(event) => setDraft((current) => ({ ...current, sortOrder: Number(event.target.value) }))} type="number" value={draft.sortOrder} />
          </label>
        </div>
        <label>
          Ingredients
          <input
            onChange={(event) => setDraft((current) => ({ ...current, ingredients: event.target.value }))}
            placeholder="greens, tomatoes, cucumbers"
            value={draft.ingredients}
          />
        </label>
        <div className="admin-products__editor-actions">
          <button className="primary" onClick={saveProduct} type="button">
            {editingProductId ? 'Update product' : 'Create product'}
          </button>
          <button onClick={resetEditor} type="button">
            Clear
          </button>
        </div>
      </div>

      <div className="admin-products__list">
        {products.map((product) => (
          <article className="admin-products__card" key={product._id}>
            <div>
              <strong>{product.name}</strong>
              <p>{product.ingredients.join(', ')}</p>
            </div>
            <div className="admin-products__inline">
              <input
                defaultValue={product.price}
                min="0"
                onBlur={(event) => updateProduct(product, { price: Number(event.target.value) })}
                step="0.01"
                type="number"
              />
              <label className="admin-products__checkbox">
                <input
                  checked={product.isActive}
                  onChange={(event) => updateProduct(product, { isActive: event.target.checked })}
                  type="checkbox"
                />
                Active
              </label>
              <button onClick={() => startEdit(product)} type="button">
                Load into editor
              </button>
              <button onClick={() => deleteProduct(product._id)} type="button">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
