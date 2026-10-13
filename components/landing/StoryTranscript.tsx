import { story, speakerLabel } from "@/content/story";
import { Icon } from "./Icon";

/**
 * The written transcript, always available as a normal semantic block
 * (DESIGN.md §5.4, §8.3). The visual mockup is decorative; this is the copy
 * that screen readers and no-JS visitors get.
 */
export function StoryTranscript() {
  return (
    <details className="group mt-14 border-t border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[0.9375rem] font-semibold text-text transition-colors duration-150 ease-out-soft hover:text-primary">
        <span className="flex items-center gap-2.5">
          <Icon name="task" size={20} />
          {story.transcriptSummary}
        </span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-transform duration-200 ease-out-soft group-open:rotate-180">
          <Icon name="chevron" size={14} />
        </span>
      </summary>

      <div className="pb-2">
        <p className="text-label text-text-muted">{story.label}</p>

        <ol className="mt-6 flex flex-col gap-6">
          {story.stages.map((stage, index) => (
            <li key={stage.title} className="border-l-2 border-border pl-5">
              <h3 className="text-base font-semibold text-text">
                Tahap {index + 1}. {stage.title}
              </h3>
              <p className="mt-1 text-[0.9375rem] text-text-muted">
                {stage.body}
              </p>
              <dl className="mt-3 flex flex-col gap-1.5">
                {stage.messages.map((message, messageIndex) => (
                  <div
                    key={messageIndex}
                    className="flex flex-col gap-0.5 sm:flex-row sm:gap-2"
                  >
                    <dt className="shrink-0 text-[0.875rem] font-semibold text-primary sm:w-24">
                      {speakerLabel[message.from]}
                    </dt>
                    <dd className="text-[0.9375rem] text-text">
                      &ldquo;{message.text}&rdquo;
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}
