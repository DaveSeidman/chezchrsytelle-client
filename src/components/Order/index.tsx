import './index.scss';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';
import type { Config, Product, Store } from '../../types/api';
import SectionPage from '../SectionPage';

type OrderProps = {
  config: Config | null;
  onStoreChange: (storeId: string) => void;
  products: Product[];
  sectionRef: (element: HTMLElement | null) => void;
  selectedStoreId: string;
  stores: Store[];
};

type OrderQuantities = Record<string, number>;

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function Order({ config, onStoreChange, products, sectionRef, selectedStoreId, stores }: OrderProps) {
  const { login, user } = useAuth();
  const [fulfillmentDate, setFulfillmentDate] = useState(getTodayString());
  const [notes, setNotes] = useState('');
  const [quantities, setQuantities] = useState<OrderQuantities>({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const nextQuantities: OrderQuantities = {};

    for (const product of products) {
      nextQuantities[product._id] = quantities[product._id] ?? 0;
    }

    setQuantities(nextQuantities);
  }, [products]);

  const selectedStore = stores.find((store) => store._id === selectedStoreId) ?? null;
  const isApproved = Boolean(user && (user.isApproved || user.isAdmin));
  const total = products.reduce((sum, product) => {
    const quantity = quantities[product._id] ?? 0;
    return sum + (product.price + (user?.markupAmount ?? 0)) * quantity;
  }, 0);

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const lineItems = Object.entries(quantities)
        .filter(([, quantity]) => quantity > 0)
        .map(([productId, quantity]) => ({ productId, quantity }));

      await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          storeId: selectedStoreId,
          fulfillmentDate,
          notes,
          lineItems
        })
      });

      setMessage(config?.orderThanksMessage ?? 'Thank you for your order!');
      setNotes('');
      setQuantities(Object.fromEntries(products.map((product) => [product._id, 0])));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Order failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SectionPage eyebrow="Clients" id="order" sectionRef={sectionRef} title="Ordering is reserved for approved clients">
      <div className="order-section stack">
        {!user ? (
          <div className="order-section__notice">
            <p>Browse the menu above, then sign in if you have been approved for client ordering.</p>
            <button className="primary" onClick={login} type="button">
              Sign in with Google
            </button>
          </div>
        ) : null}

        {user && !isApproved ? (
          <div className="order-section__notice">
            <p>Your account is pending approval. Once approved, ordering will unlock automatically.</p>
            <Link to="/clients">Go to client account</Link>
          </div>
        ) : null}

        {user && isApproved ? (
          <form className="order-section__form stack" onSubmit={submitOrder}>
            <div className="field-grid">
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
              <label>
                Fulfillment date
                <input onChange={(event) => setFulfillmentDate(event.target.value)} type="date" value={fulfillmentDate} />
              </label>
            </div>

            {selectedStore ? (
              <p className="order-section__pickup">
                Pickup: {selectedStore.pickupAddress || 'Details to follow by email'} {selectedStore.pickupNotes}
              </p>
            ) : null}

            <div className="order-section__line-items">
              {products.map((product) => (
                <label className="order-section__item" key={product._id}>
                  <span>
                    <strong>{product.name}</strong>
                    <small>${(product.price + (user.markupAmount ?? 0)).toFixed(2)}</small>
                  </span>
                  <input
                    min="0"
                    onChange={(event) =>
                      setQuantities((current) => ({
                        ...current,
                        [product._id]: Number(event.target.value)
                      }))
                    }
                    type="number"
                    value={quantities[product._id] ?? 0}
                  />
                </label>
              ))}
            </div>

            <label>
              Notes
              <textarea onChange={(event) => setNotes(event.target.value)} rows={4} value={notes} />
            </label>

            <div className="order-section__actions">
              <div>
                <strong>Total: ${total.toFixed(2)}</strong>
                <p>Past orders are always available in your client account.</p>
              </div>
              <button className="primary" disabled={isSubmitting || total === 0} type="submit">
                {isSubmitting ? 'Submitting...' : 'Place order'}
              </button>
            </div>

            {message ? <p className="order-section__message">{message}</p> : null}
          </form>
        ) : null}
      </div>
    </SectionPage>
  );
}
