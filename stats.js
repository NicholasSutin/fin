// Prevent wheel scrolling

document.addEventListener('wheel', e => e.preventDefault(), { passive: false });

// Prevent touch dragging
document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

import * as d3 from 'd3';

// Configuration
const width       = 600;
const height      = 600;
const margin      = 0;
const radius      = Math.min(width, height) / 2 - margin;
const innerRadius = radius * 0.5;
const outerRadius = radius * 0.8;
const cornerRad   = 10; // adjust for roundness

// Create SVG container
const svg = d3.select('#donut-chart')
  .append('svg')
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform', `translate(${width/2}, ${height/2})`);

// Dark-gray background ring
const bgArc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius)
  .startAngle(0)
  .endAngle(2 * Math.PI);

svg.append('path')
  .attr('d', bgArc())
  .attr('fill', '#333');

// Foreground arc generator with rounded corners
const fgArc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius)
  .startAngle(0)
  .cornerRadius(cornerRad);

// Append the foreground path at 100%
const fg = svg.append('path')
  .datum({ endAngle: 2 * Math.PI })
  .attr('fill', '#FFF085')
  .attr('d', fgArc);

// Initial animate: 100% → 39%
fg.transition()
  .duration(1500)
  .attrTween('d', function(d) {
    const interpolate = d3.interpolate(d.endAngle, 0.39 * 2 * Math.PI);
    return t => {
      d.endAngle = interpolate(t);
      return fgArc(d);
    };
  });

// Click-driven interactions
let clickCount = 0;

