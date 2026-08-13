import { useState } from 'react';
import type { FormEvent } from 'react';
import type { SubmitStatus } from '@/types/lead';
import { submitLead } from '@/lib/api';
import { isValidEmail } from '@/lib/validation';

interface Options {
  /** Recorded alongside the lead so we know which block converted. */
  source: string;
}

/** Owns validation, submission and the status message for the email capture. */
export function useLeadForm({ source }: Options) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const response = await submitLead({ email: email.trim(), source });
      setStatus('success');
      setMessage(response.message);
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    }
  }

  function handleChange(value: string) {
    setEmail(value);
    if (status === 'error') {
      setStatus('idle');
      setMessage('');
    }
  }

  return { email, status, message, handleChange, handleSubmit } as const;
}
