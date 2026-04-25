import './index.scss';

import { useEffect, useState } from 'react';

import ClientPortalShell from '../../components/ClientPortalShell';
import StatusPill from '../../components/StatusPill';
import { apiRequest } from '../../services/api';
import type { Order, PaginatedResponse } from '../../types/api';

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadOrders(targetPage = 1) {
    const response = await apiRequest<PaginatedResponse<Order>>(`/api/orders/me?page=${targetPage}&pageSize=20`);
    setOrders(response.items);
    setPage(response.page);
    setTotalPages(response.totalPages);
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  return (
    <ClientPortalShell description="Track every submitted order and watch status updates from the kitchen team." title="My Orders">
      <div className="client-orders">
        {orders.length === 0 ? (
          <p className="client-orders__empty">You haven't placed any orders yet.</p>
        ) : (
          <>
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
            <div className="client-orders__pagination">
              <button disabled={page <= 1} onClick={() => void loadOrders(page - 1)} type="button">
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button disabled={page >= totalPages} onClick={() => void loadOrders(page + 1)} type="button">
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </ClientPortalShell>
  );
}
