import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TaskRowData {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  progress: number;
}

export function TaskRow({
  task,
  onChanged,
  readOnly,
}: {
  task: TaskRowData;
  onChanged: () => void;
  readOnly?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(task.progress);

  async function update(patch: Partial<TaskRowData>) {
    setBusy(true);
    const { error } = await supabase.from("tasks").update(patch).eq("id", task.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    onChanged();
  }

  async function toggleDone() {
    if (task.status === "done") {
      await update({ status: "todo", progress: 0 });
      setProgress(0);
    } else {
      await update({ status: "done", progress: 100 });
      setProgress(100);
    }
  }

  function onSlide(value: number) {
    setProgress(value);
    const status = value === 0 ? "todo" : value >= 100 ? "done" : "in_progress";
    update({ progress: value, status });
  }

  const done = task.status === "done";

  return (
    <div className="group flex items-center gap-4 rounded-lg border border-border/50 bg-card/40 p-4 transition-colors hover:border-ember/40">
      <button
        type="button"
        onClick={toggleDone}
        disabled={readOnly || busy}
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all",
          done
            ? "border-ember bg-ember text-primary-foreground"
            : "border-border/70 hover:border-ember",
        )}
        aria-label={done ? "Mark incomplete" : "Mark complete"}
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : done ? (
          <Check className="h-4 w-4" />
        ) : null}
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium",
            done ? "text-muted-foreground line-through" : "text-foreground",
          )}
        >
          {task.title}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <Progress value={progress} className="h-1.5 flex-1" />
          <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
            {progress}%
          </span>
        </div>
        {!readOnly && (
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            onMouseUp={(e) => onSlide(Number((e.target as HTMLInputElement).value))}
            onTouchEnd={(e) => onSlide(Number((e.target as HTMLInputElement).value))}
            className="mt-2 h-1 w-full cursor-pointer appearance-none rounded bg-transparent accent-ember"
            aria-label="Progress"
          />
        )}
      </div>
    </div>
  );
}
