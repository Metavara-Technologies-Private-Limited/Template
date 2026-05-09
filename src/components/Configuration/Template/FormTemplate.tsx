import React, { useState } from "react";
import styles from "../../../styles/FormTemplate.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldType = "text" | "date" | "boolean" | "decimal" | "time" | "dropdown" | "upload";
type LayoutType = "heading" | "divider" | "1col" | "2col" | "3col";

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  mandatory: boolean;
  multiLine?: boolean;
  options?: string[];
}

interface FormSection {
  id: string;
  layout: LayoutType;
  headingText?: string;
  subText?: string;
  columns: FormField[][];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

const colCount = (layout: LayoutType) => {
  if (layout === "1col") return 1;
  if (layout === "2col") return 2;
  if (layout === "3col") return 3;
  return 0;
};

const defaultField = (type: FieldType): FormField => ({
  id: uid(),
  type,
  label:
    type === "text" ? "Text" :
    type === "date" ? "Date" :
    type === "boolean" ? "Boolean" :
    type === "decimal" ? "Decimal" :
    type === "time" ? "Time" :
    type === "dropdown" ? "Dropdown" : "Upload File",
  mandatory: false,
  multiLine: false,
  options: type === "dropdown" ? ["Option 1", "Option 2"] : undefined,
});

// ─── Sidebar config ───────────────────────────────────────────────────────────

const LAYOUT_ELEMENTS: { label: string; type: LayoutType; icon: string }[] = [
  { label: "Heading",  type: "heading", icon: "H"   },
  { label: "Divider",  type: "divider", icon: "—"   },
  { label: "1 Column", type: "1col",    icon: "▬"   },
  { label: "2 Column", type: "2col",    icon: "▬▬"  },
  { label: "3 Column", type: "3col",    icon: "▬▬▬" },
];

const FORM_ELEMENTS: { label: string; type: FieldType; icon: string }[] = [
  { label: "Text",        type: "text",     icon: "T"   },
  { label: "Date",        type: "date",     icon: "📅"  },
  { label: "Boolean",     type: "boolean",  icon: "☑"   },
  { label: "Decimal",     type: "decimal",  icon: "0.0" },
  { label: "Time",        type: "time",     icon: "⏱"  },
  { label: "Dropdown",    type: "dropdown", icon: "▾"   },
  { label: "Upload File", type: "upload",   icon: "📎"  },
];

// ─── Field Preview ────────────────────────────────────────────────────────────

function FieldPreview({ field }: { field: FormField }) {
  const label = (
    <label className={styles.fieldLabel}>
      {field.label}
      {field.mandatory && <span className={styles.required}> *</span>}
    </label>
  );

  if (field.type === "text") return (
    <div className={styles.fieldWrap}>
      {label}
      {field.multiLine
        ? <textarea className={styles.input} style={{ height: 56, resize: "vertical" }} placeholder="Enter Here" readOnly />
        : <input className={styles.input} placeholder="Enter Here" readOnly />}
    </div>
  );

  if (field.type === "date") return (
    <div className={styles.fieldWrap}>
      {label}
      <div className={styles.dateWrap}>
        <input className={styles.input} placeholder="Select Date" readOnly />
        <span className={styles.calIcon}>📅</span>
      </div>
    </div>
  );

  if (field.type === "boolean") return (
    <div className={styles.fieldWrap} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <input type="checkbox" readOnly />
      <label className={styles.fieldLabel}>
        {field.label}{field.mandatory && <span className={styles.required}> *</span>}
      </label>
    </div>
  );

  if (field.type === "decimal") return (
    <div className={styles.fieldWrap}>
      {label}
      <input className={styles.input} type="number" placeholder="0.00" readOnly />
    </div>
  );

  if (field.type === "time") return (
    <div className={styles.fieldWrap}>
      {label}
      <input className={styles.input} type="time" readOnly />
    </div>
  );

  if (field.type === "dropdown") return (
    <div className={styles.fieldWrap}>
      {label}
      <select className={styles.input}>
        <option>Select</option>
        {field.options?.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  if (field.type === "upload") return (
    <div className={styles.fieldWrap}>
      {label}
      <div className={styles.uploadBox}>📎 Click to upload</div>
    </div>
  );

  return null;
}

// ─── Properties Panel ─────────────────────────────────────────────────────────

interface SelectedTarget {
  type: "field" | "heading" | "divider";
  sectionId: string;
  colIdx?: number;
  fieldIdx?: number;
}

function PropertiesPanel({
  target, sections, onUpdate, onDelete, onClose,
}: {
  target: SelectedTarget;
  sections: FormSection[];
  onUpdate: (s: FormSection[]) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const section = sections.find((s) => s.id === target.sectionId)!;

  if (target.type === "heading") return (
    <div className={styles.propPanel}>
      <div className={styles.propHeader}>
        <span className={styles.propTitle}>Heading</span>
        <button className={styles.propClose} onClick={onClose}>✕</button>
      </div>
      <label className={styles.propLabel}>Heading</label>
      <input className={styles.propInput} value={section.headingText || ""}
        onChange={(e) => onUpdate(sections.map((s) =>
          s.id === target.sectionId ? { ...s, headingText: e.target.value } : s))} />
      <label className={styles.propLabel}>Sub Text</label>
      <input className={styles.propInput} placeholder="Type Here" value={section.subText || ""}
        onChange={(e) => onUpdate(sections.map((s) =>
          s.id === target.sectionId ? { ...s, subText: e.target.value } : s))} />
      <button className={styles.propDelete} onClick={onDelete}>Delete</button>
    </div>
  );

  if (target.type === "divider") return (
    <div className={styles.propPanel}>
      <div className={styles.propHeader}>
        <span className={styles.propTitle}>Divider</span>
        <button className={styles.propClose} onClick={onClose}>✕</button>
      </div>
      <p style={{ fontSize: 12, color: "#888", margin: 0 }}>No properties for divider.</p>
      <button className={styles.propDelete} onClick={onDelete}>Delete</button>
    </div>
  );

  if (target.type === "field") {
    const field = section.columns[target.colIdx!][target.fieldIdx!];
    const updateField = (patch: Partial<FormField>) =>
      onUpdate(sections.map((s) => {
        if (s.id !== target.sectionId) return s;
        return {
          ...s,
          columns: s.columns.map((col, ci) =>
            ci !== target.colIdx ? col :
            col.map((f, fi) => fi !== target.fieldIdx ? f : { ...f, ...patch })),
        };
      }));

    return (
      <div className={styles.propPanel}>
        <div className={styles.propHeader}>
          <span className={styles.propTitle}>{field.label}</span>
          <button className={styles.propClose} onClick={onClose}>✕</button>
        </div>

        <label className={styles.propLabel}>Label</label>
        <input className={styles.propInput} value={field.label}
          onChange={(e) => updateField({ label: e.target.value })} />

        <label className={styles.propLabel}>
          <input type="checkbox" checked={field.mandatory}
            onChange={(e) => updateField({ mandatory: e.target.checked })}
            style={{ marginRight: 6 }} />
          Mandatory
        </label>

        {field.type === "text" && (
          <>
            <label className={styles.propLabel}>Type</label>
            <label className={styles.radioLabel}>
              <input type="radio" checked={!field.multiLine} onChange={() => updateField({ multiLine: false })} />
              Single Line
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" checked={!!field.multiLine} onChange={() => updateField({ multiLine: true })} />
              Multi Line
            </label>
          </>
        )}

        {field.type === "dropdown" && (
          <>
            <label className={styles.propLabel}>Options</label>
            {field.options?.map((opt, oi) => (
              <div key={oi} className={styles.optionRow}>
                <input className={styles.propInput} style={{ flex: 1, marginBottom: 0 }} value={opt}
                  onChange={(e) => {
                    const opts = [...(field.options || [])];
                    opts[oi] = e.target.value;
                    updateField({ options: opts });
                  }} />
                <button className={styles.propDelete} style={{ marginTop: 0, padding: "4px 8px" }}
                  onClick={() => updateField({ options: (field.options || []).filter((_, i) => i !== oi) })}>
                  ✕
                </button>
              </div>
            ))}
            <button className={styles.propAddBtn}
              onClick={() => updateField({ options: [...(field.options || []), "New Option"] })}>
              + Add Option
            </button>
          </>
        )}

        <button className={styles.propDelete} onClick={onDelete}>Delete</button>
      </div>
    );
  }

  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FormTemplate() {
  const [sections, setSections] = useState<FormSection[]>([]);
  const [selected, setSelected] = useState<SelectedTarget | null>(null);
  const [dragOverCanvas, setDragOverCanvas] = useState(false);
  const [dragOverCol, setDragOverCol] = useState<{ sId: string; col: number } | null>(null);

  const onSidebarDragStart = (e: React.DragEvent, itemType: string) => {
    e.dataTransfer.setData("itemType", itemType);
  };

  const onCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemType = e.dataTransfer.getData("itemType");
    if (!itemType) return;
    const isLayout = LAYOUT_ELEMENTS.find((l) => l.type === itemType);
    if (isLayout) {
      const cols = colCount(itemType as LayoutType);
      setSections((prev) => [...prev, {
        id: uid(),
        layout: itemType as LayoutType,
        headingText: itemType === "heading" ? "Heading" : undefined,
        subText: itemType === "heading" ? "Subheading Text" : undefined,
        columns: Array.from({ length: cols }, () => []),
      }]);
    }
    setDragOverCanvas(false);
  };

  const onColDrop = (e: React.DragEvent, sectionId: string, colIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    const itemType = e.dataTransfer.getData("itemType");
    if (!itemType) return;
    const isField = FORM_ELEMENTS.find((f) => f.type === itemType);
    if (isField) {
      setSections((prev) => prev.map((s) =>
        s.id !== sectionId ? s : {
          ...s,
          columns: s.columns.map((col, ci) =>
            ci === colIdx ? [...col, defaultField(itemType as FieldType)] : col),
        }));
    }
    setDragOverCol(null);
  };

  const deleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setSelected(null);
  };

  const deleteField = (sectionId: string, colIdx: number, fieldIdx: number) => {
    setSections((prev) => prev.map((s) =>
      s.id !== sectionId ? s : {
        ...s,
        columns: s.columns.map((col, ci) =>
          ci === colIdx ? col.filter((_, fi) => fi !== fieldIdx) : col),
      }));
    setSelected(null);
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    setSections((prev) => {
      const arr = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= arr.length) return arr;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return arr;
    });
  };

  return (
    <div className={styles.root}>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarTitle}>Elements</span>
          <span className={styles.sidebarCopy}>⎘</span>
        </div>

        <p className={styles.sectionLabel}>LAYOUT ELEMENTS</p>
        {LAYOUT_ELEMENTS.map((el) => (
          <div key={el.type} draggable
            onDragStart={(e) => onSidebarDragStart(e, el.type)}
            className={styles.sidebarItem}>
            <span className={styles.sidebarIcon}>{el.icon}</span>
            <span>{el.label}</span>
          </div>
        ))}

        <p className={`${styles.sectionLabel} ${styles.sectionLabelMt}`}>FORM ELEMENTS</p>
        {FORM_ELEMENTS.map((el) => (
          <div key={el.type} draggable
            onDragStart={(e) => onSidebarDragStart(e, el.type)}
            className={styles.sidebarItem}>
            <span className={styles.sidebarIcon}>{el.icon}</span>
            <span>{el.label}</span>
          </div>
        ))}
      </aside>

      {/* Canvas */}
      <div
        className={`${styles.canvas} ${dragOverCanvas ? styles.canvasDragOver : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOverCanvas(true); }}
        onDragLeave={() => setDragOverCanvas(false)}
        onDrop={onCanvasDrop}
        onClick={(e) => { if (e.currentTarget === e.target) setSelected(null); }}
      >
        {sections.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⊞</div>
            <p className={styles.emptyTitle}>Drag &amp; Drop Elements</p>
            <p className={styles.emptySubtitle}>
              Simply Drag &amp; Drop elements from left panel in to this area to build template
            </p>
          </div>
        )}

        {sections.map((section, si) => (
          <div key={section.id} className={styles.sectionWrap}>

            <div className={styles.sectionControls}>
              <button className={styles.ctrlBtn} onClick={() => moveSection(si, -1)}>↑</button>
              <button className={styles.ctrlBtn} onClick={() => moveSection(si, 1)}>↓</button>
            </div>

            {section.layout === "heading" && (
              <div
                className={`${styles.headingEl} ${selected?.sectionId === section.id && selected.type === "heading" ? styles.headingElSelected : ""}`}
                onClick={(e) => { e.stopPropagation(); setSelected({ type: "heading", sectionId: section.id }); }}>
                <div className={styles.headingText}>{section.headingText || "Heading"}</div>
                <div className={styles.subText}>{section.subText || "Subheading Text"}</div>
              </div>
            )}

            {section.layout === "divider" && (
              <div
                className={`${styles.dividerEl} ${selected?.sectionId === section.id && selected.type === "divider" ? styles.dividerElSelected : ""}`}
                onClick={(e) => { e.stopPropagation(); setSelected({ type: "divider", sectionId: section.id }); }}>
                <hr />
              </div>
            )}

            {["1col", "2col", "3col"].includes(section.layout) && (
              <div className={styles.colRow}
                style={{ gridTemplateColumns: `repeat(${colCount(section.layout)}, 1fr)` }}>
                {section.columns.map((col, ci) => (
                  <div key={ci}
                    className={`${styles.colSlot} ${dragOverCol?.sId === section.id && dragOverCol.col === ci ? styles.colSlotDragOver : ""}`}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverCol({ sId: section.id, col: ci }); }}
                    onDragLeave={() => setDragOverCol(null)}
                    onDrop={(e) => onColDrop(e, section.id, ci)}>
                    {col.length === 0 && <span className={styles.colPlaceholder}>Drag &amp; drop Element here</span>}
                    {col.map((field, fi) => (
                      <div key={field.id}
                        className={`${styles.fieldEl} ${selected?.sectionId === section.id && selected.colIdx === ci && selected.fieldIdx === fi ? styles.fieldElSelected : ""}`}
                        onClick={(e) => { e.stopPropagation(); setSelected({ type: "field", sectionId: section.id, colIdx: ci, fieldIdx: fi }); }}>
                        <FieldPreview field={field} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Properties Panel */}
      {selected && (
        <PropertiesPanel
          target={selected}
          sections={sections}
          onUpdate={setSections}
          onDelete={() => {
            if (selected.type === "field") deleteField(selected.sectionId, selected.colIdx!, selected.fieldIdx!);
            else deleteSection(selected.sectionId);
          }}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}