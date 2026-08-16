import './index.scss';

import { useEffect, useState } from 'react';

import { apiRequest } from '../../services/api';
import type { Config } from '../../types/api';

const weekdayOptions = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' }
] as const;

const emptyConfig: Config = {
  deliveryDays: [1, 2, 3, 4, 5, 6],
  lastOrderTime: '20:00',
  orderThanksMessage: 'Thank you for your order!',
  contactEmail: 'hello@chezchrystelle.com',
  orderNotificationEmails: ['hello@chezchrystelle.com'],
  signupNotificationEmails: ['hello@chezchrystelle.com']
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

  function toggleDeliveryDay(day: number) {
    setConfig((current) => {
      const nextDays = current.deliveryDays.includes(day)
        ? current.deliveryDays.filter((value) => value !== day)
        : [...current.deliveryDays, day];

      return {
        ...current,
        deliveryDays: nextDays.sort((left, right) => left - right)
      };
    });
  }

  async function saveConfig() {
    await apiRequest('/api/admin/config', {
      method: 'PUT',
      body: JSON.stringify({
        ...config,
        deliveryDays: config.deliveryDays,
        orderNotificationEmails: config.orderNotificationEmails,
        signupNotificationEmails: config.signupNotificationEmails
      })
    });

    setMessage('Config saved');
  }

  return (
    <div className="admin-config stack">
      <div>
        <h2>General config</h2>
        <p>Control scheduling rules, thank-you copy, and who receives signup and order emails.</p>
      </div>
      <div className="field-grid">
        <label>
          Delivery days
          <div className="admin-config__day-grid" role="group" aria-label="Delivery days">
            {weekdayOptions.map((day) => {
              const isActive = config.deliveryDays.includes(day.value);

              return (
                <button
                  aria-pressed={isActive}
                  className={`admin-config__day ${isActive ? 'is-active' : ''}`}
                  key={day.value}
                  onClick={() => toggleDeliveryDay(day.value)}
                  type="button"
                >
                  {day.label}
                </button>
              );
            })}
          </div>
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
      <label>
        Signup notification emails
        <input
          onChange={(event) =>
            setConfig((current) => ({
              ...current,
              signupNotificationEmails: event.target.value
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean)
            }))
          }
          value={config.signupNotificationEmails.join(', ')}
        />
      </label>
      <button className="primary" onClick={saveConfig} type="button">
        Save config
      </button>
      {message ? <p>{message}</p> : null}
    </div>
  );
}
