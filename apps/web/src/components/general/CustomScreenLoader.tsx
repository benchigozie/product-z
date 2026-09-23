'use client';

import { CustomLoader } from './CustomLoader';

function CustomScreenLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-md ">
            <CustomLoader />
        </div>
    );
}

export default CustomScreenLoader;