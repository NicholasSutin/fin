document.addEventListener('DOMContentLoaded', () => {
    let triggered = false;
    let gestureReady = false;
    let hasPlayed = false; // Track if the video has been played after fullscreen
    
    // Capture a trusted user gesture (pointerdown) to allow fullscreen later
    function onUserGesture() {
      gestureReady = true;
      document.removeEventListener('pointerdown', onUserGesture);
    }
    document.addEventListener('pointerdown', onUserGesture, { once: true });
  
    const video = document.getElementById('banner-video');
    if (video) {
      // Clicking the video: fullscreen then after 1ms play
      video.addEventListener('click', () => {
        const requestFull =
          video.requestFullscreen ||
          video.webkitRequestFullscreen ||
          video.mozRequestFullScreen ||
          video.msRequestFullscreen;
        if (requestFull) {
          requestFull.call(video).catch(err =>
            console.error('Fullscreen request failed on click:', err)
          );
        }
        setTimeout(() => {
          video.play().catch(err =>
            console.error('Error playing video on click:', err)
          );
        }, 1);
  
        hasPlayed = true; // Mark as played after click
      });
  
      // Listen for fullscreen change events to pause on exit and restore scroll
      function onFullscreenChange() {
        const isFull =
          document.fullscreenElement === video ||
          document.webkitFullscreenElement === video ||
          document.mozFullScreenElement === video ||
          document.msFullscreenElement === video;
        if (!isFull) {
          // Pause video on fullscreen exit
          video.pause();
          
          // After exiting fullscreen, restore scroll to 100vh
          window.scrollTo({ top: window.innerHeight });
        }
      }
  
      document.addEventListener('fullscreenchange', onFullscreenChange);
      document.addEventListener('webkitfullscreenchange', onFullscreenChange);
      document.addEventListener('mozfullscreenchange', onFullscreenChange);
      document.addEventListener('MSFullscreenChange', onFullscreenChange);
  
      // Disable hover/scroll-based play after the first fullscreen exit
      function handleScroll() {
        if (
          triggered ||
          window.scrollY <= 200 ||
          hasPlayed ||
          (window.scrollY + window.innerHeight / 2) > document.body.scrollHeight / 2
        ) return;
        
        triggered = true;
        window.removeEventListener('scroll', handleScroll);
  
        // Smooth scroll to 100vh
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  
        // Wait for smooth scroll to finish
        function checkScrollEnd() {
          if (Math.abs(window.scrollY - window.innerHeight) < 2) {
            window.removeEventListener('scroll', checkScrollEnd);
            if (!video) return;
  
            // Fullscreen first (requires gestureReady)
            if (gestureReady) {
              const requestFull =
                video.requestFullscreen ||
                video.webkitRequestFullscreen ||
                video.mozRequestFullScreen ||
                video.msRequestFullscreen;
              if (requestFull) {
                requestFull.call(video).catch(err =>
                  console.error('Fullscreen request failed:', err)
                );
              }
            } else {
              console.warn('Fullscreen blocked: no user gesture detected.');
            }
  
            // Then wait 1ms before playback
            setTimeout(() => {
              video.play().catch(err =>
                console.error('Error playing video:', err)
              );
            }, 1);
          }
        }
        window.addEventListener('scroll', checkScrollEnd);
      }
  
      window.addEventListener('scroll', handleScroll);
    }
  });
  //===============================================================================================================================================
  document.addEventListener('DOMContentLoaded', () => {
    const screw = document.querySelector('.parallaxHolder svg#screw');
    if (!screw) return;
  
    // cache viewport-height in px
    const getVH = () => window.innerHeight;
  
    // scroll handler with rAF to keep it smooth
    let ticking = false;
    const onScroll = () => {
      const scrollY = window.scrollY;
      const start = 2 * getVH();  // 200vh
      const end   = 3 * getVH();  // 400vh
  
      let rotation = 0;
      if (scrollY > start) {
        // progress ∈ [0,1]
        const progress = Math.min((scrollY - start) / (end - start), 1);
        rotation = progress * 360;
      }
  
      screw.style.transform = `rotate(${rotation}deg)`;
      ticking = false;
    };
  
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    });
  
    // run once in case the page is already scrolled
    onScroll();
  });
  //======================================================================================
  document.addEventListener('scroll', () => {
    const menu = document.querySelector('.menu');
    
    if (window.scrollY > 200) {
      // Fade out the menu when scrolled past 200px
      menu.style.transition = 'opacity 0.5s ease'; // smooth fade effect
      menu.style.opacity = '0'; // make it fade out
    } else {
      // Make the menu fully visible again when scrolled back above 200px
      menu.style.transition = 'opacity 0.5s ease'; // smooth fade effect
      menu.style.opacity = '1'; // ensure it's visible
    }
  });
  //============================================================================================
