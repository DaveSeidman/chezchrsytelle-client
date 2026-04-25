import './index.scss';

import type { Product, Store } from '../../types/api';

type ProductsProps = {
  products: Product[];
  sectionRef: (element: HTMLElement | null) => void;
  selectedStoreId: string;
  stores: Store[];
  onStoreChange: (storeId: string) => void;
};

export default function Products({ products, sectionRef, selectedStoreId, stores, onStoreChange }: ProductsProps) {
  const selectedStore = stores.find((store) => store._id === selectedStoreId) ?? null;

  return (
    <div className="page products" id="products" ref={sectionRef}>
      <h1 className="page_title">Menu</h1>
      <div className="page_body">
        <div className="products-section stack">
          <div className="products-section__controls">
            <label>
              Store
              <select onChange={(event) => onStoreChange(event.target.value)} value={selectedStoreId}>
                {stores.map((store) => (
                  <option key={store._id} value={store._id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="products-section__grid">
            {products.map((product) => {
              const displayPrice = product.price + (selectedStore?.markupAmount ?? 0);

              return (
                <article className="products-section__card" key={product._id}>
                  {product.image ? (
                    <div className="products-section__image">
                      <img alt={product.name} src={product.image} />
                    </div>
                  ) : null}
                  <div className="products-section__meta">
                    <span>{product.baseName}</span>
                    <strong>{product.size}</strong>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.ingredients.join(', ')}</p>
                  <div className="products-section__footer">
                    <span>${displayPrice.toFixed(2)}</span>
                    {(selectedStore?.markupAmount ?? 0) > 0 ? <small>Includes this store's markup.</small> : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
