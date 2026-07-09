import ProblemsHeader from "./components/problems-header";
import ProblemsList from "./components/Problems-list";
import ProblemsState from "./components/Problems-state";

function Problems() {
    return (
        <div>
            <div className="max-w-6xl mx-auto py-12">
                {/* HEADER */}
                <ProblemsHeader />

                {/* STATS FOOTER */}
                <ProblemsState />

                {/* PROBLEMS LIST */}
                <ProblemsList />
            </div>
        </div>
    );
}

export default Problems;