document.addEventListener('click', function() {
  clickCount++;
  console.log(`Total clicks on page: ${clickCount}`);

  if (clickCount === 1) {
    // Hide & slide up #stat-1
    const stat1 = document.getElementById('stat-1');
    if (stat1) {
      Object.assign(stat1.style, {
        position:   'absolute',
        transition: 'top 0.8s ease-out, opacity 0.8s ease-out'
      });
      stat1.getBoundingClientRect();
      stat1.style.top     = 'calc(0px - 800px)';
      stat1.style.opacity = '0';
    }

    // Show & slide in #stat-2
    const stat2 = document.getElementById('stat-2');
    if (stat2) {
      Object.assign(stat2.style, {
        display:    'block',
        position:   'absolute',
        left:       '-300px',
        top:        '100vh',
        width:      'calc(50% * 0.7)',
        opacity:    '0',
        transition: 'top 0.8s ease-out, opacity 0.8s ease-out'
      });
      stat2.getBoundingClientRect();
      stat2.style.top     = 'calc(15vh - 150px)';
      stat2.style.opacity = '1';
    }

    // Animate donut: from current → 12% and tint more red
    fg.transition()
      .duration(800)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate(d.endAngle, 0.12 * 2 * Math.PI);
        return t => {
          d.endAngle = interpolate(t);
          return fgArc(d);
        };
      })
      .attr('fill', '#FCB454');
  }

  if (clickCount === 2) {
    // Animate donut: from current → 8% and tint to #F16767
    fg.transition()
      .duration(800)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate(d.endAngle, 0.08 * 2 * Math.PI);
        return t => {
          d.endAngle = interpolate(t);
          return fgArc(d);
        };
      })
      .attr('fill', '#F16767');

    // Hide & slide up #stat-2
    const stat2 = document.getElementById('stat-2');
    if (stat2) {
      Object.assign(stat2.style, {
        transition: 'top 0.8s ease-out, opacity 0.8s ease-out'
      });
      stat2.getBoundingClientRect();
      stat2.style.top     = 'calc(0px - 600px)';
      stat2.style.opacity = '0';
    }

    // Show & slide in #stat-3
    const stat3 = document.getElementById('stat-3');
    if (stat3) {
      Object.assign(stat3.style, {
        display:    'block',
        position:   'absolute',
        left:       '-300px',
        top:        '100vh',
        width:      'calc(50% * 0.7)',
        opacity:    '0',
        transition: 'top 0.8s ease-out, opacity 0.8s ease-out'
      });
      stat3.getBoundingClientRect();
      stat3.style.top     = 'calc(0vh - 200px)';
      stat3.style.opacity = '1';
    }
  }
  if (clickCount === 3) {
    // Fade out #container
    const container = document.getElementById('container');
    if (container) {
      container.style.transition = 'opacity 0.8s ease-out';
      container.style.opacity = '0';
      setTimeout(() => {
        container.style.display = 'none';
        console.log("container is gone");
        
        // Fade in the .second element
        const secondElement = document.querySelector('.second');
        if (secondElement) {
          secondElement.style.display = 'block'; // Make it visible first
          setTimeout(() => {
            secondElement.style.transition = 'opacity 0.8s ease-in';
            secondElement.style.opacity = '1';

          }, 10);

           //================================================================================
           const ends = [
            'calc(50vw + 20px)',
            'calc(50vw + 80px)',
            'calc(50vw + 155px)',
            'calc(50vw + 400px)',
            'calc(50vw - 40px)',
            'calc(50vw - 120px)',
            'calc(50vw - 240px)',
            'calc(50vw - 560px)'
          ];
          
          const svg = document.getElementById('mySvg');
          
          function toPx(expr, axis = 'x') {
            const el = document.createElement('div');
            el.style.position = 'absolute';
            el.style[axis === 'x' ? 'left' : 'top'] = expr;
            document.body.appendChild(el);
            const px = axis === 'x'
              ? el.getBoundingClientRect().left
              : el.getBoundingClientRect().top;
            document.body.removeChild(el);
            return px;
          }
          
          function updatePaths() {
            svg.innerHTML = ''; // clear existing
          
            let x0 = toPx('50vw', 'x');
            const y0 = toPx('0px', 'y');
            const x1 = toPx('50vw', 'x');
            const y1 = toPx('70vh', 'y');
            const y2 = toPx('100vh', 'y');
          
            ends.forEach((endX, i) => {
              const x2 = toPx(endX, 'x');
              const pathData = `M${x0},${y0} Q${x1},${y1} ${x2},${y2}`;
          
              const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
              path.setAttribute("d", pathData);
              path.setAttribute("fill", "none");
              path.setAttribute("stroke", "rgba(255,215,0,0.1)");
              svg.appendChild(path);
          
              const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              circle.setAttribute("r", 10);
              circle.style.offsetPath = `path('${pathData}')`;
              circle.style.animationDelay = `${i * 0.6}s`; // slight offset
              svg.appendChild(circle);
            });
          }
          
          updatePaths();
          window.addEventListener('resize', updatePaths);
          //================================================================

        }
      }, 800);
    }
  }
  if (clickCount === 4) {
    document.getElementById('piggy-tear').classList.add('animate');

    var secondPart = document.getElementsByClassName('second')[0];
    secondPart.style.opacity = 1; // Make sure opacity is set to 1 initially
    secondPart.style.transition = 'opacity 0.2s'; // Set the transition duration
    
    setTimeout(() => {
      secondPart.style.opacity = 0; // Fade out the element
      setTimeout(() => {
        secondPart.style.display = 'none'; // Display the element as none after fade-out
      }, 200); // Wait for 200ms after fade-out to display as none
      document.getElementById('container').style.display = 'none';
      document.getElementById('container').style.visibility = 'hidden';
      document.getElementById('pie-stats').style.display = 'none';
      document.getElementById('pie-stats').style.visibility = 'hidden';
      document.getElementById('donut-chart').style.display = 'none';
      document.getElementById('donut-chart').style.visibility = 'hidden';

      setTimeout(() => {
        document.getElementById('third-table').style.display = 'block'; 
        document.getElementById('third-table').classList.add('fadeIn');
      }, 400);
  
    }, 400);
  }
  if (clickCount === 5) {
    setTimeout(() => {
        window.location.href = 'psa.html';
      }, 10);
  }
});