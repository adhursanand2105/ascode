import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
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
  RotateCcw,
  Terminal,
  FileText,
  Folder,
  FolderOpen,
  Code,
  GitBranch,
  Package,
  Wrench,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Info
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
  language?: string;
  modified?: boolean;
}

interface AdvancedCodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  initialFile?: {
    name: string;
    path: string;
    content: string;
    language: string;
  };
}

// Mock Android project structure
const mockProjectStructure: FileNode[] = [
  {
    name: "app",
    path: "/app",
    type: "folder",
    children: [
      {
        name: "src",
        path: "/app/src",
        type: "folder",
        children: [
          {
            name: "main",
            path: "/app/src/main",
            type: "folder",
            children: [
              {
                name: "java",
                path: "/app/src/main/java",
                type: "folder",
                children: [
                  {
                    name: "com",
                    path: "/app/src/main/java/com",
                    type: "folder",
                    children: [
                      {
                        name: "example",
                        path: "/app/src/main/java/com/example",
                        type: "folder",
                        children: [
                          {
                            name: "myapp",
                            path: "/app/src/main/java/com/example/myapp",
                            type: "folder",
                            children: [
                              {
                                name: "MainActivity.java",
                                path: "/app/src/main/java/com/example/myapp/MainActivity.java",
                                type: "file",
                                language: "java",
                                content: `package com.example.myapp;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

public class MainActivity extends AppCompatActivity {
    private RecyclerView recyclerView;
    private TaskAdapter adapter;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        initializeViews();
        setupRecyclerView();
    }
    
    private void initializeViews() {
        recyclerView = findViewById(R.id.recyclerView);
    }
    
    private void setupRecyclerView() {
        adapter = new TaskAdapter(this);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);
    }
}`
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: "res",
                path: "/app/src/main/res",
                type: "folder",
                children: [
                  {
                    name: "layout",
                    path: "/app/src/main/res/layout",
                    type: "folder",
                    children: [
                      {
                        name: "activity_main.xml",
                        path: "/app/src/main/res/layout/activity_main.xml",
                        type: "file",
                        language: "xml",
                        content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="My Android App"
        android:textSize="24sp"
        android:textStyle="bold"
        android:layout_marginBottom="16dp" />

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/recyclerView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</LinearLayout>`
                      }
                    ]
                  },
                  {
                    name: "values",
                    path: "/app/src/main/res/values",
                    type: "folder",
                    children: [
                      {
                        name: "strings.xml",
                        path: "/app/src/main/res/values/strings.xml",
                        type: "file",
                        language: "xml",
                        content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">My Android App</string>
    <string name="hello_world">Hello World!</string>
</resources>`
                      }
                    ]
                  }
                ]
              },
              {
                name: "AndroidManifest.xml",
                path: "/app/src/main/AndroidManifest.xml",
                type: "file",
                language: "xml",
                content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapp">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
              }
            ]
          }
        ]
      },
      {
        name: "build.gradle",
        path: "/app/build.gradle",
        type: "file",
        language: "gradle",
        content: `plugins {
    id 'com.android.application'
}

android {
    compileSdkVersion 34
    buildToolsVersion "34.0.0"

    defaultConfig {
        applicationId "com.example.myapp"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'androidx.recyclerview:recyclerview:1.3.2'
    implementation 'com.google.android.material:material:1.11.0'
}`
      }
    ]
  },
  {
    name: "gradle",
    path: "/gradle",
    type: "folder",
    children: [
      {
        name: "wrapper",
        path: "/gradle/wrapper",
        type: "folder",
        children: [
          {
            name: "gradle-wrapper.properties",
            path: "/gradle/wrapper/gradle-wrapper.properties",
            type: "file",
            language: "properties",
            content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.0-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`
          }
        ]
      }
    ]
  },
  {
    name: "build.gradle",
    path: "/build.gradle",
    type: "file",
    language: "gradle",
    content: `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.0.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}`
  },
  {
    name: "settings.gradle",
    path: "/settings.gradle",
    type: "file",
    language: "gradle",
    content: `include ':app'
rootProject.name = "My Android App"`
  }
];

export default function AdvancedCodeEditor({ isOpen, onClose, projectId, initialFile }: AdvancedCodeEditorProps) {
  const [openTabs, setOpenTabs] = useState<FileNode[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["/app", "/app/src", "/app/src/main"]));
  const [searchTerm, setSearchTerm] = useState("");
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to AndroidIDE Terminal",
    "Type 'help' for available commands",
    ""
  ]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [buildOutput, setBuildOutput] = useState<string[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const { theme } = useTheme();
  
  const editorRef = useRef<any>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialFile) {
      const fileNode: FileNode = {
        name: initialFile.name,
        path: initialFile.path,
        type: "file",
        content: initialFile.content,
        language: initialFile.language
      };
      setOpenTabs([fileNode]);
      setActiveTab(initialFile.path);
    }
  }, [initialFile]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const openFile = (file: FileNode) => {
    if (file.type === "file") {
      const existingTab = openTabs.find(tab => tab.path === file.path);
      if (!existingTab) {
        setOpenTabs([...openTabs, file]);
      }
      setActiveTab(file.path);
    }
  };

  const closeTab = (path: string) => {
    const newTabs = openTabs.filter(tab => tab.path !== path);
    setOpenTabs(newTabs);
    if (activeTab === path) {
      setActiveTab(newTabs.length > 0 ? newTabs[0].path : "");
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeTab) {
      setOpenTabs(tabs => 
        tabs.map(tab => 
          tab.path === activeTab 
            ? { ...tab, content: value, modified: true }
            : tab
        )
      );
    }
  };

  const saveFile = () => {
    const activeFile = openTabs.find(tab => tab.path === activeTab);
    if (activeFile) {
      // In a real app, save to server
      console.log("Saving file:", activeFile.path);
      setOpenTabs(tabs => 
        tabs.map(tab => 
          tab.path === activeTab 
            ? { ...tab, modified: false }
            : tab
        )
      );
    }
  };

  const runGradleTask = (task: string) => {
    setIsBuilding(true);
    setBuildOutput([]);
    
    // Simulate gradle build output
    const gradleOutput = [
      `> Task :app:${task}`,
      `Starting Gradle build...`,
      `Configuring project :app`,
      `Building APK...`,
      `Compiling Java sources...`,
      `Processing resources...`,
      `Generating APK...`,
      `BUILD SUCCESSFUL in 2m 34s`,
      `Generated APK: app/build/outputs/apk/debug/app-debug.apk`
    ];

    let outputIndex = 0;
    const interval = setInterval(() => {
      if (outputIndex < gradleOutput.length) {
        setBuildOutput(prev => [...prev, gradleOutput[outputIndex]]);
        outputIndex++;
      } else {
        setIsBuilding(false);
        clearInterval(interval);
      }
    }, 500);
  };

  const executeCommand = (command: string) => {
    setTerminalOutput(prev => [...prev, `$ ${command}`]);
    
    // Handle built-in commands
    switch (command.toLowerCase()) {
      case 'help':
        setTerminalOutput(prev => [...prev, 
          "Available commands:",
          "  ls - List files",
          "  cd - Change directory",
          "  gradle build - Build Android project",
          "  gradle clean - Clean build artifacts",
          "  adb devices - List connected devices",
          "  clear - Clear terminal",
          ""
        ]);
        break;
      case 'ls':
        setTerminalOutput(prev => [...prev, 
          "app/", 
          "gradle/", 
          "build.gradle", 
          "settings.gradle",
          ""
        ]);
        break;
      case 'clear':
        setTerminalOutput([]);
        break;
      case 'gradle build':
        runGradleTask('build');
        break;
      case 'gradle clean':
        setTerminalOutput(prev => [...prev, "Cleaning build artifacts...", "BUILD SUCCESSFUL", ""]);
        break;
      case 'adb devices':
        setTerminalOutput(prev => [...prev, 
          "List of devices attached:",
          "emulator-5554   device",
          ""
        ]);
        break;
      default:
        setTerminalOutput(prev => [...prev, `Command not found: ${command}`, ""]);
    }
  };

  const renderFileTree = (nodes: FileNode[], level: number = 0) => {
    return nodes.map((node) => (
      <div key={node.path} className="select-none">
        <div 
          className={`flex items-center gap-2 p-1 rounded hover:bg-muted/50 cursor-pointer ${
            activeTab === node.path ? 'bg-muted' : ''
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node.path);
            } else {
              openFile(node);
            }
          }}
        >
          {node.type === "folder" ? (
            <>
              {expandedFolders.has(node.path) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              {expandedFolders.has(node.path) ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500" />
              )}
            </>
          ) : (
            <>
              <div className="w-4" />
              <FileText className="h-4 w-4 text-gray-500" />
            </>
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        {node.type === "folder" && expandedFolders.has(node.path) && node.children && (
          <div>
            {renderFileTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const activeFile = openTabs.find(tab => tab.path === activeTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Code className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">AndroidIDE - Advanced Editor</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={saveFile} disabled={!activeFile?.modified}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => runGradleTask('build')}>
            <Play className="h-4 w-4 mr-2" />
            Build
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowTerminal(!showTerminal)}>
            <Terminal className="h-4 w-4 mr-2" />
            Terminal
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* File Explorer */}
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="h-full flex flex-col border-r">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Explorer</span>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    className="pl-8 h-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {renderFileTree(mockProjectStructure)}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Editor Area */}
          <ResizablePanel defaultSize={60}>
            <div className="h-full flex flex-col">
              {/* Tab Bar */}
              {openTabs.length > 0 && (
                <div className="flex border-b bg-muted/20">
                  {openTabs.map((tab) => (
                    <div
                      key={tab.path}
                      className={`flex items-center gap-2 px-3 py-2 text-sm border-r cursor-pointer hover:bg-muted/50 ${
                        activeTab === tab.path ? 'bg-background' : ''
                      }`}
                      onClick={() => setActiveTab(tab.path)}
                    >
                      <FileText className="h-4 w-4" />
                      <span>{tab.name}</span>
                      {tab.modified && <div className="w-2 h-2 bg-primary rounded-full" />}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(tab.path);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Editor */}
              <div className="flex-1">
                {activeFile ? (
                  <Editor
                    height="100%"
                    language={activeFile.language}
                    value={activeFile.content}
                    onChange={handleEditorChange}
                    theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                    options={{
                      fontSize: 14,
                      minimap: { enabled: true },
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      folding: true,
                      bracketMatching: 'always',
                      autoIndent: 'full',
                      formatOnType: true,
                      formatOnPaste: true,
                      suggestOnTriggerCharacters: true,
                      acceptSuggestionOnEnter: 'on',
                      snippetSuggestions: 'inline',
                      quickSuggestions: true,
                      parameterHints: {
                        enabled: true
                      }
                    }}
                    onMount={(editor) => {
                      editorRef.current = editor;
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Code className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Welcome to AndroidIDE</p>
                      <p>Select a file from the explorer to start editing</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Build Output / Properties */}
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="h-full flex flex-col border-l">
              <Tabs defaultValue="build" className="h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="build">Build</TabsTrigger>
                  <TabsTrigger value="problems">Problems</TabsTrigger>
                  <TabsTrigger value="gradle">Gradle</TabsTrigger>
                </TabsList>
                
                <TabsContent value="build" className="flex-1 mt-0">
                  <div className="h-full flex flex-col">
                    <div className="p-3 border-b">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Build Output</span>
                        <Button variant="ghost" size="sm" onClick={() => setBuildOutput([])}>
                          Clear
                        </Button>
                      </div>
                    </div>
                    <ScrollArea className="flex-1">
                      <div className="p-3 font-mono text-xs">
                        {buildOutput.map((line, index) => (
                          <div key={index} className="mb-1">
                            {line}
                          </div>
                        ))}
                        {isBuilding && (
                          <div className="flex items-center gap-2 text-primary">
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent"></div>
                            Building...
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
                
                <TabsContent value="problems" className="flex-1 mt-0">
                  <div className="h-full flex flex-col">
                    <div className="p-3 border-b">
                      <span className="text-sm font-medium">Problems</span>
                    </div>
                    <div className="flex-1 p-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span>MainActivity.java:15 - Missing import statement</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Info className="h-4 w-4 text-blue-500" />
                          <span>build.gradle:5 - Consider updating Android SDK</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="gradle" className="flex-1 mt-0">
                  <div className="h-full flex flex-col">
                    <div className="p-3 border-b">
                      <span className="text-sm font-medium">Gradle Tasks</span>
                    </div>
                    <div className="flex-1 p-3">
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => runGradleTask('build')}
                        >
                          <Wrench className="h-4 w-4 mr-2" />
                          Build
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => runGradleTask('clean')}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Clean
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => runGradleTask('assembleDebug')}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Assemble Debug
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Terminal */}
      {showTerminal && (
        <div className="h-64 border-t">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-2 border-b bg-muted/20">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                <span className="text-sm font-medium">Terminal</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowTerminal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 bg-black text-green-400 font-mono text-sm overflow-hidden">
              <ScrollArea className="h-full">
                <div ref={terminalRef} className="p-3">
                  {terminalOutput.map((line, index) => (
                    <div key={index} className="mb-1">
                      {line}
                    </div>
                  ))}
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <Input
                      value={currentCommand}
                      onChange={(e) => setCurrentCommand(e.target.value)}
                      className="bg-transparent border-none text-green-400 font-mono focus:ring-0 focus:border-none p-0"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (currentCommand.trim()) {
                            executeCommand(currentCommand.trim());
                            setCurrentCommand("");
                          }
                        }
                      }}
                      placeholder="Enter command..."
                    />
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}