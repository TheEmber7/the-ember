import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TaskRowData {
  id: string;
  title: string;
  done: boolean;
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

  async function toggle() {
    setBusy(true);
    const { error } = await supabase.from("tasks").update({ done: !task.done }).eq("id", task.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    onChanged();
  }

  return (
    <div className="group flex items-center gap-4 rounded-lg border border-border/50 bg-card/40 p-4 transition-colors hover:border-ember/40">
      <button
        type="button"
        onClick={toggle}
        disabled={readOnly || busy}
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all",
          task.done
            ? "border-ember bg-ember text-primary-foreground"
            : "border-border/70 hover:border-ember",
        )}
        aria-pressed={task.done}
        aria-label={task.done ? "Mark incomplete" : "Mark complete"}
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : task.done ? (
          <Check className="h-4 w-4" />
        ) : null}
      </button>
      <p
        className={cn(
          "min-w-0 flex-1 truncate text-sm font-medium",
          task.done ? "text-muted-foreground line-through" : "text-foreground",
        )}
      >
        {task.title}
      </p>
    </div>
  );
}
