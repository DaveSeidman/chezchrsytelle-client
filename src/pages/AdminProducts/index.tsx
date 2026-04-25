import './index.scss';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

import { apiRequest } from '../../services/api';
import type { Product } from '../../types/api';

const emptyProduct = {
  name: '',
  slug: '',
  baseName: '',
  size: 'small' as 'small' | 'large',
  ingredients: '',
  image: '',
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

function normalizeImagePath(value: string) {
  const trimmed = value.trim();

  if (!trimmed || /^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) {
    return trimmed;
  }

  return `/${trimmed}`;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState(emptyProduct);

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
        image: normalizeImagePath(draft.image),
        ingredients: draft.ingredients
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      })
    });

    setDraft(emptyProduct);
    await loadProducts();
  }

  async function saveEditedProduct() {
    if (!editingProductId) {
      return;
    }

    await apiRequest(`/api/admin/products/${editingProductId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...editingDraft,
        image: normalizeImagePath(editingDraft.image),
        ingredients: editingDraft.ingredients
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      })
    });

    setEditingProductId(null);
    setEditingDraft(emptyProduct);
    await loadProducts();
  }

  async function deleteProduct(productId: string) {
    await apiRequest(`/api/admin/products/${productId}`, { method: 'DELETE' });

    if (editingProductId === productId) {
      setEditingProductId(null);
      setEditingDraft(emptyProduct);
    }

    await loadProducts();
  }

  function resetEditor() {
    setDraft(emptyProduct);
  }

  function startEditingProduct(product: Product) {
    setEditingProductId(product._id);
    setEditingDraft({
      name: product.name,
      slug: product.slug,
      baseName: product.baseName,
      size: product.size,
      ingredients: product.ingredients.join(', '),
      image: product.image ? product.image.replace(/^\//, '') : '',
      price: product.price,
      isActive: product.isActive,
      sortOrder: product.sortOrder
    });
  }

  function cancelEditingProduct() {
    setEditingProductId(null);
    setEditingDraft(emptyProduct);
  }

  function renderProductForm(
    productDraft: typeof emptyProduct,
    setProductDraft: Dispatch<SetStateAction<typeof emptyProduct>>,
    onSave: () => Promise<void> | void,
    onCancel: () => void,
    submitLabel: string,
    title: string,
    description: string,
    className = 'admin-products__create'
  ) {
    return (
      <div className={`${className} stack`}>
        <div className="admin-products__editor-header">
          <div>
            <strong>{title}</strong>
            <p>{description}</p>
          </div>
          <span className="admin-products__price-badge">{formatCurrency(productDraft.price)}</span>
        </div>
        <div className="field-grid">
          <label>
            Name
            <input onChange={(event) => setProductDraft((current) => ({ ...current, name: event.target.value }))} value={productDraft.name} />
          </label>
          <label>
            Slug
            <input onChange={(event) => setProductDraft((current) => ({ ...current, slug: event.target.value }))} value={productDraft.slug} />
          </label>
          <label>
            Base name
            <input onChange={(event) => setProductDraft((current) => ({ ...current, baseName: event.target.value }))} value={productDraft.baseName} />
          </label>
          <label>
            Size
            <select
              onChange={(event) => setProductDraft((current) => ({ ...current, size: event.target.value as 'small' | 'large' }))}
              value={productDraft.size}
            >
              <option value="small">small</option>
              <option value="large">large</option>
            </select>
          </label>
          <label>
            Price
            <input
              min="0"
              onChange={(event) => setProductDraft((current) => ({ ...current, price: Number(event.target.value) }))}
              step="0.01"
              type="number"
              value={productDraft.price}
            />
          </label>
          <label>
            Sort order
            <input
              min="0"
              onChange={(event) => setProductDraft((current) => ({ ...current, sortOrder: Number(event.target.value) }))}
              type="number"
              value={productDraft.sortOrder}
            />
          </label>
        </div>
        <label>
          Ingredients
          <input
            onChange={(event) => setProductDraft((current) => ({ ...current, ingredients: event.target.value }))}
            placeholder="greens, tomatoes, cucumbers"
            value={productDraft.ingredients}
          />
        </label>
        <label>
          Image URL
          <input
            onChange={(event) => setProductDraft((current) => ({ ...current, image: event.target.value }))}
            placeholder="products/plain-salad-small.png"
            value={productDraft.image}
          />
        </label>
        {productDraft.image ? (
          <div className="admin-products__image-preview-grid">
            <div className="admin-products__image-preview">
              <img alt="" src={normalizeImagePath(productDraft.image)} />
              <small>{normalizeImagePath(productDraft.image)}</small>
            </div>
          </div>
        ) : null}
        <label className="admin-products__checkbox">
          <input
            checked={productDraft.isActive}
            onChange={(event) => setProductDraft((current) => ({ ...current, isActive: event.target.checked }))}
            type="checkbox"
          />
          Active
        </label>
        <div className="admin-products__editor-actions">
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
    <div className="admin-products stack">
      <div>
        <h2>Products</h2>
        <p>Manage the global product catalog here. Store availability is controlled from the stores screen.</p>
      </div>

      <div className="admin-products__list">
        {products.map((product) => (
          <article className="admin-products__card" key={product._id}>
            <div className="admin-products__card-top">
              <div className="admin-products__card-copy">
                <strong>{product.name}</strong>
                <div className="admin-products__meta">
                  <span>{product.size}</span>
                  <span>{formatCurrency(product.price)}</span>
                </div>
                <p>{product.ingredients.join(', ')}</p>
                <p>Image: {product.image ? 'set' : 'not set'}</p>
                {product.image ? (
                  <div className="admin-products__card-image">
                    <img alt={product.name} src={product.image} />
                  </div>
                ) : null}
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
                <button onClick={() => startEditingProduct(product)} type="button">
                  Edit
                </button>
                <button onClick={() => deleteProduct(product._id)} type="button">
                  Delete
                </button>
              </div>
            </div>
            {editingProductId === product._id
              ? renderProductForm(
                  editingDraft,
                  setEditingDraft,
                  saveEditedProduct,
                  cancelEditingProduct,
                  'Save changes',
                  `Edit ${product.name}`,
                  'Update pricing, naming, ingredient copy, and activation state for this product.',
                  'admin-products__create admin-products__create--inline'
                )
              : null}
          </article>
        ))}
      </div>

      {renderProductForm(
        draft,
        setDraft,
        saveProduct,
        resetEditor,
        'Create product',
        'Add new product',
        'Use precise pricing here so each store sees clean client-ready totals.'
      )}
    </div>
  );
}
