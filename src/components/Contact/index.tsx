import './index.scss';

import { useEffect, useRef, useState } from 'react';

import { apiRequest } from '../../services/api';

type ContactProps = {
  contactEmail: string;
  contactReason: string;
  sectionRef: (element: HTMLElement | null) => void;
};

const contactMethodValidationMessage = 'We need a way to get back to you, please add your email address or phone number';
const phoneValidationMessage = 'Please add a valid phone number';

function isValidPhoneNumber(phone: string) {
  const trimmedPhone = phone.trim();

  if (!trimmedPhone) {
    return false;
  }

  const digitCount = trimmedPhone.replace(/\D/g, '').length;

  return /^[+\d\s().-]+$/.test(trimmedPhone) && digitCount >= 10 && digitCount <= 15;
}

export default function Contact({ contactEmail, contactReason, sectionRef }: ContactProps) {
  const emailInput = useRef<HTMLInputElement | null>(null);
  const phoneInput = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    newsletter: false,
    contactReason
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm((current) => ({ ...current, contactReason }));
  }, [contactReason]);

  function clearContactMethodValidation() {
    emailInput.current?.setCustomValidity('');
    phoneInput.current?.setCustomValidity('');
  }

  function validateContactMethod() {
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (email) {
      clearContactMethodValidation();
      return true;
    }

    if (phone) {
      if (isValidPhoneNumber(phone)) {
        clearContactMethodValidation();
        return true;
      }

      phoneInput.current?.setCustomValidity(phoneValidationMessage);
      phoneInput.current?.reportValidity();
      return false;
    }

    emailInput.current?.setCustomValidity(contactMethodValidationMessage);
    emailInput.current?.reportValidity();
    return false;
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!validateContactMethod()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest('/api/contact', {
        method: 'POST',
        body: JSON.stringify(form)
      });

      setForm({
        name: '',
        email: '',
        phone: '',
        message: '',
        newsletter: false,
        contactReason
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
              <img alt="Chez Chrystelle family portrait" src="/contact/family.png" />
            </div>
            <p>For questions about orders, catering, or scheduling, send a note any time.</p>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </div>
          <form className="contact-section__form" onSubmit={submitForm}>
            <div className="field-grid">
              <label>
                Your name
                <input
                  id="contact-name"
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  onInvalid={(event) => event.currentTarget.setCustomValidity('Tell us who you are')}
                  onInput={(event) => event.currentTarget.setCustomValidity('')}
                  required
                  value={form.name}
                />
              </label>
              <label>
                Your email
                <input
                  onChange={(event) => {
                    setForm((current) => ({ ...current, email: event.target.value }));
                    clearContactMethodValidation();
                  }}
                  ref={emailInput}
                  type="email"
                  value={form.email}
                />
              </label>
              <label>
                Your phone
                <input
                  onChange={(event) => {
                    setForm((current) => ({ ...current, phone: event.target.value }));
                    clearContactMethodValidation();
                  }}
                  ref={phoneInput}
                  type="tel"
                  value={form.phone}
                />
              </label>
            </div>
            <input name="contactReason" type="hidden" value={form.contactReason} />
            <label>
              Message
              <textarea
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                onInvalid={(event) => event.currentTarget.setCustomValidity('What would you like to say')}
                onInput={(event) => event.currentTarget.setCustomValidity('')}
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
