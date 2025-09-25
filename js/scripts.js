// ELEMENTOS DO DOM - Selecionando elementos principais da página
const menuToggle = document.querySelector('.menu-toggle');        // Botão do menu mobile (hamburger)
const menu = document.querySelector('.menu');                     // Lista do menu de navegação
const header = document.querySelector('.cabecalho');              // Cabeçalho da página
const scrollIndicator = document.querySelector('.scroll-indicator'); // Indicador de scroll na hero section
const contatoForm = document.getElementById('contatoForm');       // Formulário de contato

// MENU MOBILE - Controle do menu hamburger
menuToggle.addEventListener('click', () => {
    // Alterna as classes para mostrar/esconder o menu mobile
    menuToggle.classList.toggle('active');    // Anima o ícone hamburger
    menu.classList.toggle('active');          // Mostra/esconde o menu
    document.body.classList.toggle('menu-open'); // Previne scroll quando menu está aberto
    
    // Adiciona efeito de vibração em dispositivos móveis
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
});

// Fechar menu mobile ao clicar nos links de navegação
const menuLinks = document.querySelectorAll('.menu a');;
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Remove todas as classes ativas para fechar o menu
        menuToggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});


// EFEITO DE SCROLL NO CABEÇALHO
let lastScrollTop = 0; // Armazena a última posição de scroll
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Adiciona classe 'scrolled' quando o usuário rola mais de 100px
    // Isso muda a aparência do cabeçalho (fundo mais transparente)
    if (scrollTop > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Esconde o indicador de scroll quando o usuário rola mais de 200px
    // Para não atrapalhar a navegação
    if (scrollTop > 100) {
        scrollIndicator.style.opacity = '0';
    } else {
        scrollIndicator.style.opacity = '1';;
    }
    
    lastScrollTop = scrollTop; // Atualiza a posição de scroll
});

// SCROLL SUAVE - Navegação suave entre seções
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Previne o comportamento padrão do link
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight; // Altura do cabeçalho fixo
            const targetPosition = target.offsetTop - headerHeight; // Posição ajustada
            
            // Scroll suave até a seção desejada
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// INDICADOR DE SCROLL - Clique para ir aos serviços
scrollIndicator.addEventListener('click', () => {
    const servicosSection = document.getElementById('servicos');
    const headerHeight = header.offsetHeight;
    const targetPosition = servicosSection.offsetTop - headerHeight;
    
    // Scroll suave até a seção de serviços
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
});


// OBSERVADOR DE INTERSEÇÃO - Animações ao rolar a página
const observerOptions = {
    threshold: 0.1,                    // Elemento deve estar 10% visível para ativar
    rootMargin: '0px 0px -50px 0px'    // Margem de 50px do bottom para ativar antes
};

// Cria o observador que detecta quando elementos entram na tela
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Quando o elemento fica visível, anima ele
            entry.target.style.opacity = '1';;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplica animação de entrada em elementos específicos
const animatedElements = document.querySelectorAll('.card, .depoimento, .horario-card, .info-item, .stat');
animatedElements.forEach(el => {
    // Define estado inicial (invisível e deslocado para baixo)
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    // Adiciona o elemento ao observador
    observer.observe(el);
});

// FORMULÁRIO DE CONTATO - Validação e envio
if (contatoForm) {
    contatoForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Previne o envio padrão do formulário
        
        // Coleta os dados do formulário
        const formData = new FormData(this);
        const nome = formData.get('nome');
        const email = formData.get('email');
        const telefone = formData.get('telefone');
        const mensagem = formData.get('mensagem');
        
        // Validação dos campos obrigatórios
        if (!nome || !email || !mensagem) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Validação do formato do e-mail
        if (!isValidEmail(email)) {
            showNotification('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        // Simula o envio do formulário
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Muda o botão para estado de carregamento
        submitBtn.textContent = 'Enviando...';;
        submitBtn.disabled = true;
        
        // Simula uma chamada para API (2 segundos de delay)
        setTimeout(() => {
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            this.reset(); // Limpa o formulário
            submitBtn.textContent = originalText; // Restaura texto original
            submitBtn.disabled = false; // Reabilita o botão
        }, 2000);
    });
}


