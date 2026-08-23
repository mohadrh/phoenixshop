import React from 'react';
import { Info } from 'lucide-react';
import type { Block } from '../../data/articles';

/**
 * رندر بدنه‌ی مقاله از بلوک‌های ساخت‌یافته.
 *
 * عمداً بدون dangerouslySetInnerHTML: وقتی متن از وردپرس بیاید،
 * محتوای دلخواه ادمین مستقیم به DOM تزریق نمی‌شود.
 */
export function ArticleBody({ blocks, accent }: { blocks: Block[]; accent: string }) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'h':
            return (
              <h2
                key={i}
                className="relative text-base sm:text-lg font-black text-white mt-4 pr-4"
              >
                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full"
                  style={{ background: accent }}
                  aria-hidden="true"
                />
                {b.text}
              </h2>
            );

          case 'ul':
            return (
              <ul key={i} className="flex flex-col gap-2.5 m-0 p-0 list-none">
                {b.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-zinc-300 leading-loose">
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: accent }}
                      aria-hidden="true"
                    />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            );

          case 'note':
            return (
              <aside
                key={i}
                className="flex items-start gap-3 p-4 rounded-2xl border text-sm leading-loose"
                style={{
                  background: `${accent}12`,
                  borderColor: `${accent}40`,
                  color: '#e4e4e7',
                }}
              >
                <Info className="w-4 h-4 shrink-0 mt-1" style={{ color: accent }} aria-hidden="true" />
                <span>{b.text}</span>
              </aside>
            );

          default:
            return (
              <p key={i} className="m-0 text-sm text-zinc-300 leading-loose">
                {b.text}
              </p>
            );
        }
      })}
    </div>
  );
}
