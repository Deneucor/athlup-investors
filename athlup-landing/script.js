const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.closest('#invest')) startFundingAnimation();
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

let fundingStarted = false;
function startFundingAnimation(){
  if (fundingStarted) return;
  fundingStarted = true;
  const fill = document.querySelector('.fund-fill');
  const counter = document.querySelector('.counter');
  const text = document.getElementById('progressText');
  const target = Number(counter.dataset.target || 60);

  if (reduced) {
    fill.style.width = target + '%';
    counter.textContent = target;
    text.textContent = target + '%';
    return;
  }

  requestAnimationFrame(() => {
    fill.style.transition = 'width 1.8s cubic-bezier(.2,.8,.2,1)';
    fill.style.width = target + '%';
  });

  const duration = 1600;
  const start = performance.now();
  function tick(now){
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const value = Math.round(target * eased);
    counter.textContent = value;
    text.textContent = value + '%';
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const glow = document.getElementById('cursorGlow');
if (!reduced && window.innerWidth > 900) {
  window.addEventListener('pointermove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

document.querySelectorAll('.magnetic').forEach(btn => {
  if (reduced) return;
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * .08;
    const y = (e.clientY - r.top - r.height / 2) * .08;
    btn.style.transform = `translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

window.addEventListener('scroll', () => {
  if (reduced) return;
  const phone = document.querySelector('.phone');
  if (!phone || window.innerWidth < 900) return;
  const y = Math.min(window.scrollY * .018, 7);
  phone.style.transform = `rotate(${3-y*.22}deg) translateY(${-y}px)`;
}, {passive:true});


// V7 — flip cards: tap/click support for touch devices
document.querySelectorAll('.flip-card').forEach((card) => {
  card.addEventListener('click', () => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
      document.querySelectorAll('.flip-card.is-flipped').forEach((other) => {
        if (other !== card) other.classList.remove('is-flipped');
      });
      card.classList.toggle('is-flipped');
    }
  });
  card.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') &&
        window.matchMedia('(hover: none), (pointer: coarse)').matches) {
      e.preventDefault();
      card.click();
    }
  });
});
