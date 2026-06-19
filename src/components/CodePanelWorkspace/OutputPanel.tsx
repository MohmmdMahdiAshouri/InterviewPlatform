function OutputPanel() {
    return (
        <div className="h-full flex flex-col">
            <div className="px-4 py-2 border-b text-md font-bold">
                خروجی
            </div>
            <div className="flex-1 overflow-auto p-4">
                {true ? (
                    <p className="text-sm font-light">
                        اجرای کد رو بزن تا خروجی شو ببینی...
                    </p>
                ) : true ? (
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                        خروجی
                    </pre>
                ) : (
                    <div>
                        {true && (
                            <pre className="text-sm font-mono whitespace-pre-wrap mb-2">
                                خروجی
                            </pre>
                        )}
                        <pre className="text-sm font-mono text-error whitespace-pre-wrap">
                            ارور
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
export default OutputPanel;
