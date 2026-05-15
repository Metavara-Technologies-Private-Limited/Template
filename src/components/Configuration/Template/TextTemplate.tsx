import  { useRef, useState, useCallback, useEffect } from "react";
import styles from "../../../styles/TextTemplate.module.css";


// ─── Types ────────────────────────────────────────────────────────────────────

interface TextTemplateProps {
  initialContent?: string;
  onContentChange?: (html: string) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FONTS = ["Nunito", "Arial", "Montserrat", "Georgia", "Courier New"];

const DEFAULT_CONTENT = `<p><strong>RESULTS:</strong></p>
<p><strong>AZFa Region:</strong><br/>STS markers (SRY, SY84, SY86) were analyzed. No deletion detected.</p>
<p><strong>AZFb Region:</strong><br/>STS markers (SY127, SY134) were analyzed. No deletion detected.</p>
<p><strong>AZFc Region:</strong><br/>STS markers (SY254, SY255) were analyzed. Partial deletion observed.</p>
<p><strong>AZFd Region:</strong><br/>STS marker (SY157) analyzed. No deletion detected.</p>
<p><strong>INTERPRETATION:</strong></p>`;

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolbarBtn({
  title,
  active,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      className={`${styles.toolbarBtn} ${active ? styles.toolbarBtnActive : ""}`}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    >
      {children}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TextTemplate({ initialContent, onContentChange }: TextTemplateProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [font, setFont] = useState("Nunito");
  const [fontSize, setFontSize] = useState(13);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  // ── Set initial content via useEffect (NOT dangerouslySetInnerHTML) ──
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent || DEFAULT_CONTENT;
      // move cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  // only run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = useCallback((cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    updateActiveFormats();
    onContentChange?.(editorRef.current?.innerHTML || "");
  }, [onContentChange]);

  const updateActiveFormats = () => {
    const active = new Set<string>();
    if (document.queryCommandState("bold"))          active.add("bold");
    if (document.queryCommandState("italic"))        active.add("italic");
    if (document.queryCommandState("underline"))     active.add("underline");
    if (document.queryCommandState("strikeThrough")) active.add("strikeThrough");
    setActiveFormats(active);
  };

  const applyHeading = (tag: string) => {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, tag);
    onContentChange?.(editorRef.current?.innerHTML || "");
  };

  const applyFont = (f: string) => {
    setFont(f);
    editorRef.current?.focus();
    document.execCommand("fontName", false, f);
    onContentChange?.(editorRef.current?.innerHTML || "");
  };

  const applyFontSize = (size: number) => {
    setFontSize(size);
    editorRef.current?.focus();
    // Use a temp marker approach to apply pixel font size
    document.execCommand("fontSize", false, "7");
    const markers = editorRef.current?.querySelectorAll('font[size="7"]');
    markers?.forEach((el) => {
      (el as HTMLElement).removeAttribute("size");
      (el as HTMLElement).style.fontSize = `${size}px`;
    });
    onContentChange?.(editorRef.current?.innerHTML || "");
  };

  const isActive = (cmd: string) => activeFormats.has(cmd);

