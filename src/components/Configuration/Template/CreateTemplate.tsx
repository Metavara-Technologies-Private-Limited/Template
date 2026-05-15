import { useState } from "react";
import styles from "../../../styles/CreateTemplate.module.css";
import FormTemplate from "./FormTemplate";
import TextTemplate from "./TextTemplate";
import RadioButton from "../../../assets/icons/Radio_Button.svg";
import RadioButton2 from "../../../assets/icons/Radio_Button2.svg";
import Back from "../../../assets/icons/Back_Icon.svg";

type TemplateFormat = "text" | "form";

interface BasicDetails {
  templateFor: string;
  templateName: string;
  gender: string;
  userType: string;
  serviceName: string;
}

const TEMPLATE_FOR_OPTIONS = ["Lead", "Pathology", "Radiology", "Examination", "Investigation", "Surgery", "Outcome"];
const GENDER_OPTIONS = ["Both", "Male", "Female"];
const USER_TYPE_OPTIONS = ["Pathologist", "Radiologist"];
const SERVICE_OPTIONS = ["Select Service", "Ultrasonography", "Examination", "HCG", "Laparoscopy", "Hysteroscopy"];

interface CreateTemplateProps {
  onCancel?: () => void;
  onSave?: (data: { details: BasicDetails; format: TemplateFormat; content?: string }) => void;
}

export default function CreateTemplate({ onCancel, onSave }: CreateTemplateProps) {
  const [details, setDetails] = useState<BasicDetails>({
    templateFor: "",
    templateName: "",
    gender: "",
    userType: "",
    serviceName: "",
  });
  const [format, setFormat] = useState<TemplateFormat>("text");
  const [textContent, setTextContent] = useState("");

  const set = (key: keyof BasicDetails, value: string) =>
    setDetails((prev) => ({ ...prev, [key]: value }));

  return (
    <div className={styles.wrapper}>

      {/* Back */}
      <div className={styles.backRow} onClick={onCancel}>
        <img
              src={Back}
              alt="Back"
            />
            Create New Template
      </div>

      {/* Basic Details */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Basic Details</p>
        <div className={styles.basicGrid}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Template For</label>
            <select className={styles.select} value={details.templateFor} onChange={(e) => set("templateFor", e.target.value)}>
              <option value="">Select</option>
              {TEMPLATE_FOR_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Template Name</label>
            <input className={styles.textInput} placeholder="Enter Template Name"
              value={details.templateName} onChange={(e) => set("templateName", e.target.value)} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Gender</label>
            <select className={styles.select} value={details.gender} onChange={(e) => set("gender", e.target.value)}>
              <option value="">Select</option>
              {GENDER_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>User Type</label>
            <select className={styles.select} value={details.userType} onChange={(e) => set("userType", e.target.value)}>
              <option value="">Select</option>
              {USER_TYPE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.serviceRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Service Name</label>
            <select className={styles.select} value={details.serviceName} onChange={(e) => set("serviceName", e.target.value)}>
              {SERVICE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Format radio */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Types of Template Format</p>
        <div className={styles.formatRow}>

          <div className={styles.radioLabel} onClick={() => setFormat("text")}>
            <img
              src={format === "text" ? RadioButton : RadioButton2}
              alt="radio"
              className={styles.radioIcon}
            />
            Text
          </div>

          <div className={styles.radioLabel} onClick={() => setFormat("form")}>
            <img
              src={format === "form" ? RadioButton : RadioButton2}
              alt="radio"
              className={styles.radioIcon}
            />
            Form
          </div>

        </div>
      </div>

      {/* Format label */}
      <p className={styles.formAreaLabel}>
        {format === "form" ? "Form Format" : "Text Format"}
      </p>

      {/* Canvas */}
      <div className={styles.formCanvas}>
        {format === "form"
          ? <FormTemplate />
          : <TextTemplate
              initialContent={textContent}
              onContentChange={setTextContent}
            />
        }
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
        <button className={styles.saveBtn} onClick={() => onSave?.({ details, format, content: textContent })}>Save</button>
      </div>

    </div>
  );
}