// sections/investing.js
let isAdult = null;
function adultYes(){
    isAdult = true;
}
function adultNo(){
    isAdult = false;
}

let hasJob = null;
function jobYes(){
    hasJob = true;
}
function jobNo(){
    hasJob = false;
}

let savingForCollege = null;
function collegeSavingYes(){
    savingForCollege = true;
}
function collegeSavingNo(){
    savingForCollege = false;
}

let savingForRetirement = null;
function retirementSavingYes(){
    savingForRetirement = true;
}
function retirementSavingNo(){
    savingForRetirement = false;
}

// Make functions globally available
window.adultYes = adultYes;
window.adultNo = adultNo;
window.jobYes = jobYes;
window.jobNo = jobNo;
window.collegeSavingYes = collegeSavingYes;
window.collegeSavingNo = collegeSavingNo;
window.retirementSavingYes = retirementSavingYes;
window.retirementSavingNo = retirementSavingNo;

import * as d3 from 'd3';

// Append an SVG to the #accountDonut div
const margin = { top: 20, right: 20, bottom: 120, left: 60 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select('#accountDonut')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

// Account categories
const accountTypes = [
  'Taxable brokerage',
  'Custodial',
  'Retirement Accounts',
  'Education savings'
];

// Scales
const xScale = d3.scaleBand()
  .domain(accountTypes)
  .range([0, width])
  .padding(0.2);

const yScale = d3.scaleLinear()
  .domain([0, 1])
  .range([height, 0]);

// Axes
svg.append('g')
  .attr('class', 'x-axis')
  .attr('transform', `translate(0,${height})`)
  .call(d3.axisBottom(xScale))
  .selectAll('text')
  .attr('text-anchor', 'end')
  .attr('transform', 'rotate(-40)');

svg.append('g')
  .attr('class', 'y-axis')
  .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format('.0%')));

// Group for bars
const barsGroup = svg.append('g').attr('class', 'bars');

// Compute likelihood weights based on user flags
function computeLikelihoods() {
  const weights = {
    'Taxable brokerage': 1,
    'Custodial': 1,
    'Retirement Accounts': 1,
    'Education savings': 1
  };

  // Slight extra boost for taxable brokerage
  weights['Taxable brokerage'] += 0.2;

  // Job logic: if employed, boost taxable & retirement; if not, reduce taxable and zero out retirement
  if (hasJob) {
    weights['Taxable brokerage'] += 1;
    weights['Retirement Accounts'] += 1;
  } else {
    weights['Taxable brokerage'] = Math.max(0, weights['Taxable brokerage'] - 0.5);
    weights['Retirement Accounts'] = 0;
  }

  // Adult logic: adults cannot use custodial; minors get custodial boost
  if (isAdult) {
    weights['Custodial'] = 0;
    weights['Taxable brokerage'] += 0.5;
  } else {
    weights['Custodial'] += 2;
  }

  // College savings override: if saving for college, force Education savings to 60% of total
  if (savingForCollege) {
    const others = weights['Taxable brokerage'] + weights['Custodial'] + weights['Retirement Accounts'];
    weights['Education savings'] = others * (0.6 / 0.4);
  } else {
    weights['Education savings'] = 0;
  }

  // Retirement savings: boost retirement accounts when saving for retirement
  if (savingForRetirement && hasJob) {
    weights['Retirement Accounts'] += 2;
  }

  // Final safeguard: ensure custodial is zero for adults
  if (isAdult) {
    weights['Custodial'] = 0;
  }

  // Normalize to probabilities
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
  return Object.entries(weights).map(([account, w]) => ({
    account,
    value: w / total
  }));
}

// Render or update the bar chart
function updateChart() {
  const data = computeLikelihoods();

  // Update y-domain
  yScale.domain([0, d3.max(data, d => d.value)]);
  svg.select('.y-axis')
    .transition().duration(500)
    .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format('.0%')));

  // Data join
  const bars = barsGroup.selectAll('rect')
    .data(data, d => d.account);

  // ENTER new bars
  bars.enter()
    .append('rect')
    .attr('x', d => xScale(d.account))
    .attr('width', xScale.bandwidth())
    .attr('y', yScale(0))
    .attr('height', 0)
    .attr('fill', 'rgb(24,84,47)')
    .merge(bars)
    .transition().duration(500)
    .attr('x', d => xScale(d.account))
    .attr('width', xScale.bandwidth())
    .attr('y', d => yScale(d.value))
    .attr('height', d => height - yScale(d.value));

  // EXIT old bars
  bars.exit().remove();
}

// Initial draw
updateChart();

// Re-bind updateChart to each setter so chart updates on flag changes
[adultYes, adultNo, jobYes, jobNo,
 collegeSavingYes, collegeSavingNo,
 retirementSavingYes, retirementSavingNo]
.forEach(fn => {
  const original = fn;
  const name = fn.name;
  window[name] = function() {
    original();
    updateChart();
  };
});
