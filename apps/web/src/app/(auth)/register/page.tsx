'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { useAuth } from '@/context/AuthContext';
import { CustomLoader } from '@/components/general/CustomLoader';
import { CircleCheck } from 'lucide-react';

const registerSchema = Yup.object({
    email: Yup.string()
        .email('Enter a valid email address')
        .required('Email is required'),

    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
});

type RegisterFormValues = {
    email: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterPage() {
    const { register } = useAuth();
    const [registrationComplete, setRegistrationComplete] = useState(false);

    const initialValues: RegisterFormValues = {
        email: '',
        password: '',
        confirmPassword: '',
    };

    async function handleSubmit(
        values: RegisterFormValues,
        {
            setSubmitting,
            setStatus,
        }: {
            setSubmitting: (isSubmitting: boolean) => void;
            setStatus: (status?: { error?: string }) => void;
        },
    ) {
        setStatus(undefined);

        try {
            await register({
                email: values.email,
                password: values.password,
            });

            setRegistrationComplete(true);
        } catch (error) {
            setStatus({
                error:
                    error instanceof Error
                        ? error.message
                        : 'Something went wrong. Please try again.',
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen flex flex-col justify-center bg-background px-4 md:px-0">
            <div className="mx-auto flex w-full max-w-md flex-col justify-center rounded-xl px-6 py-12 shadow-sm h-max">

                <div className="mb-8 text-center">
                    <div className="flex justify-center w-full">
                        <Link
                            href="/"
                            className="mb-8 inline-block text-xl font-semibold tracking-tight text-primary-dark"
                        >
                            <Image
                                src="/images/arya-logo.png"
                                height={50}
                                width={120}
                                alt="logo"
                            />
                        </Link>
                    </div>

                    <h1 className="text-lg md:text-2xl font-semibold tracking-tight text-primary-text">
                        {registrationComplete
                            ? 'Account created successfully'
                            : 'Create your account'}
                    </h1>
                    {
                        !registrationComplete && (
                            <p className="mt-2 text-secondary-text">
                                Create an account to get started with Product Z.
                            </p>
                        )
                    }

                </div>

                {registrationComplete ? (
                    <div className="flex flex-col items-center text-center">

                        <div className="mb-6 flex items-center justify-center rounded-full bg-primary-soft">
                            <CircleCheck className="h-16 w-16 text-primary" />
                        </div>

                        <p className="text-sm leading-6 text-secondary-text">
                            We have sent a confirmation email to your inbox. Please check your email and follow the instructions to verify your account.
                        </p>

                        <Link
                            href="/login"
                            className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-center font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Continue to sign in
                        </Link>
                    </div>
                ) : (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={registerSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, status }) => (
                            <Form className="space-y-5" noValidate>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-primary-text"
                                    >
                                        Email
                                    </label>

                                    <Field
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        className="w-full rounded-lg border border-outline-color bg-white px-4 py-3 text-primary-text outline-none transition placeholder:text-secondary-text focus:border-primary focus:ring-2 focus:ring-primary-soft"
                                    />

                                    <ErrorMessage
                                        name="email"
                                        component="p"
                                        className="mt-1.5 text-sm text-red-400"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium text-primary-text"
                                    >
                                        Password
                                    </label>

                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Create a password"
                                        className="w-full rounded-lg border border-outline-color bg-white px-4 py-3 text-primary-text outline-none transition placeholder:text-secondary-text focus:border-primary focus:ring-2 focus:ring-primary-soft"
                                    />

                                    <ErrorMessage
                                        name="password"
                                        component="p"
                                        className="mt-1.5 text-sm text-red-400"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="mb-2 block text-sm font-medium text-primary-text"
                                    >
                                        Confirm password
                                    </label>

                                    <Field
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Confirm your password"
                                        className="w-full rounded-lg border border-outline-color bg-white px-4 py-3 text-primary-text outline-none transition placeholder:text-secondary-text focus:border-primary focus:ring-2 focus:ring-primary-soft"
                                    />

                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="p"
                                        className="mt-1.5 text-sm text-red-400"
                                    />
                                </div>

                                {status?.error && (
                                    <div
                                        role="alert"
                                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                                    >
                                        {status.error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting && (
                                        <CustomLoader
                                            size="sm"
                                            color="light"
                                        />
                                    )}

                                    <span>
                                        {isSubmitting
                                            ? 'Creating account'
                                            : 'Create account'}
                                    </span>
                                </button>
                            </Form>
                        )}
                    </Formik>
                )}

                {!registrationComplete && (
                    <p className="mt-6 text-center text-sm text-secondary-text">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                )}
            </div>
        </main>
    );
}