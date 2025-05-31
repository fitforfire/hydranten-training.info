
export function SplashMessage( {message} : {message: string}) {
    return (
        <div className="text-2xl p-4 justify-center items-center z-1000 flex text-white w-full h-full top-0 left-0 fixed bg-black/70">
            {message}
        </div>
    )
};