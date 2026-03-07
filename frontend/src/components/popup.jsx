const Popup = ({ header, children, cleaner, update, submit = 'Add',Cancel = 'Cancel' }) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const description = form.getAll('description');
        update(description, true);
    };

    const primaryButton = {
        'Add': 'bg-indigo-600 hover:bg-indigo-500',
        'Logout': 'bg-red-600 hover:bg-red-500',
    }

    return (
        <form role="dialog" aria-modal="true" onSubmit={handleSubmit} className="shadow-2xl fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-md z-50 flex items-center justify-center">
            <section className="bg-gray-200 min-w-[300px] lg:max-w-[800px] md:max-w-[600px] max-w-[400px] text-black dark:bg-black px-10 py-6 rounded-xl dark:text-white">
                <header className="flex justify-center items-center">
                    <h1 className="text-xl font-bold">{header}</h1>
                </header>
                <main className="py-4">
                    {children}
                </main>
                <footer className="flex justify-between">
                    <button type="button" onClick={() => cleaner(null)} className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-white cursor-pointer">{Cancel.trim()}</button>
                    <button type="submit" className={`${primaryButton[submit]} px-3 py-1 rounded-md text-white cursor-pointer`}>{submit}</button>
                </footer>
            </section>
        </form>
    );
}

export default Popup;