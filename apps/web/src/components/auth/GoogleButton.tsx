'use client';

export function GoogleButton() {
    function handleGoogleLogin() {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    }

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-outline-color bg-white px-4 py-3 font-medium text-primary-text transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
            <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden="true"
            >
                <path
                    fill="#4285F4"
                    d="M21.35 12.27c0-.79-.07-1.55-.23-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.39Z"
                />
                <path
                    fill="#34A853"
                    d="M12 21.5c2.63 0 4.84-.87 6.45-2.34l-3.14-2.43c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.29v2.51A9.74 9.74 0 0 0 12 21.5Z"
                />
                <path
                    fill="#FBBC05"
                    d="M6.54 13.63A5.86 5.86 0 0 1 6.23 12c0-.57.11-1.12.31-1.63V7.86H3.29A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.14l3.25-2.51Z"
                />
                <path
                    fill="#EA4335"
                    d="M12 6.34c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.38 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.36l3.25 2.51C7.31 8.06 9.46 6.34 12 6.34Z"
                />
            </svg>

            Continue with Google
        </button>
    );
}