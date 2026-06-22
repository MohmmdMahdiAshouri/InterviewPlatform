import React from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import CodeEditorPanel from "./CodeEditorPanel";
import OutputPanel from "./OutputPanel";

interface CodePanelWorkspaceProps {
    rightPanelContent: React.ReactNode;
}

function CodePanelWorkspace({rightPanelContent} : CodePanelWorkspaceProps) {
    return (
        <Group orientation="horizontal">
            {/* right panel- problem desc */}
            <Panel defaultSize={40} minSize={30}>
                {rightPanelContent}
            </Panel>

            <Separator className="w-2 bg_gradient cursor-col-resize" />

            {/* left panel- code editor & output */}
            <Panel defaultSize={60} minSize={30}>
                <Group orientation="vertical">
                    {/* Top panel - Code editor */}
                    <Panel defaultSize={70} minSize={30}>
                        <CodeEditorPanel />
                    </Panel>

                    <Separator className="h-2 bg_gradient cursor-row-resize" />

                    {/* Bottom panel - Output Panel*/}
                    <Panel defaultSize={40} minSize={30}>
                        <OutputPanel />
                    </Panel>
                </Group>
            </Panel>
        </Group>
    );
}

export default CodePanelWorkspace;
