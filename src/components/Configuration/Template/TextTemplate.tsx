import  { useRef, useState, useCallback } from "react";
import styles from "../../../styles/TextTemplate.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TextTemplateProps {
  initialContent?: string;
  onContentChange?: (html: string) => void;
}

// ─── Toolbar config ───────────────────────────────────────────────────────────

const FONTS = ["Nunito", "Arial", "Times New Roman", "Georgia", "Courier New"];
// const FONT_SIZES = ["8", "9", "10", "11", "12", "13", "14", "16", "18", "20", "24", "28", "32"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TextTemplate({ initialContent = "", onContentChange }: TextTemplateProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [font, setFont] = useState("Nunito");
  const [fontSize, setFontSize] = useState("13");

  // ── execCommand wrapper ──
  const exec = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
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

  const applyHeading = (tag: string) => exec("formatBlock", tag);

  const applyFont = (f: string) => {
    setFont(f);
    exec("fontName", f);
  };

  const applyFontSize = (size: string) => {
    setFontSize(size);
    // execCommand fontSize only accepts 1-7, so use a workaround
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      document.execCommand("fontSize", false, "7");
      const fonts = editorRef.current?.querySelectorAll('font[size="7"]');
      fonts?.forEach((el) => {
        (el as HTMLElement).removeAttribute("size");
        (el as HTMLElement).style.fontSize = `${size}px`;
      });
    }
    onContentChange?.(editorRef.current?.innerHTML || "");
  };

  const isActive = (cmd: string) => activeFormats.has(cmd);

  const tb = (label: string, cmd: string, title?: string) => (
    <button
      key={cmd}
      title={title || label}
      className={`${styles.toolBtn} ${isActive(cmd) ? styles.toolBtnActive : ""}`}
      onMouseDown={(e) => { e.preventDefault(); exec(cmd); }}
    >
      {label}
    </button>
  );

  return (
    <div className={styles.root}>

      {/* ── Top bar ── */}
      <div className={styles.topBar}>

        {/* Load Template */}
        <div className={styles.loadSection}>
          <div>
            <span className={styles.loadLabel}>Load Template</span>
            <button className={styles.loadBtn}>Select Template</button>
          </div>
        </div>

        {/* Custom Options toolbar */}
        <div className={styles.toolbar}>
          <span className={styles.toolbarLabel}>Custom Options</span>

          {/* Heading shortcuts */}
          <div className={styles.toolGroup}>
            <button className={styles.toolBtn} title="Heading 1" onMouseDown={(e) => { e.preventDefault(); applyHeading("h1"); }}>H1</button>
            <button className={styles.toolBtn} title="Heading 2" onMouseDown={(e) => { e.preventDefault(); applyHeading("h2"); }}>H2</button>
            <button className={styles.toolBtn} title="Heading 3" onMouseDown={(e) => { e.preventDefault(); applyHeading("h3"); }}>H3</button>
            <button className={styles.toolBtn} title="Sub Heading 1" onMouseDown={(e) => { e.preventDefault(); applyHeading("h4"); }}>SH1</button>
            <button className={styles.toolBtn} title="Sub Heading 2" onMouseDown={(e) => { e.preventDefault(); applyHeading("h5"); }}>SH2</button>
            <button className={styles.toolBtn} title="Sub Heading 3" onMouseDown={(e) => { e.preventDefault(); applyHeading("h6"); }}>SH3</button>
            <button className={styles.toolBtn} title="Paragraph" onMouseDown={(e) => { e.preventDefault(); applyHeading("p"); }}>T</button>
          </div>

          <div className={styles.toolGroupDivider} />

          {/* Undo / Redo */}
          <div className={styles.toolGroup}>
            <button className={styles.toolBtn} title="Undo" onMouseDown={(e) => { e.preventDefault(); exec("undo"); }}>↩</button>
            <button className={styles.toolBtn} title="Redo" onMouseDown={(e) => { e.preventDefault(); exec("redo"); }}>↪</button>
          </div>

          <div className={styles.toolGroupDivider} />

          {/* Font family */}
          <select
            className={styles.toolSelect}
            value={font}
            onChange={(e) => applyFont(e.target.value)}
            style={{ width: 90 }}
          >
            {FONTS.map((f) => <option key={f}>{f}</option>)}
          </select>

          {/* Font size */}
          <div className={styles.toolGroup} style={{ gap: 2 }}>
            <button className={styles.toolBtn} title="Decrease font size" onMouseDown={(e) => { e.preventDefault(); applyFontSize(String(Math.max(8, parseInt(fontSize) - 1))); }}>−</button>
            <span style={{ fontSize: 12, minWidth: 20, textAlign: "center" }}>{fontSize}</span>
            <button className={styles.toolBtn} title="Increase font size" onMouseDown={(e) => { e.preventDefault(); applyFontSize(String(Math.min(72, parseInt(fontSize) + 1))); }}>+</button>
          </div>

          <div className={styles.toolGroupDivider} />

          {/* Text formatting */}
          <div className={styles.toolGroup}>
            {tb("B", "bold")}
            {tb("I", "italic")}
            {tb("U", "underline")}
            <button
              className={styles.toolBtn}
              title="Text color"
              onMouseDown={(e) => { e.preventDefault(); }}
              style={{ position: "relative" }}
            >
              <span>A</span>
              <span className={styles.colorDot} />
            </button>
          </div>

          <div className={styles.toolGroupDivider} />

          {/* Alignment */}
          <div className={styles.toolGroup}>
            <button className={styles.toolBtn} title="Align left"   onMouseDown={(e) => { e.preventDefault(); exec("justifyLeft"); }}>≡</button>
            <button className={styles.toolBtn} title="Align center" onMouseDown={(e) => { e.preventDefault(); exec("justifyCenter"); }}>≡</button>
            <button className={styles.toolBtn} title="Align right"  onMouseDown={(e) => { e.preventDefault(); exec("justifyRight"); }}>≡</button>
          </div>

          <div className={styles.toolGroupDivider} />

          {/* Lists */}
          <div className={styles.toolGroup}>
            <button className={styles.toolBtn} title="Bullet list"   onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }}>•≡</button>
            <button className={styles.toolBtn} title="Numbered list" onMouseDown={(e) => { e.preventDefault(); exec("insertOrderedList"); }}>1≡</button>
            <button className={styles.toolBtn} title="Indent"        onMouseDown={(e) => { e.preventDefault(); exec("indent"); }}>→≡</button>
            <button className={styles.toolBtn} title="Outdent"       onMouseDown={(e) => { e.preventDefault(); exec("outdent"); }}>←≡</button>
          </div>

          <div className={styles.toolGroupDivider} />

          {/* Quote / Strikethrough / Clear */}
          <div className={styles.toolGroup}>
            <button className={styles.toolBtn} title="Blockquote"    onMouseDown={(e) => { e.preventDefault(); exec("formatBlock", "blockquote"); }}>"</button>
            {tb("S̶", "strikeThrough")}
            <button className={styles.toolBtn} title="Clear format"  onMouseDown={(e) => { e.preventDefault(); exec("removeFormat"); }}>✕</button>
          </div>
        </div>
      </div>

      {/* ── Editor ── */}
      <div className={styles.editorWrap}>
        <div
          ref={editorRef}
          className={styles.editor}
          contentEditable
          suppressContentEditableWarning
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          onInput={() => onContentChange?.(editorRef.current?.innerHTML || "")}
          dangerouslySetInnerHTML={{ __html: initialContent }}
          style={{ fontFamily: font, fontSize: `${fontSize}px` }}
        />
      </div>

    </div>
  );
}