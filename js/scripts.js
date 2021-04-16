const button = document.querySelector('button');
const arrow = document.querySelector('.arrow');
 
document.onload = animateArraw();
button.addEventListener('click', handleClick);
 
function handleClick(e) {
    e.preventDefault();
    const main = document.querySelector('main');
    const offsetTop = main.offsetTop;
 
  scroll({
    top: offsetTop,
    behavior: 'smooth'
  });
}


function animateArraw() {
    setInterval(() =>
        setTimeout(() => {
            arrow.classList.toggle('jump');
        }, 1000)
    , 1500);
    
}
