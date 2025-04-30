let clickCount = 0;
document.addEventListener('click', function () {
  clickCount++;

  if (clickCount === 1) {
    document.getElementById('intro').classList.add('transition-out');
    document.getElementById('intro').classList.add('fade-out');
    setTimeout(() => {
      const s1 = document.getElementById('s1');
      s1.style.display = 'block';
      s1.classList.add('visible');
    
      const paragraph1 = s1.querySelector('p');
      if (paragraph1) {
        typewriterEffect(paragraph1, paragraph1.textContent);
      }
    
      // Set a customizable delay for the anchor tag
      const anchor = s1.querySelector('a');
      if (anchor) {
        setTimeout(() => {
          anchor.classList.add('visible');
        }, 2700); // Change 1000ms (1 second) to any time you'd like
      }
    }, 501);
  }
  else if (clickCount === 2) {
    document.getElementById('s1').classList.remove('visible');
    setTimeout(function() {
      console.log("2nd scene shoulda loaded now"); 
      document.getElementById('s2').style.display = 'block';
    }, 501);
   
  }

  
  else if (clickCount === 3) {
    console.log("third scene");
    setTimeout(() => {
      window.location.href = 'stats.html';
    }, 10);
    
  }
  

});

function typewriterEffect(element, text, speed = 25) {
  element.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i === text.length) {
      clearInterval(interval);
    }
  }, speed);
}