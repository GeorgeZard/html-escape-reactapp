import { useState } from 'react';

interface CopyToClipboardProps {
    text: string;
  }
  const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ text }) => {
    const [copied, setCopied] = useState(false);
  
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };
  
    return (
        <button
          onClick={copyToClipboard}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center justify-center"
        >
          <span className={copied ? 'hidden' : ''}>Copy</span>
          <span className={`${copied ? 'inline-flex' : 'hidden'} items-center`}>
            <svg className="w-3 h-3 text-white me-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
            </svg>
            Copied!
          </span>
        </button>
      );
  };
  
  export default CopyToClipboard;