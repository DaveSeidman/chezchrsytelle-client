import './index.scss';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';
import type { Config, Product, Store } from '../../types/api';

type OrderProps = {
  config: Config | null;
  stores: Store[];
};

type OrderQuantities = Record<string, number>;

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function Order({ config, stores }: OrderProps) {
  const { login, user } = useAuth();
  const [fulfillmentDate, setFulfillmentDate] = useState(getTodayString());
  const [notes, setNotes] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<OrderQuantities>({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedOrder, setHasSubmittedOrder] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState('');

  useEffect(() => {
    const nextQuantities: OrderQuantities = {};

    for (const product of products) {
      nextQuantities[product._id] = quantities[product._id] ?? 0;
    }

    setQuantities(nextQuantities);
  }, [products]);

  useEffect(() => {
    if (!stores.length) {
      setSelectedStoreId('');
      setProducts([]);
      return;
    }

    if (!stores.some((store) => store._id === selectedStoreId)) {
      setSelectedStoreId(stores[0]._id);
    }
  }, [selectedStoreId, stores]);

  useEffect(() => {
    if (!selectedStoreId) {
      setProducts([]);
      return;
    }

    async function loadProducts() {
      const fetchedProducts = await apiRequest<Product[]>(`/api/products/public?storeId=${selectedStoreId}`);
      setProducts(fetchedProducts);
    }

    void loadProducts();
  }, [selectedStoreId]);

  const selectedStore = stores.find((store) => store._id === selectedStoreId) ?? null;
  const isApproved = Boolean(user && (user.status === 'approved' || user.isApproved || user.isAdmin));
  const isDenied = Boolean(user && user.status === 'denied' && !user.isAdmin);
  const hasStoreAssignments = user?.isAdmin ? stores.length > 0 : (user?.assignedStores.length ?? 0) > 0;
  const total = products.reduce((sum, product) => {
    const quantity = quantities[product._id] ?? 0;
    return sum + (product.price + (selectedStore?.markupAmount ?? 0)) * quantity;
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
      setHasSubmittedOrder(true);
      setNotes('');
      setQuantities(Object.fromEntries(products.map((product) => [product._id, 0])));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Order failed');
      setHasSubmittedOrder(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="order-section stack">
      {!user ? (
        <div className="order-section__notice">
          <p>Please sign in through the client portal before placing an order.</p>
          <button className="primary" onClick={login} type="button">
            Sign in with Google
          </button>
        </div>
      ) : null}

      {user && !isApproved && !isDenied ? (
        <div className="order-section__notice">
          <p>Your account is pending approval. Once approved, ordering will unlock automatically.</p>
          <Link to="/clients">Go to client portal</Link>
        </div>
      ) : null}

      {user && isDenied ? (
        <div className="order-section__notice">
          <p>Your signup request was declined. Reach out through the contact form if you think this was a mistake.</p>
          <Link to="/contact">Contact us</Link>
        </div>
      ) : null}

      {user && isApproved && !hasStoreAssignments ? (
        <div className="order-section__notice">
          <p>Your account is approved, but no stores have been assigned yet. An admin can add one or more stores from the users screen.</p>
          <Link to="/clients">Back to client portal</Link>
        </div>
      ) : null}

      {user && isApproved && hasStoreAssignments && hasSubmittedOrder ? (
        <div className="order-section__success">
          <p className="order-section__message">{message}</p>
          <p>We&apos;ll confirm it shortly and email you if we need anything else.</p>
          <div className="order-section__success-actions">
            <Link to="/clients/orders">View my orders</Link>
            <Link to="/clients">Back to client portal</Link>
          </div>
        </div>
      ) : null}

      {user && isApproved && hasStoreAssignments && !hasSubmittedOrder ? (
        <form className="order-section__form stack" onSubmit={submitOrder}>
          <div className="field-grid">
            <label>
              Store
              {stores.length === 1 && selectedStore ? (
                <div className="order-section__store-readout">{selectedStore.name}</div>
              ) : (
                <select onChange={(event) => setSelectedStoreId(event.target.value)} value={selectedStoreId}>
                  {stores.map((store) => (
                    <option key={store._id} value={store._id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              )}
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
                  <small>${(product.price + (selectedStore?.markupAmount ?? 0)).toFixed(2)}</small>
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
              <p>Past orders are always available in your client portal.</p>
            </div>
            <button className="primary" disabled={isSubmitting || total === 0} type="submit">
              {isSubmitting ? 'Submitting...' : 'Place order'}
            </button>
          </div>

          {message ? <p className="order-section__message">{message}</p> : null}
        </form>
      ) : null}
    </div>
  );
}
