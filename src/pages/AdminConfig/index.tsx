import './index.scss';

import { useEffect, useState } from 'react';

import { apiRequest } from '../../services/api';
import type { Config } from '../../types/api';

const emptyConfig: Config = {
  deliveryDays: [1, 2, 3, 4, 5, 6],
  lastOrderTime: '20:00',
  orderThanksMessage: 'Thank you for your order!',
  contactEmail: 'chrystelleseidman@gmail.com',
  orderNotificationEmails: []
};

export default function AdminConfig() {
  const [config, setConfig] = useState<Config>(emptyConfig);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadConfig() {
      const response = await apiRequest<Config>('/api/admin/config');
      if (response) {
        setConfig(response);
      }
    }

    void loadConfig();
  }, []);

  async function saveConfig() {
    await apiRequest('/api/admin/config', {
      method: 'PUT',
      body: JSON.stringify({
        ...config,
        deliveryDays: config.deliveryDays,
        orderNotificationEmails: config.orderNotificationEmails
      })
    });

    setMessage('Config saved');
  }

  return (
    <div className="admin-config stack">
      <div>
        <h2>General config</h2>
        <p>Control scheduling rules, thank-you copy, and who receives admin order emails.</p>
      </div>
      <div className="field-grid">
        <label>
          Delivery days
          <input
            onChange={(event) =>
              setConfig((current) => ({
                ...current,
                deliveryDays: event.target.value
                  .split(',')
                  .map((value) => Number(value.trim()))
                  .filter((value) => !Number.isNaN(value))
              }))
            }
            value={config.deliveryDays.join(', ')}
          />
        </label>
        <label>
          Last order time
          <input
            onChange={(event) => setConfig((current) => ({ ...current, lastOrderTime: event.target.value }))}
            value={config.lastOrderTime}
          />
        </label>
      </div>
      <label>
        Order thanks message
        <textarea
          onChange={(event) => setConfig((current) => ({ ...current, orderThanksMessage: event.target.value }))}
          rows={3}
          value={config.orderThanksMessage}
        />
      </label>
      <label>
        Contact email
        <input onChange={(event) => setConfig((current) => ({ ...current, contactEmail: event.target.value }))} value={config.contactEmail} />
      </label>
      <label>
        Order notification emails
        <input
          onChange={(event) =>
            setConfig((current) => ({
              ...current,
              orderNotificationEmails: event.target.value
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean)
            }))
          }
          value={config.orderNotificationEmails.join(', ')}
        />
      </label>
      <button className="primary" onClick={saveConfig} type="button">
        Save config
      </button>
      {message ? <p>{message}</p> : null}
    </div>
  );
}
