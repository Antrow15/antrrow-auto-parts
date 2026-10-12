import {
  submitEnquiry,
  mailtoLink,
  whatsappLink,
  type EnquiryField,
  type EnquiryKind,
  type EnquiryPayload,
} from '@/lib/submit-enquiry';

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{10,18}$/;
const MIN_FILL_MS = 2500;

function labelFor(control: Control): string {
  return control.dataset['label'] ?? control.name;
}

function errorEl(form: HTMLFormElement, name: string) {
  return form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
}

function setError(form: HTMLFormElement, control: Control, message: string | null) {
  const el = errorEl(form, control.name);
  if (message) {
    control.setAttribute('aria-invalid', 'true');
    if (el) {
      el.textContent = message;
      el.hidden = false;
    }
  } else {
    control.removeAttribute('aria-invalid');
    if (el) {
      el.textContent = '';
      el.hidden = true;
    }
  }
}

function validateControl(control: Control): string | null {
  if (control instanceof HTMLInputElement && control.type === 'checkbox') {
    return control.required && !control.checked ? 'Please confirm to continue.' : null;
  }
  const value = control.value.trim();
  if (control.required && !value) return `Please enter ${labelFor(control).toLowerCase()}.`;
  if (!value) return null;
  if (control.type === 'email' && !EMAIL_RE.test(value)) return 'Please enter a valid email address.';
  if (control.type === 'tel' && !PHONE_RE.test(value)) return 'Please enter a valid phone number.';
  const min = Number(control.getAttribute('minlength') ?? 0);
  if (min && value.length < min) return `Please add a little more detail (at least ${min} characters).`;
  return null;
}

function controlsOf(form: HTMLFormElement): Control[] {
  return Array.from(form.querySelectorAll<Control>('input[name], textarea[name], select[name]')).filter(
    (c) => !c.closest('[data-honeypot]'),
  );
}

function validateForm(form: HTMLFormElement): Control[] {
  const invalid: Control[] = [];
  for (const control of controlsOf(form)) {
    const message = validateControl(control);
    setError(form, control, message);
    if (message) invalid.push(control);
  }

  const email = form.querySelector<HTMLInputElement>('input[name="email"]');
  const phone = form.querySelector<HTMLInputElement>('input[name="phone"]');
  if (email && phone && !email.value.trim() && !phone.value.trim()) {
    const message = 'Please provide an email address or a phone number.';
    setError(form, email, message);
    setError(form, phone, message);
    invalid.push(email);
  }
  return invalid;
}

function collect(form: HTMLFormElement): EnquiryField[] {
  return controlsOf(form)
    .filter((c) => !(c instanceof HTMLInputElement && c.type === 'checkbox'))
    .map((c) => ({ name: c.name, label: labelFor(c), value: c.value }));
}

function init(form: HTMLFormElement) {
  const startedAt = Date.now();
  const kind = (form.dataset['kind'] as EnquiryKind | undefined) ?? 'enquiry';
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const wrapper = form.closest<HTMLElement>('[data-form-wrapper]');
  const success = wrapper?.querySelector<HTMLElement>('[data-form-success]');

  form.noValidate = true;

  form.addEventListener('focusout', (event) => {
    const target = event.target as Control;
    if (target.name && target.getAttribute('aria-invalid') === 'true') {
      setError(form, target, validateControl(target));
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (status) status.textContent = '';

    const honeypot = form.querySelector<HTMLInputElement>('[data-honeypot] input');
    if (honeypot?.value || Date.now() - startedAt < MIN_FILL_MS) {
      if (status) status.textContent = 'Please wait a moment and try again.';
      return;
    }

    const invalid = validateForm(form);
    if (invalid.length > 0) {
      invalid[0]?.focus();
      if (status) status.textContent = `Please fix ${invalid.length} highlighted field${invalid.length > 1 ? 's' : ''}.`;
      return;
    }

    const payload: EnquiryPayload = { kind, fields: collect(form), page: window.location.href };
    submit?.setAttribute('disabled', '');

    try {
      const result = await submitEnquiry(payload);
      if (!result.ok) throw new Error(result.error ?? 'Submission failed');

      if (success) {
        success.querySelector<HTMLAnchorElement>('[data-send-email]')?.setAttribute('href', mailtoLink(payload));
        success.querySelector<HTMLAnchorElement>('[data-send-whatsapp]')?.setAttribute('href', whatsappLink(payload));
        success.querySelector<HTMLElement>('[data-state="delivered"]')?.toggleAttribute('hidden', !result.delivered);
        success.querySelector<HTMLElement>('[data-state="pending"]')?.toggleAttribute('hidden', result.delivered);
        form.hidden = true;
        success.hidden = false;
        success.focus();
      }
    } catch {
      if (status) {
        status.textContent = 'Something went wrong. Please call or email us directly.';
      }
    } finally {
      submit?.removeAttribute('disabled');
    }
  });

  wrapper?.querySelector<HTMLButtonElement>('[data-form-reset]')?.addEventListener('click', () => {
    form.reset();
    form.hidden = false;
    if (success) success.hidden = true;
    form.querySelector<Control>('input, textarea, select')?.focus();
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-enquiry-form]').forEach(init);
