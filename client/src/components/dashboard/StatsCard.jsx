const StatsCard = ({ label, value, icon }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

export default StatsCard;