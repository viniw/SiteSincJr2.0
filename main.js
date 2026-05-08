document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    // Alterna o menu mobile ao clicar no ícone de hambúrguer
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animação manual das barras do hambúrguer para formar um 'X'
        const bars = document.querySelectorAll('.bar');
        if (navLinks.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const bars = document.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // Adiciona uma classe ao navbar quando o usuário rola a página para baixo
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled'); // Aplica fundo escuro/blur
        } else {
            navbar.classList.remove('scrolled'); // Volta ao estado transparente
        }
    });

    // Configuração do Intersection Observer para revelar elementos conforme o scroll
    const observerOptions = {
        root: null, // Usa a viewport como referência
        rootMargin: '0px',
        threshold: 0.15 // Dispara quando 15% do elemento estiver visível
    };
    
    // Callback que adiciona a classe 'visible' para disparar as animações CSS
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Para de observar após a primeira animação
            }
        });
    }, observerOptions);

    document.querySelectorAll('.slide-up').forEach(element => {
        observer.observe(element);
    });

    // Form Submission (Functional with FormSubmit.co)
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Enviando...';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            fetch("https://formsubmit.co/ajax/marketing@sincjr.com.br", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    btn.textContent = 'Mensagem Enviada!';
                    btn.style.backgroundColor = '#27c93f'; // Success green
                    form.reset();

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.opacity = '1';
                        btn.style.backgroundColor = ''; // Revert to primary
                    }, 4000);
                })
                .catch(error => {
                    btn.textContent = 'Erro ao enviar';
                    btn.style.backgroundColor = '#ff5f56'; // Error red
                    console.error('Error:', error);

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.opacity = '1';
                        btn.style.backgroundColor = '';
                    }, 4000);
                });
        });
    }

});
