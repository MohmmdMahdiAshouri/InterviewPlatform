"use client";
import CodePanelWorkspace from "@/src/components/CodePanelWorkspace/CodePanelWorkspace";
import ProblemDescription from "@/src/components/CodePanelWorkspace/ProblemDescription";
import type { Problem } from "@/src/types/problem.type";

interface PanelGroupProps {
    problem: Problem;
}

function PanelGroup({ problem }: PanelGroupProps) {
    return (
        <CodePanelWorkspace
            rightPanelContent={<ProblemDescription problem={problem} />}
            starterCode={problem.starterCode}
        />
    );
}

export default PanelGroup;
