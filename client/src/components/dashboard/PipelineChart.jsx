import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const stageColors = {
  Applied: '#3b82f6',
  Screening: '#f59e0b',
  Interview: '#8b5cf6',
  Offer: '#10b981',
  Rejected: '#ef4444',
};

const PipelineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-8">No application data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="pipeline_stage" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.pipeline_stage}
              fill={stageColors[entry.pipeline_stage] || '#6b7280'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PipelineChart;