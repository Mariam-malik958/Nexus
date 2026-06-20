import { useState } from "react";

export default function MeetingForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    title: "",
    investorId: "",
    entrepreneurId: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      onSuccess();
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border rounded-lg">
      <h2 className="text-lg font-bold">Schedule Meeting</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="text"
        placeholder="Meeting Title"
        className="border p-2 rounded"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Investor ID"
        className="border p-2 rounded"
        value={form.investorId}
        onChange={(e) => setForm({ ...form, investorId: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Entrepreneur ID"
        className="border p-2 rounded"
        value={form.entrepreneurId}
        onChange={(e) => setForm({ ...form, entrepreneurId: e.target.value })}
        required
      />
      <input
        type="datetime-local"
        className="border p-2 rounded"
        value={form.startTime}
        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
        required
      />
      <input
        type="datetime-local"
        className="border p-2 rounded"
        value={form.endTime}
        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {loading ? "Scheduling..." : "Schedule Meeting"}
      </button>
    </form>
  );
}