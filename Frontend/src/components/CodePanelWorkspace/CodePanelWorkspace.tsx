"use client";
import React from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import CodeEditorPanel from "./CodeEditorPanel";
import OutputPanel from "./OutputPanel";

interface CodePanelWorkspaceProps {
    rightPanelContent: React.ReactNode;
    starterCode?: Record<string, string> | null;
    // Socket.io sync props (only used in interview room context)
    interviewId?: string;
    problemId?: string;
    emitCodeUpdate?: (problemId: string, code: string) => void;
    onCodeUpdate?: (callback: (data: { problemId: string; code: string; senderId: string }) => void) => () => void;
}

function CodePanelWorkspace({
    rightPanelContent,
    starterCode,
    interviewId,
    problemId,
    emitCodeUpdate,
    onCodeUpdate,
}: CodePanelWorkspaceProps) {
    const [remoteCode, setRemoteCode] = React.useState<string | null>(null);

    // Subscribe to remote code updates for the current problem
    React.useEffect(() => {
        if (!onCodeUpdate || !problemId) return;

        const unsubscribe = onCodeUpdate((data) => {
            if (data.problemId === problemId) {
                setRemoteCode(data.code);
            }
        });

        return unsubscribe;
    }, [onCodeUpdate, problemId]);

    // Reset remote code when problem changes
    React.useEffect(() => {
        setRemoteCode(null);
    }, [problemId]);

    const handleCodeChange = (code: string) => {
        if (emitCodeUpdate && problemId) {
            emitCodeUpdate(problemId, code);
        }
    };

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
                        <CodeEditorPanel
                            starterCode={starterCode}
                            onCodeChange={interviewId ? handleCodeChange : undefined}
                            remoteCode={interviewId ? remoteCode : null}
                        />
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
