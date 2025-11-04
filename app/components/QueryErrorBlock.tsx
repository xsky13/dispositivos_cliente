export default function QueryErrorBlock({ message, fullWidth }: { message: string, fullWidth?: boolean }) {
    return (
        <>
            {
                fullWidth ?
                    <div className="w-full text-sm rounded-md px-5 py-4 border border-red-600 text-red-600 flex items-center gap-x-3 mt-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{message}</span>
                    </div>
                    :
                    <div className="container-width block m-auto py-10">
                        <div className="w-full text-sm rounded-md px-5 py-4 border border-red-600 text-red-600 flex items-center gap-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{message}</span>
                        </div>
                    </div>
            }
        </>
    )
}