  // ── Handle Enter key — ensure cursor goes DOWN not up ──
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      editorRef.current?.focus();
      // Insert a new paragraph
      document.execCommand("insertParagraph", false);
      onContentChange?.(editorRef.current?.innerHTML || "");
    }
  };

  return (
    <div className={styles.root}>

      {/* ── Toolbar ── */}
      <div className={styles.toolbarWrapper}>

        {/* Load Template group */}
        <div className={styles.toolbarGroup}>
          <span className={styles.toolbarGroupLabel}>Load Template</span>
          <div className={styles.toolbarGroupBtns}>
            {["H1", "H2", "H3", "SH1", "SH2", "SH3", "T"].map((tag) => (
              <button
                key={tag}
                type="button"
                className={styles.loadBtn}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const tagMap: Record<string, string> = {
                    H1: "h1", H2: "h2", H3: "h3",
                    SH1: "h4", SH2: "h5", SH3: "h6",
                    T: "p",
                  };
                  applyHeading(tagMap[tag]);
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.toolbarSep} />

        {/* Custom Options group */}
        <div className={styles.toolbarGroup}>
          <span className={styles.toolbarGroupLabel}>Custom Options</span>
          <div className={styles.toolbarGroupBtns}>

            {/* Undo / Redo */}
            <ToolbarBtn title="Undo" onClick={() => exec("undo")}>↩</ToolbarBtn>
            <ToolbarBtn title="Redo" onClick={() => exec("redo")}>↪</ToolbarBtn>

            <div className={styles.toolbarDivider} />

            {/* Font family */}
            <select
              className={styles.toolbarSelect}
              value={font}
              onChange={(e) => applyFont(e.target.value)}
            >
              {FONTS.map((f) => <option key={f}>{f}</option>)}
            </select>

            {/* Font size */}
            <div className={styles.fontSizeControl}>
              <button
                type="button"
                className={styles.fontSizeBtn}
                onMouseDown={(e) => { e.preventDefault(); applyFontSize(Math.max(8, fontSize - 1)); }}
              >−</button>
              <span className={styles.fontSizeValue}>{fontSize}</span>
              <button
                type="button"
                className={styles.fontSizeBtn}
                onMouseDown={(e) => { e.preventDefault(); applyFontSize(Math.min(72, fontSize + 1)); }}
              >+</button>
            </div>

            <div className={styles.toolbarDivider} />

            {/* Bold / Italic / Underline / Color */}
            <ToolbarBtn title="Bold" active={isActive("bold")} onClick={() => exec("bold")}>
              <strong style={{ fontSize: "0.9em" }}>B</strong>
            </ToolbarBtn>
            <ToolbarBtn title="Italic" active={isActive("italic")} onClick={() => exec("italic")}>
              <em style={{ fontSize: "0.9em" }}>I</em>
            </ToolbarBtn>
            <ToolbarBtn title="Underline" active={isActive("underline")} onClick={() => exec("underline")}>
              <span style={{ textDecoration: "underline", fontSize: "0.9em" }}>U</span>
            </ToolbarBtn>

            <div className={styles.colorPickerWrap} title="Text Color">
              <span style={{ fontSize: "0.85em", fontWeight: 700 }}>A</span>
              <input
                type="color"
                className={styles.colorPicker}
                onChange={(e) => exec("foreColor", e.target.value)}
              />
            </div>

            <div className={styles.toolbarDivider} />

            {/* Alignment */}
            <ToolbarBtn title="Align Left"   onClick={() => exec("justifyLeft")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/>
                <line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
              </svg>
            </ToolbarBtn>
            <ToolbarBtn title="Align Center" onClick={() => exec("justifyCenter")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/>
                <line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/>
              </svg>
            </ToolbarBtn>
            <ToolbarBtn title="Align Right"  onClick={() => exec("justifyRight")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/>
                <line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>
              </svg>
            </ToolbarBtn>

            <div className={styles.toolbarDivider} />

            {/* Lists */}
            <ToolbarBtn title="Bullet List"   onClick={() => exec("insertUnorderedList")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/>
                <line x1="9" y1="18" x2="20" y2="18"/>
                <circle cx="4" cy="6" r="1" fill="currentColor"/>
                <circle cx="4" cy="12" r="1" fill="currentColor"/>
                <circle cx="4" cy="18" r="1" fill="currentColor"/>
              </svg>
            </ToolbarBtn>
            <ToolbarBtn title="Numbered List" onClick={() => exec("insertOrderedList")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/>
                <line x1="10" y1="18" x2="21" y2="18"/>
                <path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
              </svg>
            </ToolbarBtn>
            <ToolbarBtn title="Outdent" onClick={() => exec("outdent")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/>
                <line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/>
                <polyline points="7 8 3 12 7 16"/>
              </svg>
            </ToolbarBtn>
            <ToolbarBtn title="Indent" onClick={() => exec("indent")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/>
                <line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/>
                <polyline points="3 8 7 12 3 16"/>
              </svg>
            </ToolbarBtn>

            <div className={styles.toolbarDivider} />

            {/* Blockquote / Strikethrough / Clear */}
            <ToolbarBtn title="Blockquote" onClick={() => exec("formatBlock", "blockquote")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
              </svg>
            </ToolbarBtn>
            <ToolbarBtn title="Strikethrough" active={isActive("strikeThrough")} onClick={() => exec("strikeThrough")}>
              <span style={{ textDecoration: "line-through", fontSize: "0.9em" }}>S</span>
            </ToolbarBtn>
            <ToolbarBtn title="Clear Formatting" onClick={() => exec("removeFormat")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12"/>
              </svg>
            </ToolbarBtn>

          </div>
        </div>
      </div>

      {/* ── Editor ── */}
      <div
        ref={editorRef}
        className={styles.editor}
        contentEditable
        suppressContentEditableWarning
        dir="ltr"
        onKeyDown={handleKeyDown}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        onInput={() => onContentChange?.(editorRef.current?.innerHTML || "")}
      />

    </div>
  );
}