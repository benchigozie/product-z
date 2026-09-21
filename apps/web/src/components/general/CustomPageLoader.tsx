import { CustomLoader } from "./CustomLoader"

function CustomPageLoader() {
    return (
            <div className="z-50 flex w-full items-start justify-center bg-background ">
                <CustomLoader />
            </div>
    )
}

export default CustomPageLoader