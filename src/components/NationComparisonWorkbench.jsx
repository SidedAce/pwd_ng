import { useEffect, useState } from "react";
import { nationComparisonConfig } from "../config/nationComparison.config";

function formatFieldValue(nation, field) {
  if (!nation) {
    return "No nation selected";
  }

  if (field.valuePath) {
    const value = field.valuePath.split(".").reduce((current, key) => current?.[key], nation);
    return value === null || value === undefined || value === "" ? "None" : String(value);
  }

  if (field.countKey) {
    const value = nation[field.countKey];
    return Array.isArray(value) ? String(value.length) : "0";
  }

  if (field.listKey) {
    const value = nation[field.listKey];
    return Array.isArray(value) && value.length ? value.join(", ") : "None";
  }

  const value = nation[field.valueKey];

  if (value === null || value === undefined || value === "") {
    return "None";
  }

  return String(value);
}

function getCategory(categoryId) {
  return nationComparisonConfig.categories.find((entry) => entry.id === categoryId) || nationComparisonConfig.categories[0];
}

function ComparisonColumn({ categoryId, nationId, nations, onCategoryChange, onNationChange, paneTitle }) {
  const category = getCategory(categoryId);
  const nation = nations.find((entry) => entry.id === nationId) || null;

  return (
    <article className="comparison-pane">
      <div className="comparison-pane-header">
        <div>
          <span className="label">{paneTitle}</span>
          <h2>{nation?.name || "Select a nation"}</h2>
        </div>
        <p className="soft-copy">{category.description}</p>
      </div>

      <div className="comparison-control-grid">
        <label className="field-stack">
          <span className="label">Target Nation</span>
          <select value={nationId} onChange={(event) => onNationChange(event.target.value)} disabled={!nations.length}>
            {nations.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field-stack">
          <span className="label">Data Category</span>
          <select value={category.id} onChange={(event) => onCategoryChange(event.target.value)}>
            {nationComparisonConfig.categories.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="comparison-card">
        {category.fields.map((field) => (
          <div key={field.id} className="comparison-line">
            <span className="label">{field.label}</span>
            <strong>{formatFieldValue(nation, field)}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

export function NationComparisonWorkbench({ nations, status, error }) {
  const [leftNationId, setLeftNationId] = useState("");
  const [rightNationId, setRightNationId] = useState("");
  const [leftCategoryId, setLeftCategoryId] = useState(nationComparisonConfig.defaults.left.categoryId);
  const [rightCategoryId, setRightCategoryId] = useState(nationComparisonConfig.defaults.right.categoryId);

  useEffect(() => {
    if (!nations.length) {
      setLeftNationId("");
      setRightNationId("");
      return;
    }

    setLeftNationId((current) => current || nations[0]?.id || "");
    setRightNationId((current) => current || nations[1]?.id || nations[0]?.id || "");
  }, [nations]);

  if (error) {
    return <p className="error-copy">{error}</p>;
  }

  if (!nations.length) {
    return <p className="support-copy">{status === "loading" ? "Loading nation directory..." : "No nations are available for comparison in this session yet."}</p>;
  }

  return (
    <section className="comparison-workbench">
      <div className="comparison-toolbar">
        <article className="action-card">
          <strong>Nation Directory</strong>
          <p>{nations.length} active nation(s) available for comparison.</p>
        </article>
        <article className="action-card">
          <strong>Report Mode</strong>
          <p>Compact dropdown controls with side-by-side analyst cards.</p>
        </article>
      </div>

      <div className="comparison-grid">
        <ComparisonColumn
          paneTitle="Left Comparison"
          nations={nations}
          nationId={leftNationId}
          categoryId={leftCategoryId}
          onNationChange={setLeftNationId}
          onCategoryChange={setLeftCategoryId}
        />
        <ComparisonColumn
          paneTitle="Right Comparison"
          nations={nations}
          nationId={rightNationId}
          categoryId={rightCategoryId}
          onNationChange={setRightNationId}
          onCategoryChange={setRightCategoryId}
        />
      </div>
    </section>
  );
}