// grab references
const holder = document.querySelector('.parallaxHolder1');
const star   = document.getElementById('star');

// parallax speed (0.1 = subtle, 0.5 = half-speed, 1 = lock to scroll)
const speed = 0.3;

// throttle rAF
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
});

function updateParallax() {
  const rect = holder.getBoundingClientRect();

  // only if any part of it is in view
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    // raw progress: 0 when top at bottom of viewport → 1 when top hits top
    let progress = 1 - rect.top / window.innerHeight;

    // clamp to [0,1]
    progress = Math.min(Math.max(progress, 0), 1);

    // compute vertical shift
    const translateY = progress * holder.offsetHeight * speed;

    // scale: from 1 → 3
    const scale = 1 + 2 * progress;

    // opacity: from 1 → 0
    const opacity = 1 - progress;

    // apply both translate & scale, plus opacity
    star.style.transform = `translateX(-50%) translateY(${translateY}px) scale(${scale})`;
    star.style.opacity   = opacity;
  }
}
//=============================================================
// helper to get the “full” page height in a cross-browser way
let reachedBottom = false;
function getPageHeight() {
    const body   = document.body;
    const html   = document.documentElement;
    return Math.max(
      body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight
    );
  }
  
  // returns true once you’re scrolled all the way down
  function isAtPageBottom() {
    const scrollY       = window.scrollY || window.pageYOffset;
    const visibleHeight = window.innerHeight;
    const pageHeight    = getPageHeight();
    return scrollY + visibleHeight >= pageHeight;
  }
  
  // listen (with rAF for better performance)
  let ticking2 = false;
  window.addEventListener('scroll', () => {
    if (!ticking2) {
      window.requestAnimationFrame(() => {
        if (isAtPageBottom()) {
          console.log('👣 You’ve reached the bottom!');
          document.getElementById('credits').classList.add('faded');
          reachedBottom = true;
        }
        ticking2 = false;
      });
      ticking2 = true;
    }
  });
  if (reachedBottom === true){
    document.getElementById('credits').classList.add('faded');
    console.log("reachedbottom")
  }



  // (append to the end of hero.js)
let lastSlidesShown = false;
const lastSlides = document.getElementById('last-slides');

function fadeInLastSlides() {
  lastSlides.style.display = 'flex';
  requestAnimationFrame(() => {
    lastSlides.style.transition = 'opacity 0.8s ease';
    lastSlides.style.opacity = '1';
  });
  lastSlidesShown = true;
}

function fadeOutLastSlides() {
  lastSlides.style.transition = 'opacity 0.5s ease';
  lastSlides.style.opacity = '0';
  setTimeout(() => {
    lastSlides.style.display = 'none';
  }, 500);
  lastSlidesShown = false;
}

function checkLastSlidesVisibility() {
  const scrollY = window.scrollY || window.pageYOffset;
  const visibleHeight = window.innerHeight;
  const pageHeight = getPageHeight();

  if (!lastSlidesShown && scrollY + visibleHeight >= pageHeight) {
    fadeInLastSlides();
  } else if (lastSlidesShown && scrollY + visibleHeight < pageHeight - 80) {
    fadeOutLastSlides();
  }
}

window.addEventListener('scroll', () => {
  requestAnimationFrame(checkLastSlidesVisibility);
});
//===========================================================================================================================================================================================
let currentSlide = 0;

function nextSlide() {
    const container = document.getElementById('last-slides');
    const wrapper = container.querySelector('.slide-wrapper');
    currentSlide = (currentSlide + 1) % wrapper.children.length;
    wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;

    currentSlide = (currentSlide + 1) % slides.length;
    slides.forEach((s, i) => {
        s.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
    });
}

function autoSlide() {
    const container = document.getElementById('last-slides');
    const rect = container.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!isVisible) return;

    nextSlide();
}

setInterval(autoSlide, 5000);
