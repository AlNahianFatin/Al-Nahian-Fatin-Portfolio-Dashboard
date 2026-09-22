"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const fields: Record<string, string[]> = {
  profile: ["name", "title", "shortBio", "aboutTitle", "aboutDescription", "imageUrl", "location", "availability", "email", "phone"],
  education: ["institution", "degree", "field", "major", "description", "location", "startDate", "endDate", "gpa", "imageUrl", "sortOrder", "isActive"],
  skill: ["name", "category", "level", "icon", "sortOrder", "isActive"],
  project: ["title", "description", "imageUrl", "githubUrl", "liveUrl", "technologies", "featured", "sortOrder", "isActive"],
  experience: ["company", "role", "task", "startDate", "endDate", "isActive"],
  publication: ["title", "status", "description", "publisher", "publicationDate", "url", "imageUrl", "sortOrder", "isActive"],
  socialLink: ["platform", "label", "url", "icon", "sortOrder", "isActive"],
  resume: ["title", "fileUrl", "isActive"],
};

const requiredFields = ["name", "title", "institution", "platform", "degree", "field", "status", "fileUrl", "category", "company", "role"];

const technicalSkillCategories = [
  "LANGUAGE",
  "WEB",
  "SOFTWARE",
  "DATABASE",
  "TOOL",
];

const labels = (s: string) => s.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());

