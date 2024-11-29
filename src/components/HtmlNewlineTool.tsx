import { useState } from 'react';
import CopyToClipboardButton from './CopyToClipboardButton';
type ConversionMode = 'escape' | 'unescape';

interface ButtonProps {
  onClick: () => void;
  active: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;  // Optional prop for full-width buttons
}

const ConversionButton: React.FC<ButtonProps> = ({ 
  onClick, 
  active, 
  children,
  fullWidth = false 
}) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded transition-colors
      ${fullWidth ? 'w-full' : ''}
      ${active 
        ? 'bg-blue-500 text-white hover:bg-blue-600' 
        : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
      }
    `}
  >
    {children}
  </button>
);

export default function HtmlNewlineTool() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [mode, setMode] = useState<ConversionMode>('escape');

  const escapeNewlines = (text: string): string => {
    return text.replace(/\n/g, '\\n');
  };

  const unescapeNewlines = (text: string): string => {
    return text.replace(/\\n/g, '\n');
  };

  const handleConvert = (): void => {
    const result = mode === 'escape' ? escapeNewlines(input) : unescapeNewlines(input);
    setOutput(result);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        HTML Newline Converter
      </h1>

      <div className="flex gap-4 justify-center">
      <ConversionButton 
          onClick={() => setMode('escape')} 
          active={mode === 'escape'}
        >
          Add \n
        </ConversionButton>
        <ConversionButton 
          onClick={() => setMode('unescape')} 
          active={mode === 'unescape'}
        >
          Remove \n
        </ConversionButton>
      </div>
      
      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-48 p-4 border rounded focus:ring-2 focus:ring-blue-500 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                     border-gray-300 dark:border-gray-600"
          placeholder="Enter content..."
        />
        <button
          onClick={handleConvert}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2 text-center 
                    dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center justify-center"
        >
          Convert
        </button>
        
        <textarea
          value={output}
          readOnly
          className="w-full h-48 p-4 border rounded bg-gray-50 dark:bg-gray-800 
                     text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          placeholder="Converted output will appear here..."
        />
        <CopyToClipboardButton text={output} />
      </div>
    </div>
  );
}