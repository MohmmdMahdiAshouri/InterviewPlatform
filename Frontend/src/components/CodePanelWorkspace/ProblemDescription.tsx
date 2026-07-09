import GapSelect from "@/src/components/Ui/Select";

function ProblemDescription() {
    return (
        <div className="h-screen overflow-y-auto bg-base-200">
            {/* HEADER SECTION */}
            <div className="p-6 border-b border-base-300">
                <div className="flex items-center gap-x-2 mb-3">
                    <h1 className="text-3xl font-bold text_gradient">
                        برعکس کردن رشته
                    </h1>
                    <span className={`badge_hard`}>سخت</span>
                </div>
                <p className="font-light text-xl">دسته بندی: رشته ها</p>

                {/* Problem selector */}
                <div className="mt-4">
                    {/* <GapSelect 
                        options={LANGUAGES}
                        value={"java"}
                        width={'100%'}
                        // onChange={(val) => console.log(val)}
                    /> */}
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* PROBLEM DESC */}
                <div className="rounded-xl shadow-sm p-5 border">
                    <h2 className="text-xl font-bold text-base-content">
                        توضیحات
                    </h2>

                    <div className="space-y-3 text-base leading-relaxed">
                        <p className="font-light">توصیحات تمرین</p>
                    </div>
                </div>

                {/* EXAMPLES SECTION */}
                <div className="rounded-xl shadow-sm p-5 border">
                    <h2 className="text-xl font-bold mb-4 text-base-content">
                        مثال ها
                    </h2>
                    <div className="space-y-4">
                        {/* {problem.examples.map((example, idx) => ( */}
                        <div>
                            <p>مثال 1</p>
                            <div
                                dir="ltr"
                                className="rounded-lg p-4 text-md font-mono space-y-1.5 bg-[#1e1e2e] text-white"
                            >
                                <div className="flex gap-2">
                                    <span className="text-primary font-bold min-w-17.5">
                                        Input:
                                    </span>
                                    <span>{"{1, 2}"}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold min-w-17.5">
                                        Output:
                                    </span>
                                    <span>[1, 2]</span>
                                </div>
                                {/* {example.explanation && ( */}
                                <div className="pt-2 border-t-2 mt-2">
                                    <span className="text-md">
                                        <span>Explanation:</span> Explanation of
                                        this example
                                    </span>
                                </div>
                                {/* )} */}
                            </div>
                        </div>
                        {/* ))} */}
                    </div>
                </div>

                {/* CONSTRAINTS */}
                <div className="rounded-xl shadow-sm p-5 border">
                    <h2 className="text-xl font-bold mb-4 ">محدودیت ها</h2>
                    <ul className="space-y-2">
                        {/* {problem.constraints.map((constraint, idx) => ( */}
                        <li dir="ltr" className="flex gap-2">
                            <span>•</span>
                            <code>li</code>
                        </li>
                        {/* ))} */}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ProblemDescription;
