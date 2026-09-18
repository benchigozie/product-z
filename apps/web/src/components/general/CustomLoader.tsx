type CustomLoaderProps = {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'light';
};

const loaderSizes = {
    sm: {
        dot: 'h-1.5 w-1.5',
        gap: 'gap-1.5',
    },
    md: {
        dot: 'h-2.25 w-2.25',
        gap: 'gap-2',
    },
    lg: {
        dot: 'h-3 w-3',
        gap: 'gap-2.5',
    },
};

const loaderColors = {
    primary: 'bg-primary',
    light: 'bg-white',
};

export function CustomLoader({
    size = 'md',
    color = 'primary',
}: CustomLoaderProps) {
    const { dot, gap } = loaderSizes[size];
    const colorClass = loaderColors[color];

    return (
        <div
            className={`flex items-center ${gap}`}
            aria-label="Loading"
            role="status"
        >
            <span
                className={`${dot} ${colorClass} rounded-full animate-loading-wave [animation-delay:0s]`}
            />
            <span
                className={`${dot} ${colorClass} rounded-full animate-loading-wave [animation-delay:0.15s]`}
            />
            <span
                className={`${dot} ${colorClass} rounded-full animate-loading-wave [animation-delay:0.3s]`}
            />
        </div>
    );
}