"use client";

import React from "react";
import Image from "next/image";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Lightbulb, 
  Quote,
  ArrowRight,
  Star
} from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Content section images mapping
const SECTION_IMAGES: Record<string, string> = {
  "why invest": "/corridor-east.png",
  "key areas": "/aerial-1.png",
  "document checklist": "/corridor-south.png",
  "step-by-step": "/corridor-west.png",
  "common mistakes": "/aerial-2.png",
  "what is hmda": "/corridor-east.png",
  "what is dtcp": "/corridor-south.png",
  "top growth": "/aerial-1.png",
  "price appreciation": "/corridor-west.png",
  "remote buying": "/aerial-2.png",
  "tax implications": "/corridor-south.png",
  "investment strategy": "/corridor-east.png",
};

function getImageForSection(heading: string): string | null {
  const lowerHeading = heading.toLowerCase();
  for (const [key, image] of Object.entries(SECTION_IMAGES)) {
    if (lowerHeading.includes(key)) {
      return image;
    }
  }
  return null;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const renderContent = () => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    let listType: "ul" | "ol" | null = null;
    let inTable = false;
    let tableRows: string[][] = [];
    let sectionCount = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        const ListTag = listType === "ol" ? "ol" : "ul";
        elements.push(
          <ListTag
            key={`list-${elements.length}`}
            className={`my-6 space-y-3 ${
              listType === "ol" 
                ? "list-decimal list-inside" 
                : "list-none"
            }`}
          >
            {currentList.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-gray-300 leading-relaxed"
              >
                {listType === "ul" && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-gold to-gold-light" />
                )}
                <span dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
              </li>
            ))}
          </ListTag>
        );
        currentList = [];
        listType = null;
      }
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        const [header, ...body] = tableRows;
        elements.push(
          <div key={`table-${elements.length}`} className="my-8 overflow-x-auto rounded-xl border border-gold/20">
            <table className="w-full text-sm">
              <thead className="bg-gold/10">
                <tr>
                  {header.map((cell, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left font-serif font-bold text-gold-light border-b border-gold/20"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.filter(row => !row.every(cell => cell.match(/^[-:]+$/))).map((row, i) => (
                  <tr key={i} className="border-b border-gold/10 last:border-0 hover:bg-white/5 transition-colors">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-gray-300">
                        <span dangerouslySetInnerHTML={{ __html: parseInline(cell) }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    const parseInline = (text: string): string => {
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em class="italic text-gold-light/90">$1</em>')
        .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-gold/10 text-gold-light font-mono text-sm">$1</code>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-gold hover:text-gold-light underline underline-offset-2 transition-colors">$1</a>');
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) {
        flushList();
        flushTable();
        continue;
      }

      // Tables
      if (trimmedLine.startsWith("|") && trimmedLine.endsWith("|")) {
        flushList();
        inTable = true;
        const cells = trimmedLine
          .split("|")
          .filter(Boolean)
          .map((c) => c.trim());
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        flushTable();
      }

      // Horizontal rule
      if (trimmedLine === "---") {
        flushList();
        elements.push(
          <hr key={`hr-${elements.length}`} className="my-10 border-t border-gold/30" />
        );
        continue;
      }

      // Headings
      if (trimmedLine.startsWith("#")) {
        flushList();
        const match = trimmedLine.match(/^(#{1,3})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2];
          const sectionImage = level === 2 ? getImageForSection(text) : null;
          sectionCount++;

          if (level === 1) {
            elements.push(
              <h1
                key={`h1-${elements.length}`}
                className="mt-4 mb-6 text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark leading-tight"
              >
                {text}
              </h1>
            );
          } else if (level === 2) {
            elements.push(
              <div key={`h2-section-${elements.length}`} className="mt-12 mb-6">
                {sectionImage && sectionCount % 3 === 0 && (
                  <div className="mb-6 overflow-hidden rounded-xl border border-gold/20">
                    <div className="relative h-48 w-full">
                      <Image
                        src={sectionImage}
                        alt={text}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  </div>
                )}
                <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-serif font-bold text-gold-light">
                  <span className="h-8 w-1 rounded-full bg-gradient-to-b from-gold to-gold-dark" />
                  {text}
                </h2>
              </div>
            );
          } else {
            elements.push(
              <h3
                key={`h3-${elements.length}`}
                className="mt-8 mb-4 text-xl font-serif font-semibold text-white flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4 text-gold" />
                {text}
              </h3>
            );
          }
        }
        continue;
      }

      // Lists
      if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        if (listType !== "ul") {
          flushList();
          listType = "ul";
        }
        currentList.push(trimmedLine.slice(2));
        continue;
      }

      if (/^\d+\.\s/.test(trimmedLine)) {
        if (listType !== "ol") {
          flushList();
          listType = "ol";
        }
        currentList.push(trimmedLine.replace(/^\d+\.\s/, ""));
        continue;
      }

      // Special callouts
      if (trimmedLine.startsWith("❌")) {
        flushList();
        elements.push(
          <div
            key={`callout-error-${elements.length}`}
            className="my-3 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4"
          >
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <span className="text-red-200" dangerouslySetInnerHTML={{ __html: parseInline(trimmedLine.slice(2)) }} />
          </div>
        );
        continue;
      }

      if (trimmedLine.startsWith("✅")) {
        flushList();
        elements.push(
          <div
            key={`callout-success-${elements.length}`}
            className="my-3 flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
            <span className="text-green-200" dangerouslySetInnerHTML={{ __html: parseInline(trimmedLine.slice(2)) }} />
          </div>
        );
        continue;
      }

      if (trimmedLine.startsWith("🚩")) {
        flushList();
        elements.push(
          <div
            key={`callout-warning-${elements.length}`}
            className="my-3 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <span className="text-amber-200" dangerouslySetInnerHTML={{ __html: parseInline(trimmedLine.slice(2)) }} />
          </div>
        );
        continue;
      }

      if (trimmedLine.startsWith("💡") || trimmedLine.startsWith("**Tip**:")) {
        flushList();
        const tipText = trimmedLine.startsWith("💡") ? trimmedLine.slice(2) : trimmedLine.replace("**Tip**:", "").trim();
        elements.push(
          <div
            key={`callout-tip-${elements.length}`}
            className="my-4 flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/10 p-4"
          >
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <span className="text-gold-light" dangerouslySetInnerHTML={{ __html: parseInline(tipText) }} />
          </div>
        );
        continue;
      }

      if (trimmedLine.startsWith("**Important**:")) {
        flushList();
        elements.push(
          <div
            key={`callout-important-${elements.length}`}
            className="my-4 flex items-start gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4"
          >
            <Star className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
            <span className="text-blue-200" dangerouslySetInnerHTML={{ __html: parseInline(trimmedLine.replace("**Important**:", "").trim()) }} />
          </div>
        );
        continue;
      }

      // Blockquotes
      if (trimmedLine.startsWith(">")) {
        flushList();
        elements.push(
          <blockquote
            key={`quote-${elements.length}`}
            className="my-6 flex gap-4 border-l-4 border-gold/50 bg-gold/5 py-4 pl-6 pr-4 rounded-r-lg"
          >
            <Quote className="h-6 w-6 shrink-0 text-gold/50" />
            <p className="italic text-gray-300" dangerouslySetInnerHTML={{ __html: parseInline(trimmedLine.slice(1).trim()) }} />
          </blockquote>
        );
        continue;
      }

      // Regular paragraphs
      flushList();
      if (trimmedLine) {
        elements.push(
          <p
            key={`p-${elements.length}`}
            className="my-4 text-gray-300 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: parseInline(trimmedLine) }}
          />
        );
      }
    }

    flushList();
    flushTable();

    return elements;
  };

  return (
    <div className={`blog-content ${className}`}>
      {renderContent()}
    </div>
  );
}

export default MarkdownRenderer;
