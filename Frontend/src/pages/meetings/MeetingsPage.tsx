import { useEffect, useState } from "react";
import MeetingForm from "../../components/meetings/MeetingForm";
import MeetingCalendar from "../../components/meetings/MeetingCalendar";
import MeetingCards from "../../components/meetings/MeetingCards";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMeetings = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/meetings");

      if (!res.ok) {
        throw new Error("Failed to fetch meetings");
      }

      const data = await res.json();
      setMeetings(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Meeting Management
            </h1>
            <p className="text-gray-500 mt-1">
              Schedule, manage and track all meetings
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
          >
            {showForm ? "Close Form" : "+ New Meeting"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Total Meetings</h3>
            <p className="text-3xl font-bold text-blue-600">
              {meetings.length}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Upcoming</h3>
            <p className="text-3xl font-bold text-green-600">
              {meetings.length}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Status</h3>
            <p className="text-lg font-semibold text-gray-700">Active</p>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Schedule New Meeting
            </h2>

            <MeetingForm
              onSuccess={() => {
                setShowForm(false);
                fetchMeetings();
              }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-500">Loading meetings...</p>
          </div>
        ) : (
          <>
            {/* Calendar */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Meeting Calendar
              </h2>

              <MeetingCalendar meetings={meetings} />
            </div>

            {/* Meeting List */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                All Meetings
              </h2>

              <MeetingCards
                meetings={meetings}
                onUpdate={fetchMeetings}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}