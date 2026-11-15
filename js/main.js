document.getElementById('year').textContent=new Date().getFullYear();
const modal=document.getElementById('social-dialog');
document.querySelectorAll('[data-social]').forEach(button=>button.addEventListener('click',()=>{document.getElementById('social-message').textContent='Das '+button.dataset.social+'-Profil wird ergänzt, sobald die passende Adresse vorliegt.';
modal.showModal()}));
document.getElementById('close-dialog').addEventListener('click',()=>modal.close());
modal.addEventListener('click',event=>{if(event.target===modal){const rect=modal.getBoundingClientRect();
if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)modal.close()}});

// The original header scrolls with the banner; only upward scrolling fixes it.
const header = document.querySelector('header');
let lastScrollY = Math.max(0, window.scrollY);
let scrollFramePending = false;
let anchorNavigation = false;
let anchorTimer;
let upwardScrollDistance = 0;

function updateHeader() {
  const currentY = Math.max(0, window.scrollY);
  const headerHeight = header.offsetHeight;
  const delta = currentY - lastScrollY;

  const returningToTop = currentY === 0 &&
    (header.classList.contains('is-scrolled') || header.classList.contains('is-returning-top'));
  header.classList.toggle('is-returning-top', returningToTop);

  if (currentY === 0 || anchorNavigation) {
    header.classList.remove('is-scrolled');
    upwardScrollDistance = 0;
  } else if (delta > 0) {
    header.classList.remove('is-scrolled');
    upwardScrollDistance = 0;
  } else if (delta < 0) {
    upwardScrollDistance += -delta;
    if (upwardScrollDistance >= 60) {
      header.classList.add('is-scrolled');
    }
  }
  lastScrollY = currentY;

  header.inert = !header.classList.contains('is-scrolled') && currentY >= headerHeight;
  scrollFramePending = false;
}

window.addEventListener('scroll', () => {
  if (!scrollFramePending) {
    scrollFramePending = true;
    window.requestAnimationFrame(updateHeader);
  }
}, { passive: true });
window.addEventListener('resize', updateHeader);

// Leave anchor destinations unobstructed during navigation.
header.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    anchorNavigation = true;
    upwardScrollDistance = 0;
    clearTimeout(anchorTimer);
    header.classList.remove('is-scrolled');
    anchorTimer = setTimeout(() => {
      anchorNavigation = false;
      lastScrollY = Math.max(0, window.scrollY);
      updateHeader();
    }, 1200);
  });
});
updateHeader();
