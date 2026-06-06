const buildJobQuery = (queryParams) => {
  const conditions = [];
  const values = [];
  let index = 1;

  const { location, job_type, tech_stack, min_cgpa, status, search } = queryParams;

  if (search) {
    conditions.push(`(j.title ILIKE $${index} OR j.description ILIKE $${index})`);
    values.push(`%${search}%`);
    index++;
  }

  if (location) {
    conditions.push(`j.location ILIKE $${index}`);
    values.push(`%${location}%`);
    index++;
  }

  if (job_type) {
    conditions.push(`j.job_type = $${index}`);
    values.push(job_type);
    index++;
  }

  if (tech_stack) {
    // tech_stack passed as comma separated string e.g. "React,Node.js"
    const techs = tech_stack.split(',').map(t => t.trim());
    conditions.push(`j.tech_stack && $${index}`);
    values.push(techs);
    index++;
  }

  if (min_cgpa) {
    conditions.push(`j.min_cgpa <= $${index}`);
    values.push(parseFloat(min_cgpa));
    index++;
  }

  if (status) {
    conditions.push(`j.status = $${index}`);
    values.push(status);
    index++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { whereClause, values };
};

module.exports = { buildJobQuery };