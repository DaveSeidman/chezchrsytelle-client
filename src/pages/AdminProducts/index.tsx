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

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState(emptyProduct);

  async function loadProducts() {
    const response = await apiRequest<Product[]>('/api/admin/products');
    setProducts(response);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  async function saveProduct() {
    await apiRequest('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify({
        ...draft,
        ingredients: draft.ingredients
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      })
    });

    setDraft(emptyProduct);
    await loadProducts();
  }

  async function deleteProduct(productId: string) {
    await apiRequest(`/api/admin/products/${productId}`, { method: 'DELETE' });
    await loadProducts();
  }

  function resetEditor() {
    setDraft(emptyProduct);
  }

  return (
    <div className="admin-products stack">
      <div>
        <h2>Products</h2>
        <p>Manage the global product catalog here. Store availability is controlled from the stores screen.</p>
      </div>

      <div className="admin-products__list">
        {products.map((product) => (
          <article className="admin-products__card" key={product._id}>
            <div className="admin-products__card-copy">
              <strong>{product.name}</strong>
              <div className="admin-products__meta">
                <span>{product.size}</span>
                <span>{formatCurrency(product.price)}</span>
              </div>
              <p>{product.ingredients.join(', ')}</p>
            </div>
            <div className="admin-products__inline">
              <label className="admin-products__checkbox">
                <input
                  checked={product.isActive}
                  onChange={async (event) => {
                    await apiRequest(`/api/admin/products/${product._id}`, {
                      method: 'PATCH',
                      body: JSON.stringify({ isActive: event.target.checked })
                    });

                    await loadProducts();
                  }}
                  type="checkbox"
                />
                Active
              </label>
              <button onClick={() => deleteProduct(product._id)} type="button">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="admin-products__create stack">
        <div className="admin-products__editor-header">
          <div>
            <strong>Add new product</strong>
            <p>Use precise pricing here so each store sees clean client-ready totals.</p>
          </div>
          <span className="admin-products__price-badge">{formatCurrency(draft.price)}</span>
        </div>
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
            Create product
          </button>
          <button onClick={resetEditor} type="button">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
