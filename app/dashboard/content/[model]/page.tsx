"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const fields: Record<string, string[]> = {
  profile: ["name", "title", "shortBio", "aboutTitle", "aboutDescription", "profileImage", "location", "availability", "email", "phone"],
  education: ["institution", "degree", "field", "startDate", "endDate", "description", "location", "sortOrder", "isActive"],
  skill: ["name", "category", "level", "icon", "sortOrder", "isActive"],
  project: ["title", "description", "image", "githubUrl", "liveUrl", "technologies", "featured", "sortOrder", "isActive"],
  publication: ["title", "description", "publisher", "publicationDate", "url", "image", "sortOrder", "isActive"],
  socialLink: ["platform", "label", "url", "icon", "sortOrder", "isActive"],
  resume: ["title", "fileUrl", "fileName", "isActive"],
};

const labels = (s: string) => s.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());

export default function ContentEditor() {
  const { model } = useParams<{ model: string }>();

  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const load = () => fetch(`/api/content/${model}`)
    .then(r => r.json())
    .then(d => setRows(d.rows || []));

  useEffect(() => {
    load()
  }, [model]);

  const fs = fields[model] || [];

  function val(k: string) {
    return Array.isArray(form[k]) ? form[k].join(", ") : form[k] ?? ""
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();

    setStatus("Saving...");

    const body = { ...form };

    if (body.technologies && typeof body.technologies === "string")
      body.technologies = body.technologies.split(",").map((x: string) => x.trim()).filter(Boolean);

    if (body.level)
      body.level = Number(body.level);

    if (body.sortOrder)
      body.sortOrder = Number(body.sortOrder);

    if (body.startDate)
      body.startDate = new Date(body.startDate).toISOString();

    if (body.endDate)
      body.endDate = new Date(body.endDate).toISOString();

    if (body.publicationDate)
      body.publicationDate = new Date(body.publicationDate).toISOString();

    const r = await fetch(`/api/content/${model}`, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { id: editing, ...body } : body)
    });

    const d = await r.json(); setStatus(d.message || "Saved");
    if (r.ok) {
      setForm({});
      setEditing(null);
      load()
    }
  }

  function edit(row: any) {
    const x = { ...row };

    for (const k of ["startDate", "endDate", "publicationDate"])
      if (x[k])
        x[k] = new Date(x[k]).toISOString().slice(0, 10);

    setForm(x);
    setEditing(row.id)
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?"))
      return;

    await fetch(`/api/content/${model}?id=${id}`, {
      method: "DELETE"
    });

    load()
  }

  return (
    <main className="p-5 md:p-8">
      <div className="mb-6">
        <p className="text-sm text-indigo-600">Portfolio</p>
        <h1 className="text-3xl font-bold">{labels(model)}</h1>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">

        <form onSubmit={save} className="panel p-6">
          <h2 className="font-bold">{editing ? "Edit" : "Add"} {labels(model)}</h2>
          {
            fs.map(k => {
              const bool = ["isActive", "featured"].includes(k);

              return (
                <label key={k} className="mt-4 block text-sm font-medium">{labels(k)}
                  {
                    bool ?
                      <input type="checkbox" checked={!!form[k]} onChange={
                        e => setForm({ ...form, [k]: e.target.checked })
                      } className="ml-3 h-4 w-4" /> :
                      <textarea value={val(k)} onChange={
                        e => setForm({ ...form, [k]: e.target.value })
                      } rows={["description", "shortBio", "aboutDescription"].includes(k) ? 3 : 1}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-indigo-500" />
                  }
                </label>
              )

            })
          }
          <button className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white">{editing ? "Update" : "Save"}</button>
          {
            editing &&
            <button type="button" onClick={() => {
              setEditing(null);
              setForm({})
            }} className="ml-2 rounded-xl border px-5 py-2.5">Cancel</button>
          }
          <p className="mt-3 text-sm text-slate-500">{status}</p>
        </form>

        <div className="space-y-3">
          {
            rows.map(row =>
              <div key={row.id} className="panel p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{row.title || row.name || row.institution || row.platform || row.key || row.degree || "Item"}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{row.description || row.url || row.value || row.email || ""}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() =>
                      edit(row)} className="rounded-lg border px-3 py-1.5 text-sm">Edit</button>
                    <button onClick={() =>
                      remove(row.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600">Delete</button>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </main>
  )
}
