interface Meeting {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  investorId: { name: string; email: string };
  entrepreneurId: { name: string; email: string };
}

export default function MeetingCards({
  meetings,
  onUpdate,
}: {
  meetings: Meeting[];
  onUpdate: () => void;
}) {
  const handleAccept = async (id: string) => {
    await fetch(`http://localhost:5000/api/meetings/${id}/accept`, {
      method: "PUT",
    });
    onUpdate();
  };

  const handleReject = async (id: string) => {
    await fetch(`http://localhost:5000/api/meetings/${id}/reject`, {
      method: "PUT",
    });
    onUpdate();
  };

  return (
    <div className="flex flex-col gap-4">
      {meetings.map((m) => (
        <div key={m._id} className="border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">{m.title}</h3>
            <span
              className={`px-2 py-1 rounded text-white text-sm ${
                m.status === "accepted" ? "bg-green-600" :
                m.status === "rejected" ? "bg-red-600" : "bg-yellow-600"
              }`}
            >
              {m.status}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            Investor: {m.investorId?.name} ({m.investorId?.email})
          </p>
          <p className="text-sm text-gray-500">
            Entrepreneur: {m.entrepreneurId?.name} ({m.entrepreneurId?.email})
          </p>
          <p className="text-sm text-gray-500">
            Start: {new Date(m.startTime).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            End: {new Date(m.endTime).toLocaleString()}
          </p>

          {m.status === "pending" && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleAccept(m._id)}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(m._id)}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}