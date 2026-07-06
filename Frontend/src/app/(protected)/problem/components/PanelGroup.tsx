import CodePanelWorkspace from "@/src/components/CodePanelWorkspace/CodePanelWorkspace";
import ProblemDescription from "@/src/components/CodePanelWorkspace/ProblemDescription";

function PanelGroup() {
    return (
        <CodePanelWorkspace rightPanelContent={<ProblemDescription />}/>
    );
}

export default PanelGroup;
