const stageStyles = {
  Applied: 'bg-blue-100 text-blue-700',
  Screening: 'bg-yellow-100 text-yellow-700',
  Interview: 'bg-purple-100 text-purple-700',
  Offer: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

const PipelineBadge = ({ stage }) => (
  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${stageStyles[stage] || 'bg-gray-100 text-gray-600'}`}>
    {stage}
  </span>
);

export default PipelineBadge;