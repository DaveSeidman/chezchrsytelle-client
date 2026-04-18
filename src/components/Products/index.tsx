import './index.scss';

import type { Product, Store } from '../../types/api';
import SectionPage from '../SectionPage';

type ProductsProps = {
  products: Product[];
  sectionRef: (element: HTMLElement | null) => void;
  selectedStoreId: string;
  stores: Store[];
  onStoreChange: (storeId: string) => void;
  userMarkupAmount: number;
};

export default function Products({
  products,
  sectionRef,
  selectedStoreId,
  stores,
  onStoreChange,
  userMarkupAmount
}: ProductsProps) {
  return (
    <SectionPage eyebrow="Menu" id="products" sectionRef={sectionRef} title="Current salad offerings">
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
            const displayPrice = product.price + userMarkupAmount;

            return (
              <article className="products-section__card" key={product._id}>
                <div className="products-section__meta">
                  <span>{product.baseName}</span>
                  <strong>{product.size}</strong>
                </div>
                <h3>{product.name}</h3>
                <p>{product.ingredients.join(', ')}</p>
                <div className="products-section__footer">
                  <span>${displayPrice.toFixed(2)}</span>
                  {userMarkupAmount > 0 ? <small>Includes your client markup.</small> : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SectionPage>
  );
}
