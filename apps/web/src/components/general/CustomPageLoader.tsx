import { CustomLoader } from "./CustomLoader"

function CustomPageLoader() {
    return (
        <div className="flex min-h-[60vh] w-full items-center justify-center bg-background">
            <CustomLoader />
        </div>
    )
}

export default CustomPageLoader