'use client';

import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { useAuth } from '@/context/AuthContext';
import { CustomLoader } from '@/components/general/CustomLoader';
import Image from 'next/image';
import { GoogleButton } from '@/components/auth/GoogleButton';

const loginSchema = Yup.object({
    email: Yup.string()
        .email('Enter a valid email address')
        .required('Email is required'),

    password: Yup.string()
        .required('Password is required'),
});

type LoginFormValues = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const { login } = useAuth();

    const initialValues: LoginFormValues = {
        email: '',
        password: '',
    };

    async function handleSubmit(
        values: LoginFormValues,
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
            await login(values);
            console.log('Login successful');
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
            <div className="mx-auto flex w-full max-w-md flex-col justify-center px-6 py-12 rounded-xl shadow-sm h-max gap-3">
                <div className="mb-8 text-center">
                    <div className='flex justify-center w-full'>
                        <Link
                            href="/"
                            className="mb-8 inline-block text-xl font-semibold tracking-tight text-primary-dark"
                        >

                            <Image src="/images/arya-logo.png" height={50} width={120} alt='logo' />
                        </Link>
                    </div>
                    <h1 className="text-lg md:text-2xl font-semibold tracking-tight text-primary-text">
                        Login to your account
                    </h1>

                    <p className="mt-2 text-secondary-text">
                        Sign in to continue to Product Z.
                    </p>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={loginSchema}
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
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-primary-text"
                                    >
                                        Password
                                    </label>

                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    className="w-full rounded-lg border border-outline-color bg-white px-4 py-3 text-primary-text outline-none transition placeholder:text-secondary-text focus:border-primary focus:ring-2 focus:ring-primary-soft"
                                />

                                <ErrorMessage
                                    name="password"
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
                                className="cursor-pointer w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 flex justify-center gap-2"
                            >
                                {
                                    isSubmitting && (
                                        <CustomLoader size='sm' color='light' />
                                    )
                                }
                                <span>                                
                                {isSubmitting ? 'Signing in' : 'Sign in'}
                                </span>
                            </button>
                        </Form>
                    )}
                </Formik>

                <GoogleButton />

                <p className="mt-6 text-center text-sm text-secondary-text">
                    Don't have an account?{' '}
                    <Link
                        href="/register"
                        className="font-medium text-primary hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </main>
    );
}

