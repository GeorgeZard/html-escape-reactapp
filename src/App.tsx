import { useState } from 'react';
import HtmlNewlineTool from './components/HtmlNewlineTool';
import CodeProcessor from './components/CodeProcessor';
import ThemeToggle from './components/ThemeToggle';


type Tool = 'html' | 'code';

function App() {
  const [activeTool, setActiveTool] = useState<Tool>('html');

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gradient-to-bl from-dark-lighter to-indigo-800 py-8 transition-colors">
      <ThemeToggle/>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex justify-center gap-4">
          <button
            onClick={() => setActiveTool('html')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTool === 'html'
               ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            HTML Newline Tool
          </button>
          <button
            onClick={() => setActiveTool('code')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTool === 'code' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Code Processor
          </button>
        </div>
        {activeTool === 'html' ? <HtmlNewlineTool /> : <CodeProcessor />}
      </div>
    </main>
  );
}

export default App;