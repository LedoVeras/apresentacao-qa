// Sistema de Login Funcional
class LoginSystem {
    constructor() {
        this.users = this.loadUsers();
        this.init();
    }

    // Carrega usuários do localStorage ou cria dados padrão
    loadUsers() {
        const savedUsers = localStorage.getItem('loginUsers');
        if (savedUsers) {
            return JSON.parse(savedUsers);
        }
        
        // Dados padrão
        const defaultUsers = {
            'admin': 'admin123',
            'usuario': 'senha123',
            'teste': 'teste123'
        };
        
        this.saveUsers(defaultUsers);
        return defaultUsers;
    }

    // Salva usuários no localStorage
    saveUsers(users) {
        localStorage.setItem('loginUsers', JSON.stringify(users || this.users));
    }

    // Atualiza senha de um usuário
    updatePassword(username, newPassword) {
        this.users[username] = newPassword;
        this.saveUsers();
    }

    // Verifica se o login é válido
    validateLogin(username, password) {
        return this.users[username] === password;
    }

    // Verifica se usuário existe
    userExists(username) {
        return this.users.hasOwnProperty(username);
    }

    // Inicializa o sistema baseado na página atual
    init() {
        const currentPage = this.getCurrentPage();
        
        switch(currentPage) {
            case 'index':
                this.initLoginPage();
                break;
            case 'esqueceu-senha':
                this.initForgotPasswordPage();
                break;
            case 'redefinir-senha':
                this.initResetPasswordPage();
                break;
        }
    }

    // Detecta a página atual
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().split('.')[0];
        
        if (filename === '' || filename === 'index') return 'index';
        if (filename === 'esqueceu-senha') return 'esqueceu-senha';
        if (filename === 'redefinir-senha') return 'redefinir-senha';
        
