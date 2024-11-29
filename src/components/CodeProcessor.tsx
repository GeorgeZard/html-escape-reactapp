import { useState } from 'react';
interface Change {
  type: 'remove' | 'insertafter' | 'replace';
  lines: string;
  text: string;
  first_original_line: string;
}

// interface ProcessResponse {
//   error?: string;
//   processed_code?: string;
//   formatted_code?: string;
//   changes_made?: number;
//   lines?: number;
// }

let lastCode = ''; // Store last formatted code

export default function CodeProcessor() {
  const [code, setCode] = useState('');
  const [changes, setChanges] = useState('');
  const [status, setStatus] = useState<{format: string, process: string}>({ format: '', process: '' });
  const [autoClearFormat, setAutoClearFormat] = useState(false);
  const [autoClearProcess, setAutoClearProcess] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  };

  const formatCode = async () => {
    const lines = code.split('\n');
    const maxLineNumWidth = lines.length.toString().length;
    const formattedCode = lines
      .map((line, i) => `${(i + 1).toString().padStart(maxLineNumWidth)}. ${line}`)
      .join('\n');
    
    lastCode = code; // Store original code
    const copied = await copyToClipboard(formattedCode);
    setStatus(prev => ({ 
      ...prev, 
      format: `Code ${copied ? 'formatted and copied to clipboard' : 'formatted'}: ${lines.length} lines.` 
    }));
    if (autoClearFormat) setCode('');
  };

  const sortChanges = (changes: Change[]) => {
    return changes.sort((a, b) => {
      const aStart = parseInt(a.lines.split('-')[0]);
      const bStart = parseInt(b.lines.split('-')[0]);
      return bStart - aStart; // Sort in reverse order
    });
  };

  const processChanges = async () => {
    if (!lastCode) {
      setStatus(prev => ({ ...prev, process: 'Error: No code to process. Please format code first.' }));
      return;
    }

    try {
      const changesObj: Change[] = JSON.parse(changes);
      const lines = lastCode.split('\n');
      const sortedChanges = sortChanges(changesObj);

      for (const change of sortedChanges) {
        const [start, end] = change.lines.includes('-') 
          ? change.lines.split('-').map(n => parseInt(n) - 1)
          : [parseInt(change.lines) - 1, parseInt(change.lines) - 1];

        // Verify first line matches
        const firstOriginalLine = lines[start].trim();
        if (change.first_original_line.trim() !== firstOriginalLine) {
          const context = lines
            .slice(Math.max(0, start-2), Math.min(lines.length, end+3))
            .map((line, i) => `${i + Math.max(0, start-2) + 1}: ${line}`)
            .join('\n');

          setStatus(prev => ({ 
            ...prev, 
            process: `Error: Original text mismatch at line ${start + 1}.\nExpected: '${change.first_original_line.trim()}'\nFound: '${firstOriginalLine}'\nContext:\n${context}` 
          }));
          return;
        }

        switch (change.type) {
          case 'remove':
            lines.splice(start, end - start + 1);
            break;
          case 'insertafter':
            lines.splice(start + 1, 0, change.text);
            break;
          case 'replace':
            lines.splice(start, end - start + 1, ...change.text.split('\n'));
            break;
        }
      }

      const processedCode = lines.join('\n');
      lastCode = processedCode; // Update stored code
      const copied = await copyToClipboard(processedCode);
      
      setStatus(prev => ({ 
        ...prev, 
        process: `Changes ${copied ? 'processed and copied to clipboard' : 'processed'}: ${sortedChanges.length} changes made.` 
      }));
      
      if (autoClearProcess) setChanges('');
    } catch (err) {
      setStatus(prev => ({ 
        ...prev, 
        process: `Error processing changes: ${err instanceof Error ? err.message : 'Invalid JSON'}` 
      }));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Code Processor</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Format Code</h2>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-48 p-4 border rounded focus:ring-2 focus:ring-blue-500 font-mono"
          placeholder="Paste your code here"
        />
        <div className="flex justify-between items-center">
          <button
            onClick={formatCode}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Format Code
          </button>
          <div className="flex items-center gap-2">
            <label>Auto Clear:</label>
            <input
              type="checkbox"
              checked={autoClearFormat}
              onChange={(e) => setAutoClearFormat(e.target.checked)}
              className="rounded"
            />
          </div>
        </div>
        {status.format && (
          <div className="p-4 bg-gray-100 rounded whitespace-pre-wrap font-mono">{status.format}</div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Process Changes</h2>
        <textarea
          value={changes}
          onChange={(e) => setChanges(e.target.value)}
          className="w-full h-48 p-4 border rounded focus:ring-2 focus:ring-blue-500 font-mono"
          placeholder="Paste your JSON changes here"
        />
        <div className="flex justify-between items-center">
          <button
            onClick={processChanges}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Process Changes
          </button>
          <div className="flex items-center gap-2">
            <label>Auto Clear:</label>
            <input
              type="checkbox"
              checked={autoClearProcess}
              onChange={(e) => setAutoClearProcess(e.target.checked)}
              className="rounded"
            />
          </div>
        </div>
        {status.process && (
          <div className="p-4 bg-gray-100 rounded whitespace-pre-wrap font-mono">{status.process}</div>
        )}
      </div>
    </div>
  );
}