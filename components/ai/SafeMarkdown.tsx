"use client";

import React from "react";

interface SafeMarkdownProps {
  content: string;
}

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; lines: string[] }
  | { type: "ul"; items: string[] }
  | { type: "step"; num: string; title: string; body: Block[] }
  | { type: "code"; text: string }
  | { type: "hr" };

const BULLET = /^\s*[-*•]\s+(.*)$/;
const NUM = /^\s*(\d+)[.)]\s+(.*)$/;
const HEAD = /^\s*(#{1,6})\s+(.*)$/;
const HR = /^\s*([-*_])\1{2,}\s*$/;
const FENCE = /^\s*```/;
const INDENTED = /^\s{2,}\S/;

function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // Fenced code block
    if (FENCE.test(line)) {
      const codeLines: string[] = [];
      let j = i + 1;
      while (j < lines.length && !FENCE.test(lines[j])) {
        codeLines.push(lines[j]);
        j++;
      }
      blocks.push({ type: "code", text: codeLines.join("\n") });
      i = j + 1;
      continue;
    }

    if (HR.test(line)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    const h = line.match(HEAD);
    if (h) {
      blocks.push({ type: "heading", level: h[1].length, text: h[2].trim() });
      i++;
      continue;
    }

    const n = line.match(NUM);
    if (n) {
      const bodyLines: string[] = [];
      let j = i + 1;
      while (j < lines.length) {
        const l = lines[j];
        if (!l.trim()) {
          let k = j + 1;
          while (k < lines.length && !lines[k].trim()) k++;
          if (k < lines.length && INDENTED.test(lines[k])) {
            bodyLines.push("");
            j++;
            continue;
          }
          break;
        }
        const indented = INDENTED.test(l);
        if (!indented && (NUM.test(l) || HEAD.test(l) || HR.test(l) || FENCE.test(l))) break;
        bodyLines.push(l.replace(/^\s{1,4}/, ""));
        j++;
      }

      const text = n[2].trim();
      const m = text.match(/^\*\*(.+?)\*\*\s*[:\-–—]?\s*(.*)$/);
      let title = "";
      let body = bodyLines;
      if (m) {
        title = m[1].replace(/[:：]\s*$/, "").trim();
        body = m[2] ? [m[2], ...bodyLines] : bodyLines;
      } else {
        body = [text, ...bodyLines];
      }

      blocks.push({ type: "step", num: n[1], title, body: parseBlocks(body) });
      i = j;
      continue;
    }

    if (BULLET.test(line)) {
      const items: string[] = [];
      let j = i;
      while (j < lines.length) {
        const b = lines[j].match(BULLET);
        if (!b) break;
        items.push(b[1].trim());
        j++;
      }
      blocks.push({ type: "ul", items });
      i = j;
      continue;
    }

    const para: string[] = [];
    let j = i;
    while (j < lines.length) {
      const l = lines[j];
      if (
        !l.trim() ||
        HEAD.test(l) ||
        NUM.test(l) ||
        BULLET.test(l) ||
        HR.test(l) ||
        FENCE.test(l)
      )
        break;
      para.push(l.trim());
      j++;
    }
    if (para.length === 0) {
      para.push(line.trim());
      j = i + 1;
    }
    blocks.push({ type: "paragraph", lines: para });
    i = j;
  }

  return blocks;
}

function renderBlocks(blocks: Block[], nested = false): React.ReactNode {
  return blocks.map((block, idx) => {
    switch (block.type) {
      case "heading":
        if (block.level <= 2) {
          return (
            <h3 key={idx} className="pt-2 text-[14.5px] font-semibold tracking-tight text-[#171717]">
              {renderInline(block.text)}
            </h3>
          );
        }
        return (
          <h4 key={idx} className="pt-1.5 text-[13.5px] font-semibold text-[#171717]">
            {renderInline(block.text)}
          </h4>
        );

      case "paragraph":
        return (
          <p key={idx} className="text-[13px] leading-[1.65] text-[#262626]">
            {block.lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderInline(line)}
                {lIdx < block.lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );

      case "ul":
        return (
          <ul
            key={idx}
            className="list-disc space-y-1.5 pl-5 text-[13px] leading-[1.65] text-[#262626] marker:text-[#A3A3A3]"
          >
            {block.items.map((item, lIdx) => (
              <li key={lIdx} className="pl-1">
                {renderInline(item)}
              </li>
            ))}
          </ul>
        );

      case "step":
        return (
          <div key={idx} className="flex gap-2 text-[13px] leading-[1.65] text-[#262626]">
            <span className="shrink-0 font-semibold text-[#171717]">{block.num}.</span>
            <div className="min-w-0 flex-1 space-y-1.5">
              {block.title && (
                <div className="font-semibold text-[#171717]">{renderInline(block.title)}</div>
              )}
              {block.body.length > 0 && (
                <div className="space-y-1.5">{renderBlocks(block.body, true)}</div>
              )}
            </div>
          </div>
        );

      case "code":
        return (
          <pre
            key={idx}
            className="overflow-x-auto rounded-xl border border-[#E5E5E5] bg-[#F7F7F8] p-3.5 font-mono text-[11.5px] leading-relaxed text-[#171717]"
          >
            <code>{block.text}</code>
          </pre>
        );

      case "hr":
        return <hr key={idx} className="border-[#E5E5E5]" />;

      default:
        return null;
    }
  });
}

export function SafeMarkdown({ content }: SafeMarkdownProps) {
  if (!content) return null;

  const blocks = parseBlocks(content.replace(/\r\n/g, "\n").split("\n"));

  return <div className="space-y-3 break-words">{renderBlocks(blocks)}</div>;
}

/**
 * Parses inline formatting (**bold**, *italic*, `code`, [text](https://link))
 * without dangerous innerHTML.
 */
function renderInline(text: string): React.ReactNode {
  if (!text) return null;

  const tokens = text.split(
    /(\*\*[^*]+?\*\*|`[^`]+`|\*[^*\s][^*]*?\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g
  );

  return tokens.map((part, index) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-[#171717]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={index}
          className="rounded-md bg-[#F4F4F5] px-1.5 py-0.5 font-mono text-[11.5px] text-[#171717]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 3) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (link) {
      return (
        <a
          key={index}
          href={link[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#171717] underline decoration-[#A3A3A3] underline-offset-2 hover:decoration-[#171717]"
        >
          {link[1]}
        </a>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}