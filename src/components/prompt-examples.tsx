import { promptExamples } from "@/data/prompt-examples";

interface PromptExamplesProps {
  onSelect: (value: string) => void;
}

export function PromptExamples({ onSelect }: PromptExamplesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {promptExamples.map((prompt) => (
        <button
          key={prompt}
          type="button"
          className="rounded-full border border-brand-100 bg-white px-4 py-2 text-left text-sm text-slate-700 transition hover:border-brand-300 hover:bg-brand-50"
          onClick={() => onSelect(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
