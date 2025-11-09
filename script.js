// Track mouse movement and update shimmer position
const shimmer = document.getElementById('shimmer');
let mouseX = 0;
let mouseY = 0;
let shimmerX = 0;
let shimmerY = 0;

// Update shimmer position with smooth easing
function updateShimmer() {
    // Smooth easing for natural movement
    shimmerX += (mouseX - shimmerX) * 0.1;
    shimmerY += (mouseY - shimmerY) * 0.1;
    
    shimmer.style.left = shimmerX + 'px';
    shimmer.style.top = shimmerY + 'px';
    
    requestAnimationFrame(updateShimmer);
}

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    shimmer.classList.add('visible');
});

// Hide shimmer when mouse leaves the window
document.addEventListener('mouseleave', () => {
    shimmer.classList.remove('visible');
});

// Start the animation loop
updateShimmer();

