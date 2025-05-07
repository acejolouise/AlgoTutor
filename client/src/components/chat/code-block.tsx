import React, { useState, useEffect, useRef } from "react";
import { CodeBlock as CodeBlockType } from "../../types";
import { Check, Copy } from "lucide-react";

// Import Prism.js for syntax highlighting
import Prism from "prismjs";

// Import basic languages
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-kotlin";

// Import Okaidia theme styles with Tailwind CSS
const prismStyles = `
  .code-block {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    overflow-x: auto;
    background-color: #272822;
    color: #f8f8f2;
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
  }

  .code-block::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }

  .code-block::-webkit-scrollbar-track {
    background: #1e293b;
  }

  .code-block::-webkit-scrollbar-thumb {
    background: #475569;
    border-radius: 4px;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #8292a2;
  }

  .token.punctuation {
    color: #f8f8f2;
  }

  .token.namespace {
    opacity: 0.7;
  }

  .token.property,
  .token.tag,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #f92672;
  }

  .token.boolean,
  .token.number {
    color: #ae81ff;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #a6e22e;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string,
  .token.variable {
    color: #f8f8f2;
  }

  .token.atrule,
  .token.attr-value,
  .token.function,
  .token.class-name {
    color: #e6db74;
  }

  .token.keyword {
    color: #66d9ef;
  }

  .token.regex,
  .token.important {
    color: #fd971f;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }
`;

// Languages mapping for Prism
const languageMap: Record<string, string> = {
  javascript: "javascript",
  js: "javascript",
  typescript: "typescript",
  ts: "typescript",
  python: "python",
  py: "python",
  java: "java",
  cpp: "cpp",
  "c++": "cpp",
  csharp: "csharp",
  "c#": "csharp",
  go: "go",
  ruby: "ruby",
  swift: "swift",
  kotlin: "kotlin",
};

interface CodeBlockProps {
  codeBlock: CodeBlockType;
  onLanguageChange?: (language: string) => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ codeBlock, onLanguageChange }) => {
  const [language, setLanguage] = useState(codeBlock.language || "javascript");
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  // Function to map input language to Prism language
  const getPrismLanguage = (lang: string): string => {
    const lowerLang = lang.toLowerCase();
    return languageMap[lowerLang] || "javascript";
  };

  // Highlight code when component mounts or language/code changes
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [codeBlock.code, language]);

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(codeBlock.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  return (
    <div className="relative mt-4 mb-4 rounded-lg bg-gray-900 overflow-hidden">
      <style>{prismStyles}</style>
      
      {/* Code header with language selector and copy button */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-gray-200">
        <div className="text-sm font-medium">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="text-xs bg-gray-700 text-white rounded px-2 py-1 border-none focus:ring-2 focus:ring-primary"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
            <option value="go">Go</option>
            <option value="ruby">Ruby</option>
            <option value="swift">Swift</option>
            <option value="kotlin">Kotlin</option>
          </select>
        </div>
        <button
          onClick={copyCode}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-white rounded px-2 py-1 flex items-center transition-colors"
        >
          {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      
      {/* Code content */}
      <pre className="code-block m-0 p-4 overflow-x-auto">
        <code ref={codeRef} className={`language-${getPrismLanguage(language)}`}>
          {codeBlock.code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
