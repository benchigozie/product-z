
'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useAuth } from '@/context/AuthContext';
import { ContentTransition } from '@/components/motion/ContenTransition';


export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [displayName, setDisplayName] = useState(
    user?.profile?.displayName ?? '',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = displayName.trim();

    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await updateProfile({
        displayName: trimmedName,
      });

      router.replace('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ContentTransition>
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-outline-color bg-white p-7 sm:p-9">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src="/images/arya-logo.png"
                width={120}
                height={40}
                alt="Arya"
                priority
              />
            </div>

            {/* Heading */}
            <div className="mt-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-primary-text">
                Welcome to Arya
              </h1>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-secondary-text">
                Let&apos;s get your profile set up before you continue.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="displayName"
                  className="mb-2 block text-sm font-semibold text-primary-text"
                >
                  What should we call you?
                </label>

                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={displayName}
                  onChange={(event) => {
                    setDisplayName(event.target.value);
                    setError('');
                  }}
                  placeholder="Enter your name"
                  autoComplete="name"
                  autoFocus
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl border border-outline-color bg-white px-4 text-sm text-primary-text outline-none transition-colors placeholder:text-secondary-text focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-xs leading-5 text-secondary-text">
                  This is how your name will appear across Arya.
                </p>
              </div>

              {error && (
                <p
                  className="text-sm text-red-400"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !displayName.trim()}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Continue'}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-xs leading-5 text-secondary-text">
              You can update your profile details later from your settings.
            </p>
          </div>
        </div>
      </main>
    </ContentTransition>
  );
}