        return 'index';
    }

    // Inicializa página de login
    initLoginPage() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = form.querySelector('input[type="text"]').value.trim();
            const password = form.querySelector('input[type="password"]').value;
            
            if (this.validateLogin(username, password)) {
                this.showWelcomeAnimation(username);
            } else {
                this.showLoginError('Usuário ou senha incorretos!');
            }
        });
    }

    // Inicializa página de esqueci senha
    initForgotPasswordPage() {
        const form = document.getElementById('recoveryForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('recoveryMessage');
            const fakeLink = document.getElementById('fakeLink');
            
            // Simula verificação de email (mantém a lógica original)
            if (email === 'usuario@email.com') {
                message.style.color = 'green';
                message.textContent = 'Enviamos um link para o seu e-mail para redefinir sua senha.';
                fakeLink.style.display = 'block';
                
                // Salva o email para a próxima página
                sessionStorage.setItem('resetEmail', email);
            } else {
                message.style.color = 'red';
                message.textContent = 'E-mail não encontrado em nossa base de dados.';
                fakeLink.style.display = 'none';
            }
            
            message.style.display = 'block';
        });
    }

    // Inicializa página de redefinir senha
    initResetPasswordPage() {
        const form = document.getElementById('resetForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const novaSenha = document.getElementById('novaSenha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;
            const mensagem = document.getElementById('resetMessage');
            
            // Validação senha forte
            const senhaForte = novaSenha.length >= 8 && /\d/.test(novaSenha) && /[a-zA-Z]/.test(novaSenha);
            
            if (!senhaForte) {
                mensagem.textContent = 'A senha deve conter pelo menos 8 caracteres, incluindo letras e números.';
                mensagem.style.color = 'red';
            } else if (novaSenha !== confirmarSenha) {
                mensagem.textContent = 'As senhas não coincidem.';
                mensagem.style.color = 'red';
            } else {
                // Atualiza a senha do usuário (usa 'usuario' como padrão)
                this.updatePassword('usuario', novaSenha);
                
                mensagem.textContent = 'Senha redefinida com sucesso! Redirecionando para o login...';
                mensagem.style.color = 'green';
                
                // Redireciona após 2 segundos
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
            
            mensagem.style.display = 'block';
        });
    }

    // Mostra erro de login
    showLoginError(message) {
        // Remove erro anterior se existir
        const existingError = document.querySelector('.login-error');
        if (existingError) {
            existingError.remove();
        }

        // Cria novo elemento de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'login-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background: rgba(255, 82, 82, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 82, 82, 0.4);
            color: #ff5252;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
            animation: errorShake 0.5s ease-in-out;
        `;

        // Adiciona animação de erro
        const style = document.createElement('style');
        style.textContent = `
            @keyframes errorShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);

        // Adiciona ao container
        const container = document.querySelector('.container');
        container.appendChild(errorDiv);

        // Remove após 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Animação de boas-vindas espetacular
    showWelcomeAnimation(username) {
        // Cria overlay para a animação
        const overlay = document.createElement('div');
        overlay.className = 'welcome-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
        `;

        // Cria div de boas-vindas
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'welcome-message';
        welcomeDiv.innerHTML = `
            <h1>Seja Bem-vindo!</h1>
            <p>${username}</p>
        `;
        
        welcomeDiv.style.cssText = `
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
            backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.4);
            border-radius: 20px;
            padding: 3rem 4rem;
            text-align: center;
            color: white;
            font-family: 'Segoe UI', sans-serif;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            transform: translateY(-100vh) rotate(0deg) scale(0.1);
            animation: welcomeEntry 2s ease-out forwards;
        `;

        // Estilos para o conteúdo
        const welcomeStyles = document.createElement('style');
        welcomeStyles.textContent = `
            .welcome-message h1 {
                font-size: 3rem;
                margin-bottom: 1rem;
                font-weight: 300;
                text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                letter-spacing: 2px;
            }
            
            .welcome-message p {
                font-size: 1.5rem;
                margin: 0;
                opacity: 0.9;
                font-weight: 500;
                text-transform: capitalize;
            }

            @keyframes welcomeEntry {
                0% {
                    transform: translateY(-100vh) rotate(0deg) scale(0.1);
                    opacity: 0;
                }
                50% {
                    transform: translateY(0) rotate(720deg) scale(1.2);
                    opacity: 1;
                }
                70% {
                    transform: translateY(0) rotate(720deg) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(0) rotate(720deg) scale(1);
                    opacity: 1;
                }
            }

            @keyframes zoomAndFade {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                50% {
                    transform: scale(3);
                    opacity: 0.8;
                }
                100% {
                    transform: scale(10);
                    opacity: 0;
                }
            }

            @keyframes blackScreen {
                0% {
                    background: transparent;
                }
                100% {
                    background: #000;
                }
            }
        `;
        document.head.appendChild(welcomeStyles);

        // Adiciona elementos ao DOM
        overlay.appendChild(welcomeDiv);
        document.body.appendChild(overlay);

        // Sequência de animações
        setTimeout(() => {
            // Inicia zoom e fade
            welcomeDiv.style.animation = 'zoomAndFade 1.5s ease-in forwards';
            overlay.style.animation = 'blackScreen 1.5s ease-in forwards';
            
            // Adiciona efeito de escurecimento geral
            document.body.style.transition = 'filter 1.5s ease-in';
            document.body.style.filter = 'brightness(0)';
            
        }, 3000); // Espera 3 segundos após a entrada

        // Finaliza após 5 segundos totais
        setTimeout(() => {
            // Aqui você pode redirecionar para uma página de dashboard
            // ou fazer qualquer ação pós-login
            console.log('Login realizado com sucesso!');
            
            // Exemplo: redirecionar para dashboard
            // window.location.href = 'dashboard.html';
            
            // Ou restaurar a tela (para demonstração)
            this.resetScreen();
        }, 5000);
    }

    // Restaura a tela (para demonstração)
    resetScreen() {
        const overlay = document.querySelector('.welcome-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        document.body.style.filter = '';
        document.body.style.transition = '';
        
        // Mostra mensagem de sucesso
        const container = document.querySelector('.container');
        container.innerHTML = `
            <h2>Login Realizado!</h2>
            <p style="color: rgba(255, 255, 255, 0.9); margin-bottom: 2rem;">
                Bem-vindo ao sistema!
            </p>
            <button onclick="location.reload()" style="
                padding: 1rem 2rem;
                border: none;
                border-radius: 12px;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.4);
                color: #fff;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
            ">
                Fazer Login Novamente
            </button>
        `;
    }
}

// Inicializa o sistema quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});

// Função auxiliar para mostrar credenciais de teste
function showTestCredentials() {
    const loginSystem = new LoginSystem();
    const users = loginSystem.users;
    
    let credentialsText = 'Credenciais de teste disponíveis:\n\n';
    for (const [username, password] of Object.entries(users)) {
        credentialsText += `Usuário: ${username} | Senha: ${password}\n`;
    }
    
    alert(credentialsText);
}

// Adiciona botão de ajuda (opcional)
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index') || window.location.pathname === '/') {
        const container = document.querySelector('.container');
        const helpButton = document.createElement('button');
        helpButton.textContent = 'Ver Credenciais de Teste';
        helpButton.style.cssText = `
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        helpButton.addEventListener('click', showTestCredentials);
        helpButton.addEventListener('mouseover', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        helpButton.addEventListener('mouseout', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        container.appendChild(helpButton);
    }
});