// set custom css variable to 1% of visable screen
// this will account for mobile browser notch
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

const button = document.querySelector('button');
const arrow = document.querySelector('.arrow');
 
document.onload = animateArraw();
button.addEventListener('click', handleClick);


// scroll to content when clicking the arrow on intro page
function handleClick(e) {
    e.preventDefault();
    const main = document.querySelector('main');
    const offsetTop = main.offsetTop;
 
  scrollTo({
    top: offsetTop,
    behavior: 'smooth'
  });
}

// intro page arrow animation
function animateArraw() {
    setInterval(() =>
        setTimeout(() => {
            arrow.classList.toggle('jump');
        }, 1000)
    , 1500);
    
}