export default function ContentEditor() {
  const { model } = useParams<{ model: string }>();
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const response = await fetch("/api/content/" + model);
    const data = await response.json();
    const loadedRows = data.rows || [];

    setRows(loadedRows);

    return loadedRows;
  };

  useEffect(() => {
    load().then(loadedRows => {
      if (model === "profile" && loadedRows.length > 0)
        edit(loadedRows[0]);
    });
  }, [model]);

  const fs = fields[model] || [];

  function val(k: string) {
    return Array.isArray(form[k]) ? form[k].join(", ") : form[k] ?? ""
  }

  async function save(e: any) {
    e.preventDefault();

    setErrors({});

    let hasError = false;

    for (const k of fs) {
      const isRequired = requiredFields.includes(k) ||
        (k === "url" && model === "socialLink") ||
        (k === "startDate" && model === "experience");

      if (isRequired && !form[k]) {
        setErrors(prev => ({ ...prev, [k]: "This field is required" }));
        hasError = true;
      }

      if (k === "sortOrder") {
        if (form[k] !== undefined && form[k] !== "") {
          const valNum = parseInt(form[k]);

          if (isNaN(valNum) || valNum < 1) {
            setErrors(prev => ({ ...prev, [k]: "Sort order must be 1 or greater" }));
            hasError = true;
          } else {
            const duplicate = rows.find(row => row.id !== editing && row.sortOrder === valNum);

            if (duplicate) {
              const humanName = duplicate.title || duplicate.name || duplicate.institution || duplicate.platform || "an item";

              setErrors(prev => ({ ...prev, [k]: `Sort order ${valNum} is already used by ${humanName}` }));
              hasError = true;
            }
          }
        }
      }
    }

    if (hasError) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setStatus("Saving...");

    const formData = new FormData();
    for (const [k, v] of Object.entries(form)) {
      if (v !== undefined && v !== null) {
        if (v instanceof File)
          formData.append(k, v);
        else if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')
          formData.append(k, String(v));
      }
    }

    if (editing)
      formData.append("id", editing);

    const r = await fetch(`/api/content/${model}`, {
      method: editing ? "PUT" : "POST",
      body: formData
    });

    const d = await r.json();

    if (!r.ok) {
      if (d.field) {
        setErrors({ [d.field]: d.message });
        toast.error(d.message);
      } else {
        setStatus(d.message || "Something went wrong");
        toast.error(d.message || "Something went wrong");
      }
      return;
    }

    toast.success(d.message || "Saved successfully");

    clearForm();

    load();
  }

  function edit(row: any) {
    const x = { ...row };
    for (const k of ["startDate", "endDate", "publicationDate"])
      if (x[k])
        x[k] = new Date(x[k]).toISOString().slice(0, 10);

    setForm(x);

    setEditing(row.id);
  }

  async function confirmDelete() {
    if (!deleteId)
      return;

    try {
      await fetch(`/api/content/${model}?id=${deleteId}`, {
        method: "DELETE"
      });

      toast.success("Item deleted successfully");
    } catch (e) {
      toast.error("Failed to delete item");
    } finally {
      setDeleteId(null);

      load();
    }
  }

  function clearForm() {
    setForm({});
    setEditing(null);
    setErrors({});
    setStatus("");
  }

  return (
    <main className="p-5 md:p-8">
      <div className="mb-6">
        <p className="text-sm text-indigo-600">Portfolio</p>
        <h1 className="text-3xl font-bold">{labels(model)}</h1>
      </div>
      <div className={model === "profile" ? "" : "grid gap-6 xl:grid-cols-[1fr_1.3fr]"}>
        <form onSubmit={save} className="panel p-6">
          <h2 className="font-bold">{editing ? "Edit" : "Add"} {labels(model)}</h2>
          {
            fs.map(k => {
              const bool = ["isActive", "featured"].includes(k);
              const isDate = ["startDate", "endDate", "publicationDate"].includes(k);
              const isFile = ["imageUrl", "fileUrl"].includes(k);
              const isRequired = requiredFields.includes(k) ||
                (k === "url" && model === "socialLink") ||
                (k === "startDate" && model === "experience");;

              return (
                <label key={k} className="mt-4 block text-sm font-medium">
                  {
                    k === "imageUrl" && model === "profile" ? "Profile Image" :
                      k === "imageUrl" && model === "education" ? "Institution Image" :
                        k === "imageUrl" && model === "project" ? "Project Image" :
                          k === "imageUrl" && model === "publication" ? "Publication Cover Image" :
                            k === "fileUrl" && model === "resume" ? "CV / Resume" :
                              (k === "url" && (model === "publication" || model === "socialLink")) ? "Link" :
                                k === "icon" && model === "socialLink" ? "Icon" :
                                  labels(k)
                  } {!isRequired ? " (optional)" : ""}
                  {
                    bool ?
                      <input type="checkbox" checked={!!form[k]} onChange={
                        e => setForm({ ...form, [k]: e.target.checked })
                      } className="ml-3 h-4 w-4 hover:cursor-pointer" /> :
                      <div className="mt-1">
                        {
                          isFile ? (
                            <div className="space-y-2">

                              <input
                                key={form[k] instanceof File ? Date.now() : 'default'}
                                type="file"
                                accept={k === 'fileUrl' ? 'application/pdf' : 'image/*'}
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const isValid = k === 'fileUrl'
                                      ? file.type === 'application/pdf'
                                      : file.type.startsWith('image/');

                                    if (!isValid) {
                                      setErrors(prev => ({ ...prev, [k]: `Invalid file type. ${k === 'fileUrl' ? 'PDF' : 'Image'} required.` }));
                                      setForm({ ...form, [k]: null });
                                      return;
                                    }
                                    setErrors(prev => ({ ...prev, [k]: "" }));
                                  }
                                  setForm({ ...form, [k]: file });
                                }}
                                className={`w-full rounded-xl border px-3 py-2 outline-none focus:border-indigo-500 hover:cursor-pointer ${errors[k] ? "border-red-500" : "border-slate-200"}`}
                              />

                              {
                                val(k) && (
                                  <div className="flex flex-col items-center gap-2 text-xs text-slate-500">
                                    {
                                      k === 'fileUrl' ? (
                                        <a href={typeof val(k) === "string" ? val(k) : URL.createObjectURL(val(k))} target="_blank" rel="noopener noreferrer" className="underline text-indigo-600">View Document</a>
                                      ) : (
                                        <img src={val(k) instanceof File ? URL.createObjectURL(val(k)) : val(k)} alt="Preview" className="w-fit max-h-80 rounded object-cover border" />
                                      )
                                    }
                                    <span className="ml-1">Current: {typeof val(k) === "string" ? val(k).split('/').pop() : "File selected"}</span>
                                  </div>
                                )
                              }
                            </div>
                          ) : (k === "status" && model === "publication") ? (
                            <select value={val(k)} onChange={
                              e => setForm({ ...form, [k]: e.target.value })
                            } className={`w-full rounded-xl border px-3 py-2 outline-none focus:border-indigo-500 hover:cursor-pointer ${errors[k] ? "border-red-500" : "border-slate-200"}`}>
                              <option value="">Select status</option>
                              <option value="ONGOING">Ongoing</option>
                              <option value="COMPLETED">Completed</option>
                            </select>
                          ) : (k === "sortOrder") ? (
                            <input type="number" min="1" value={val(k)} onChange={
                              e => setForm({ ...form, [k]: e.target.value })
                            } className={`w-full rounded-xl border px-3 py-2 outline-none focus:border-indigo-500 ${errors[k] ? "border-red-500" : "border-slate-200"}`} />
                          ) : isDate ? (
                            <input type="date" value={val(k)} onChange={
                              e => setForm({ ...form, [k]: e.target.value })
                            } className={`w-full rounded-xl border px-3 py-2 outline-none focus:border-indigo-500 hover:cursor-pointer ${errors[k] ? "border-red-500" : "border-slate-200"}`} />
                          ) : (k === "category" && model === "skill") ? (
                            <select value={val(k)} onChange={e => setForm({ ...form, [k]: e.target.value })}
                              className={`w-full rounded-xl border px-3 py-2 outline-none focus:border-indigo-500 hover:cursor-pointer ${errors[k] ? "border-red-500" : "border-slate-200"}`} >

                              <option value="">Select category</option>
                              {
                                technicalSkillCategories.map((category) => (
                                  <option key={category} value={category}>
                                    {category}
                                  </option>
                                ))
                              }

                            </select>
                          ) : (
                            <textarea value={val(k)} onChange={
                              e => setForm({ ...form, [k]: e.target.value })
                            } rows={["description", "shortBio", "aboutDescription"].includes(k) ? 3 : 1}
                              className={`w-full rounded-xl border px-3 py-2 outline-none focus:border-indigo-500 ${errors[k] ? "border-red-500" : "border-slate-200"}`} />
                          )
                        }

                        {
                          errors[k] && (
                            <p className="mt-1 text-xs text-red-600">{errors[k]}</p>
                          )
                        }
                      </div>
                  }
                </label>
              )
            })
          }

          <div className="mt-5 flex gap-2">
            {
              model === "profile" ? (
                <>
                  <button className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-600/80 hover:scale-105 hover:cursor-pointer transition-all">Update Profile</button>

                  <button type="button" onClick={clearForm} className="rounded-xl border px-5 py-2.5 font-semibold text-slate-600 hover:bg-red-400/80 hover:text-black hover:border-black hover:scale-105 hover:cursor-pointer transition-all">Clear</button>
                </>
              ) : (
                <>
                  <button className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-600/80 hover:scale-105 hover:cursor-pointer transition-all">{editing ? "Update" : "Save"}</button>

                  <button type="button" onClick={clearForm} className="mt-5 rounded-xl border px-5 py-2.5 font-semibold text-slate-600 hover:bg-red-400/80 hover:text-black hover:border-black hover:scale-105 hover:cursor-pointer transition-all">Clear</button>
                </>
              )
            }
          </div>

          <p className="mt-3 text-sm text-slate-500">{status}</p>
        </form>

        {
          model !== "profile" && (
            <div className="space-y-3">
              {
                rows.map(row =>
                  <div key={row.id} className="panel p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        {
                          row.imageUrl &&
                          <img src={row.imageUrl} className="h-12 w-12 rounded object-cover border" />
                        }
                        {
                          row.fileUrl && model === "resume" && (
                            <div className="h-12 w-12 rounded border bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">PDF</div>
                          )
                        }
                        <div>
                          <h3 className="font-semibold">{row.name || row.title || row.institution || row.platform || row.key || row.degree || row.company || "Item"}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{row.email || row.degree || row.description || row.category || row.url || row.value || row.degree || row.role || row.status}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => edit(row)} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-indigo-600/80 hover:scale-105 hover:cursor-pointer transition-all">Edit</button>

                        <button onClick={() => setDeleteId(row.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-400/80 hover:scale-105 hover:text-black hover:border-black hover:cursor-pointer transition-all">Delete</button>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          )
        }
      </div>

      {
        deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="panel max-w-sm rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold">Delete Item</h2>
              <p className="mt-2 text-slate-500">Are you sure you want to delete this item? This action cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setDeleteId(null)} className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-red-400/80 hover:text-black hover:border-black hover:scale-105 hover:cursor-pointer transition-all">Cancel</button>

                <button onClick={confirmDelete} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400/80 hover:text-black hover:border-black hover:scale-105 hover:cursor-pointer transition-all">Delete</button>
              </div>
            </div>
          </div>
        )
      }
    </main>
  )
}
