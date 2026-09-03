import { useState } from 'react';
import { Sparkles, RefreshCw, Check, Loader2, Wand2 } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useToast } from '../context/ToastContext';
import { aiService } from '../services/aiService';

type Target = 'summary' | 'experience' | 'project' | 'skills' | 'ats';

interface AIButtonProps {
  onApply: (text: string) => void;
  target: Target;
  input?: string;
  label?: string;
}

const options: { target: Target; label: string; desc: string }[] = [
  { target: 'summary', label: 'Improve Summary', desc: 'Rewrite your professional summary for impact.' },
  { target: 'experience', label: 'Improve Experience', desc: 'Strengthen your bullet points with results.' },
  { target: 'project', label: 'Improve Project', desc: 'Refine your project descriptions.' },
  { target: 'skills', label: 'Generate Skills', desc: 'Suggest relevant skills for your role.' },
  { target: 'ats', label: 'Make ATS Friendly', desc: 'Optimize content for ATS compatibility.' },
];

export function AIButton({ onApply, target: initialTarget, input = '', label }: AIButtonProps) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Target>(initialTarget);
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const run = async (t: Target = target) => {
    setLoading(true);
    setTarget(t);
    try {
      const res = await aiService.improve(t, input);
      setSuggestion(res);
    } catch {
      toast('AI request failed. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const apply = () => {
    onApply(suggestion);
    setOpen(false);
    setSuggestion('');
    toast('Suggestion applied', 'success');
  };

  return (
    <>
      <Button variant="accent" size="sm" onClick={() => { setOpen(true); }} className={label ? '' : 'gap-1.5'}>
        <Sparkles className="h-3.5 w-3.5" /> {label || 'Improve with AI'}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="AI Assistant" description="Let AI enhance your CV content." size="md">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-ink-soft">Choose an action</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {options.map((o) => (
                <button
                  key={o.target}
                  onClick={() => run(o.target)}
                  className={`flex items-start gap-2 rounded-xl border p-3 text-left transition ${
                    target === o.target ? 'border-accent bg-accent-soft' : 'border-line hover:bg-surface-subtle'
                  }`}
                >
                  <Wand2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <p className="text-sm font-semibold text-ink">{o.label}</p>
                    <p className="text-xs text-ink-muted">{o.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="flex items-center gap-2 rounded-xl bg-surface-subtle p-4 text-sm text-ink-muted">
              <Loader2 className="h-4 w-4 animate-spin text-accent" /> Generating suggestion…
            </div>
          )}

          {!loading && suggestion && (
            <div>
              <p className="mb-2 text-sm font-medium text-ink-soft">AI Suggestion</p>
              <div className="rounded-xl border border-line bg-surface-subtle/50 p-4">
                <p className="text-sm leading-relaxed text-ink-soft">{suggestion}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="accent" size="sm" onClick={apply}><Check className="h-3.5 w-3.5" /> Use Suggestion</Button>
                <Button variant="outline" size="sm" onClick={() => run()}><RefreshCw className="h-3.5 w-3.5" /> Regenerate</Button>
              </div>
            </div>
          )}

          {!loading && !suggestion && (
            <div className="rounded-xl border border-dashed border-line p-6 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-accent" />
              <p className="mt-2 text-sm text-ink-muted">Select an action above to generate an AI suggestion.</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
