import { useEffect, useMemo, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import { Check, Copy } from 'lucide-react';
import { Button } from './Button';

export type CodeBlockLanguage = 'tsx' | 'typescript' | 'javascript' | 'jsx' | 'bash' | 'json' | 'markup';

export interface CodeBlockProps {
  code: string;
  language?: CodeBlockLanguage;
  copyLabel: string;
  copiedLabel: string;
  onCopy: (code: string) => Promise<boolean> | boolean;
}

export function CodeBlock({
  code,
  language = 'tsx',
  copyLabel,
  copiedLabel,
  onCopy,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const highlightedCode = useMemo(() => {
    const grammar = Prism.languages[language] ?? Prism.languages.tsx ?? Prism.languages.typescript;

    if (!grammar) {
      return code;
    }

    return Prism.highlight(code, grammar, language);
  }, [code, language]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    const didCopy = await onCopy(code);

    if (!didCopy) return;

    setCopied(true);

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = setTimeout(() => {
      setCopied(false);
      resetTimerRef.current = null;
    }, 1600);
  }

  return (
    <div className="vx-code-block-wrap" data-language={language}>
      <Button
        type="button"
        size="sm"
        variant={copied ? 'solid' : 'secondary'}
        className={copied ? 'vx-code-block__copy vx-code-block__copy--copied' : 'vx-code-block__copy'}
        onClick={() => void handleCopy()}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? copiedLabel : copyLabel}
      </Button>

      <pre className="vx-code-block">
        <code
          className={`vx-code-block__code language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}