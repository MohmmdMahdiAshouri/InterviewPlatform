"use client";
import Button from "@/src/components/Ui/Button";
import GapSelect from "@/src/components/Ui/Select";
import { Editor, Monaco } from "@monaco-editor/react";
import { Maximize, Minimize, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

function CodeEditorPanel() {
    const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
    const [lang, setLang] = useState("javascript");
    const editorWrapperRef = useRef<HTMLDivElement>(null);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            editorWrapperRef.current?.requestFullscreen();
            setIsCodeEditorOpen(true);
        } else {
            document.exitFullscreen();
            setIsCodeEditorOpen(false);
        }
    };

    const handleEditorWillMount = (monaco: Monaco) => {
        monaco.editor.defineTheme("custom-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "comment", foreground: "6272a4", fontStyle: "italic" },
                { token: "keyword", foreground: "ff79c6" },
                { token: "identifier", foreground: "50fa7b" },
            ],
            colors: {
                "editor.background": "#1e1e2e", // رنگ پس‌زمینه عمیق‌تر (Catppuccin Style)
                "editor.lineHighlightBackground": "#2e3440",
                "editorCursor.foreground": "#aeafad",
                "editor.selectionBackground": "#3e4451",
                "editorLineNumber.foreground": "#6272a4",
            },
        });
    };

    const LANGUAGES = [
        {
            label: "جاوا اسکریپت",
            value: "javascript",
            icon: "/Images/javascript.png",
        },
        { label: "پایتون", value: "python", icon: "/Images/python.png" },
        { label: "جاوا", value: "java", icon: "/Images/java.png" },
    ];

    return (
        <div ref={editorWrapperRef} className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                    <Image
                        src={`/Images/${lang}.png`}
                        alt="javascript"
                        className="size-6 object-contain rounded-sm"
                        width={30}
                        height={30}
                    />
                    <GapSelect
                        options={LANGUAGES}
                        value={lang}
                        onChange={(val) => setLang(val)}
                        width={200}
                    />
                </div>

                {!isCodeEditorOpen ? (
                    <Maximize 
                        onClick={toggleFullScreen} 
                        size={25}
                        className="cursor-pointer"
                    />
                ) : (
                    <Minimize
                        onClick={toggleFullScreen}
                        size={25}
                        className="text-white cursor-pointer"
                    />
                )}

                <Button size="sm" icon={<PlayIcon className="size-5" />}>
                    اجرای کد
                </Button>
            </div>

            <div className="flex-1 min-h-0" dir="ltr">
                <Editor
                    height="100%"
                    value={`const x = 1`}
                    onChange={(value) => ""}
                    theme="custom-dark"
                    defaultLanguage="typescript"
                    beforeMount={handleEditorWillMount}
                    options={{
                        fontSize: 20,
                        fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                        fontLigatures: true,
                        cursorSmoothCaretAnimation: "on",
                        lineNumbers: "on",
                        scrollBeyondLastLine: true,
                        glyphMargin: false,
                        folding: true,
                        bracketPairColorization: { enabled: true },
                        guides: { indentation: true },
                        wordWrap: "on",
                        wrappingStrategy: "advanced",
                        cursorBlinking: "expand",
                        lineNumbersMinChars: 3,
                        smoothScrolling: true,
                        contextmenu: true,
                        quickSuggestions: true,
                        suggestOnTriggerCharacters: true,
                        padding: { top: 10, bottom: 10 },
                        automaticLayout: true,
                        minimap: { enabled: false },
                        scrollPredominantAxis: false,
                    }}
                />
            </div>
        </div>
    );
}

export default CodeEditorPanel;