// VALIDAÇÃO DE E-MAIL - Função para verificar formato válido
function isValidEmail(email) {
    // Regex que verifica se o e-mail tem formato válido
    // Regex é uma sequência que define um padrão de busca, usada para validar, buscar e manipular texto em strings.
    // No caso usarei para validação do formato correto do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// SISTEMA DE NOTIFICAÇÕES - Feedback visual para o usuário
function showNotification(message, type = 'info') {
    // Remove notificações existentes para evitar sobreposição
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Cria o elemento da notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Define estilos da notificação baseado no tipo
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2E8B57' : type === 'error' ? '#E74C3C' : '#3498DB'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Adiciona a notificação ao corpo da página
    document.body.appendChild(notification);
    
    // Anima a entrada da notificação (desliza da direita)
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Funcionalidade do botão de fechar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ANIMAÇÃO DE CARREGAMENTO - Efeitos quando a página carrega
window.addEventListener('load', () => {
    // Adiciona classe para indicar que a página carregou completamente
    document.body.classList.add('loaded');
    
    // Anima o conteúdo da seção hero
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        // Define estado inicial (invisível e deslocado)
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        
        // Anima após um pequeno delay para melhor efeito
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});


// EFEITOS DE HOVER - Interatividade nos cards
document.querySelectorAll('.card').forEach(card => {
    // Efeito quando o mouse entra no card
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    // Efeito quando o mouse sai do card
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});


// EFEITO RIPPLE NOS BOTÕES - Animação ao clicar
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Cria elemento para o efeito ripple
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        // Calcula posição do clique relativa ao botão
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        // Define estilos do efeito ripple
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        // Prepara o botão para o efeito
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        // Remove o elemento após a animação
        setTimeout(() => ripple.remove(), 600);
    });
});


// ESTILOS CSS DINÂMICOS - Adiciona estilos via JavaScript

const style = document.createElement('style');
style.textContent = `
    /* Animação do efeito ripple nos botões */
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Classe para indicar que a página carregou */
    .loaded {
        opacity: 1;
    }
    
    /* Previne scroll quando menu mobile está aberto */
    body.menu-open {
        overflow: hidden;
    }
    
    /* Layout do conteúdo da notificação */
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    /* Estilo do botão de fechar notificação */
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2em;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
`;
document.head.appendChild(style);


// BARRA DE PROGRESSO DE SCROLL - Indicador visual do progresso
function createScrollProgress() {
    // Cria a barra de progresso
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #2E8B57, #4ECDC4);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    // Atualiza a largura da barra baseado no scroll
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Inicializa a barra de progresso
createScrollProgress();

// DETECÇÃO DE DISPOSITIVOS MÓVEIS
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
}

// MELHORIAS PARA DISPOSITIVOS MÓVEIS
if (isMobileDevice()) {
    // Adiciona classe para identificar dispositivos móveis
    document.body.classList.add('mobile-device');
    
    // Melhora a performance em dispositivos móveis
    document.querySelectorAll('.card, .depoimento, .horario-card').forEach(element => {
        element.style.willChange = 'transform';
    });
    
    // Otimiza animações para dispositivos móveis
    const style = document.createElement('style');
    style.textContent = `
        .mobile-device .card:hover,
        .mobile-device .depoimento:hover,
        .mobile-device .horario-card:hover {
            transform: none;
        }
        
        .mobile-device .card:active,
        .mobile-device .depoimento:active,
        .mobile-device .horario-card:active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
        }
    `;
    document.head.appendChild(style);
}

// PREVENÇÃO DE ZOOM DUPLO TOQUE EM DISPOSITIVOS MÓVEIS
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// MENSAGEM DE CONSOLE - Confirmação de carregamento
console.log('🐾 Mundo Animals - Site carregado com sucesso!');

