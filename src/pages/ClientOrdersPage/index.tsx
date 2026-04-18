import './index.scss';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import StatusPill from '../../components/StatusPill';
import { apiRequest } from '../../services/api';
import type { Order } from '../../types/api';

function getStoreName(order: Order) {
  return typeof order.storeId === 'string' ? order.storeId : order.storeId.name;
}

function getProductName(productId: Order['lineItems'][number]['productId']) {
  if (typeof productId === 'string') {
    return productId;
  }

  return productId.name;
}

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadOrders() {
      const response = await apiRequest<Order[]>('/api/orders/me');
      setOrders(response);
    }

    void loadOrders();
  }, []);

  return (
    <div className="client-orders page-shell">
      <div className="client-orders__header">
        <div>
          <h1>My orders</h1>
          <p>Track every submitted order and its status here.</p>
        </div>
        <Link to="/">Back to site</Link>
      </div>

      <div className="client-orders__list">
        {orders.map((order) => (
          <article className="client-orders__card card" key={order._id}>
            <div className="client-orders__top">
              <div>
                <h2>{getStoreName(order)}</h2>
                <p>Fulfillment date: {order.fulfillmentDate}</p>
              </div>
              <StatusPill>{order.status}</StatusPill>
            </div>
            <ul>
              {order.lineItems.map((lineItem, index) => (
                <li key={`${order._id}-${index}`}>
                  {getProductName(lineItem.productId)} x {lineItem.quantity} - ${lineItem.lineTotal.toFixed(2)}
                </li>
              ))}
            </ul>
            <strong>Total: ${order.totals.total.toFixed(2)}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
