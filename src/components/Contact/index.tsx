import './index.scss';

import { useState } from 'react';

import contactImage from '../../assets/images/contact.png';
import { apiRequest } from '../../services/api';

type ContactProps = {
  contactEmail: string;
  sectionRef: (element: HTMLElement | null) => void;
};

export default function Contact({ contactEmail, sectionRef }: ContactProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    newsletter: false
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      await apiRequest('/api/contact', {
        method: 'POST',
        body: JSON.stringify(form)
      });

      setForm({
        name: '',
        email: '',
        message: '',
        newsletter: false
      });
      setMessage('Thanks for reaching out. Your message has been sent.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Message failed to send');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page contact" id="contact" ref={sectionRef}>
      <h1 className="page_title">Contact</h1>
      <div className="page_body">
        <div className="contact-section">
          <div className="contact-section__aside">
            <div className="contact-section__image">
              <img alt="Chez Chrystelle family portrait" src={contactImage} />
            </div>
            <p>For questions about orders, catering, or scheduling, send a note any time.</p>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </div>
          <form className="contact-section__form" onSubmit={submitForm}>
            <div className="field-grid">
              <label>
                Your name
                <input
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  required
                  value={form.name}
                />
              </label>
              <label>
                Your email
                <input
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  required
                  type="email"
                  value={form.email}
                />
              </label>
            </div>
            <label>
              Message
              <textarea
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                required
                rows={6}
                value={form.message}
              />
            </label>
            <label className="contact-section__checkbox">
              <input
                checked={form.newsletter}
                onChange={(event) => setForm((current) => ({ ...current, newsletter: event.target.checked }))}
                type="checkbox"
              />
              Receive the occasional email update
            </label>
            <button className="primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Sending...' : 'Send message'}
            </button>
            {message ? <p className="contact-section__message">{message}</p> : null}
          </form>
        </div>
      </div>
    </div>
  );
}
