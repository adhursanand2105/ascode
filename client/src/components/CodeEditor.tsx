import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  X, 
  Save, 
  Play, 
  Bug, 
  Settings, 
  Download,
  Upload,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";

interface CodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  file?: {
    name: string;
    path: string;
    content: string;
    language: string;
  };
}

export default function CodeEditor({ isOpen, onClose, file }: CodeEditorProps) {
  const [code, setCode] = useState(file?.content || "");
  const [fontSize, setFontSize] = useState(14);
  const [activeTab, setActiveTab] = useState("editor");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (file) {
      setCode(file.content);
    }
  }, [file]);

  const handleSave = () => {
    // Implement save functionality
    console.log("Saving file:", file?.path, code);
  };

  const handleRun = () => {
    // Implement run functionality
    console.log("Running code");
  };

  const handleAnalyze = () => {
    // Implement AI analysis functionality
    console.log("Analyzing code with AI");
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10));
  };

  const resetFontSize = () => {
    setFontSize(14);
  };

  if (!isOpen) return null;

  // Mock syntax highlighting (in a real app, you'd use a proper syntax highlighting library)
  const renderSyntaxHighlighted = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => (
      <div key={index} className="flex">
        <span className="text-gray-500 text-sm mr-4 w-8 text-right select-none">
          {index + 1}
        </span>
        <span className="text-gray-300 font-mono">{line || '\u00A0'}</span>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-charcoal-900 border-charcoal-600 shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <CardHeader className="border-b border-charcoal-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-lg font-bold text-gray-100">
                {file?.name || "Untitled"}
              </CardTitle>
              <Badge className="bg-blue-500 text-white text-xs">
                {file?.language || "text"}
              </Badge>
              <Badge className="bg-green-500 text-white text-xs">
                Modified
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={decreaseFontSize}
                className="text-gray-400 hover:text-gray-100"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFontSize}
                className="text-gray-400 hover:text-gray-100"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={increaseFontSize}
                className="text-gray-400 hover:text-gray-100"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-100"
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-100"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Toolbar */}
        <div className="border-b border-charcoal-600 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRun}
                className="border-charcoal-600 text-gray-300 hover:bg-charcoal-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Run
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAnalyze}
                className="border-charcoal-600 text-gray-300 hover:bg-charcoal-700"
              >
                <Bug className="w-4 h-4 mr-2" />
                Analyze
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-gray-100"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-gray-100"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="border-b border-charcoal-600">
            <TabsList className="bg-transparent">
              <TabsTrigger value="editor" className="data-[state=active]:bg-charcoal-700">
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-charcoal-700">
                Preview
              </TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-charcoal-700">
                AI Analysis
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="editor" className="h-96 overflow-y-auto p-0 m-0">
            <div className="relative h-full">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="absolute inset-0 w-full h-full p-4 bg-charcoal-900 text-gray-300 font-mono resize-none border-none outline-none leading-relaxed"
                style={{ fontSize: `${fontSize}px` }}
                placeholder="Start typing your code..."
                spellCheck={false}
              />
              <div 
                className="absolute inset-0 p-4 pointer-events-none overflow-y-auto leading-relaxed"
                style={{ fontSize: `${fontSize}px` }}
              >
                {code ? renderSyntaxHighlighted(code) : null}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="h-96 overflow-y-auto p-4">
            <div className="bg-charcoal-800 rounded-lg p-4 h-full">
              <h3 className="text-gray-100 font-semibold mb-4">Code Preview</h3>
              <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
                {code || "No code to preview"}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="h-96 overflow-y-auto p-4">
            <div className="space-y-4">
              <div className="bg-charcoal-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-gold-500 to-gold-400 rounded-full flex items-center justify-center">
                    <span className="text-xs text-charcoal-900 font-bold">AI</span>
                  </div>
                  <h3 className="text-gray-100 font-semibold">Code Quality Analysis</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Quality Score</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-charcoal-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                      <span className="text-green-400 font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Maintainability</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-charcoal-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }} />
                      </div>
                      <span className="text-yellow-400 font-medium">70%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Performance</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-charcoal-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }} />
                      </div>
                      <span className="text-blue-400 font-medium">90%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-charcoal-800 rounded-lg p-4">
                <h3 className="text-gray-100 font-semibold mb-3">Suggestions</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-300">
                    • Consider adding null safety checks
                  </div>
                  <div className="text-sm text-gray-300">
                    • Optimize loop performance in main function
                  </div>
                  <div className="text-sm text-gray-300">
                    • Add error handling for edge cases
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Status Bar */}
        <div className="border-t border-charcoal-600 p-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Line 1, Column 1</span>
              <span>{file?.language || "Plain Text"}</span>
              <span>UTF-8</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Font Size: {fontSize}px</span>
              <span>{code.length} characters</span>
              <span>{code.split('\n').length} lines</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
