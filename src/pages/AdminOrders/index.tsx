import './index.scss';

import { useEffect, useState } from 'react';

import StatusPill from '../../components/StatusPill';
import { apiRequest } from '../../services/api';
import type { Order, OrderStatus } from '../../types/api';

const statuses: OrderStatus[] = ['pending', 'confirmed', 'ready', 'completed', 'cancelled'];

function getUserName(order: Order) {
  return typeof order.userId === 'string' ? order.userId : order.userId.displayName;
}

function getStoreName(order: Order) {
  return typeof order.storeId === 'string' ? order.storeId : order.storeId.name;
}

function getProductName(productId: Order['lineItems'][number]['productId']) {
  if (typeof productId === 'string') {
    return productId;
  }

  return productId.name;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function loadOrders() {
    const response = await apiRequest<Order[]>('/api/admin/orders');
    setOrders(response);
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  async function updateStatus(orderId: string, status: OrderStatus) {
    await apiRequest(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, sendEmail: true })
    });

    await loadOrders();
  }

  return (
    <div className="admin-orders stack">
      <div>
        <h2>Orders</h2>
        <p>Every order placed by an approved client appears here with its status and line items.</p>
      </div>
      <div className="admin-orders__list">
        {orders.map((order) => (
          <article className="admin-orders__card" key={order._id}>
            <div className="admin-orders__top">
              <div>
                <strong>{getUserName(order)}</strong>
                <p>
                  {getStoreName(order)} on {order.fulfillmentDate}
                </p>
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
            <div className="admin-orders__bottom">
              <strong>Total: ${order.totals.total.toFixed(2)}</strong>
              <select onChange={(event) => updateStatus(order._id, event.target.value as OrderStatus)} value={order.status}>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
