// JavaScript para funcionalidades do site
document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile responsivo
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Adicionar classe ativa ao link da página atual
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Animação de entrada para cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar cards de acomodações
    document.querySelectorAll('.accommodation-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Efeito parallax suave no hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Adicionar efeito hover melhorado nos botões
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Menu dropdown para mobile
    const dropdown = document.querySelector('.dropdown');
    if (dropdown && window.innerWidth <= 768) {
        const dropdownLink = dropdown.querySelector('.nav-link');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        dropdownLink.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Lazy loading para imagens
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Formulário de contato - Redirecionamento para WhatsApp
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validação básica
            if (!data.name || !data.email || !data.message) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Formatar mensagem para WhatsApp
            const whatsappMessage = `Olá! Gostaria de fazer uma reserva na Pousada da Praia.

*Dados do hóspede:*
• Nome: ${data.name}
• WhatsApp: ${data.whatsapp || 'Não informado'}
• E-mail: ${data.email}

*Mensagem:*
${data.message}

Aguardo retorno!`;
            
            // Número do WhatsApp da pousada
            const whatsappNumber = '559896054738';
            
            // Codificar mensagem para URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Criar URL do WhatsApp
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Abrir WhatsApp em nova aba
            window.open(whatsappUrl, '_blank');
            
            // Feedback visual
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Redirecionando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Galeria de imagens das acomodações - Sistema de miniaturas
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainGalleryImage = document.getElementById('main-gallery-image');
    
    console.log('Thumbnails encontradas:', thumbnails.length);
    console.log('Imagem principal encontrada:', mainGalleryImage);
    
    if (thumbnails.length > 0 && mainGalleryImage) {
        // Garantir que a imagem inicial seja exibida
        mainGalleryImage.style.opacity = '1';
        mainGalleryImage.style.display = 'block';
        
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Remover classe active de todas as miniaturas
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                
                // Adicionar classe active na miniatura clicada
                this.classList.add('active');
                
                // Trocar a imagem principal
                const newSrc = this.getAttribute('data-full');
                const newAlt = this.getAttribute('alt');
                
                console.log('Trocando para:', newSrc);
                
                // Efeito de fade out/in
                mainGalleryImage.style.opacity = '0';
                
                setTimeout(() => {
                    mainGalleryImage.src = newSrc;
                    mainGalleryImage.alt = newAlt;
                    mainGalleryImage.style.opacity = '1';
                }, 150);
            });
        });
    }
    
    // Funcionalidades do botão WhatsApp
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        // Adicionar efeito de clique
        whatsappBtn.addEventListener('click', function() {
            // Adicionar classe para animação de clique
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
            
            // Analytics - você pode adicionar tracking aqui
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'WhatsApp',
                    event_label: 'Floating Button'
                });
            }
        });
        
        // Manter botão sempre visível
        whatsappBtn.style.transform = 'translateY(0)';
        whatsappBtn.style.opacity = '1';
        
        // Adicionar tooltip no hover
        whatsappBtn.addEventListener('mouseenter', function() {
            if (!this.querySelector('.whatsapp-tooltip')) {
                const tooltip = document.createElement('div');
                tooltip.className = 'whatsapp-tooltip';
                tooltip.textContent = 'Fale conosco no WhatsApp!';
                this.appendChild(tooltip);
            }
        });
        
        whatsappBtn.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.whatsapp-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
        
        // Botão sempre visível em todos os dispositivos
    }
});

// Função para mostrar/ocultar menu mobile
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Função para fechar menu mobile ao clicar em um link
function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.remove('active');
}
