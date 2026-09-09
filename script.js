// Interaktivní chování navigace při scrollování (dynamický stín a zmenšení)
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 30) {
        navbar.classList.add('py-2');
        navbar.classList.remove('py-4');
    } else {
        navbar.classList.add('py-4');
        navbar.classList.remove('py-2');
    }
});

// Aplikování dynamického zvýraznění aktivní sekce v navigaci
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-blue-400', 'font-semibold');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('text-blue-400', 'font-semibold');
        }
    });
});
