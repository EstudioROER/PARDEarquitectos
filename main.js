// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Once visible, stop observing
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Select all elements to reveal
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Form Handling
    const form = document.getElementById('pardeForm');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Visual feedback
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerText = '¡Mensaje Enviado!';
                submitBtn.style.background = '#059669'; // Success green
                form.reset();

                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // WhatsApp Menu Toggle & Outside Click
    const waMenu = document.getElementById('waMenu');
    if (waMenu) {
        document.addEventListener('click', (e) => {
            const isClickInside = waMenu.contains(e.target);
            if (!isClickInside) {
                waMenu.classList.remove('active');
            }
        });
    }
});

/**
 * LEAD AUTOMATION (Make.com Bridge)
 * Esta función envía los datos de los formularios y la calculadora a Make.com
 */
const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/2vpa2gy1rd8xfiyhjw9w8jby32hcjqnm"; // Lead Automation URL

async function sendLeadToMake(data) {
    if (!MAKE_WEBHOOK_URL) {
        console.warn("Make.com Webhook URL no configurada. El lead se guardó localmente en consola:", data);
        return { success: true, local: true };
    }

    try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
                source: window.location.pathname
            })
        });
        return { success: response.ok };
    } catch (error) {
        console.error("Error enviando lead a Make.com:", error);
        return { success: false };
    }
}

// Update existing pardeForm to send to Make
document.addEventListener('submit', async (e) => {
    if (e.target.id === 'pardeForm' || e.target.closest('#pardeForm')) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        await sendLeadToMake({ type: 'contact_form', ...data });
    }
});
