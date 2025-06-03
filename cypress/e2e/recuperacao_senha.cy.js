// cypress/e2e/recovery.cy.js
describe('Fluxo de Recuperação de Senha', () => {
  const delayType = { delay: 150 }; // Delay na digitação
  const waitTime = 500; // Delay entre ações

  context('Página Esqueci Minha Senha', () => {
    beforeEach(() => {
      cy.visit('http://127.0.0.1:8080/esqueceu-senha.html')
      cy.wait(waitTime);
    });

    it('Deve exibir mensagem de erro para e-mail não cadastrado', () => {
      cy.get('#email').type('naoexiste@teste.com', delayType);
      cy.wait(waitTime);
      cy.contains('Enviar link de recuperação').click();
      cy.wait(waitTime);

      cy.get('#recoveryMessage')
        .should('be.visible')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('contain', 'E-mail não encontrado');

      cy.wait(waitTime);
      cy.get('#fakeLink').should('not.be.visible');
    });

    it('Deve simular envio com e-mail válido', () => {
      cy.get('#email').type('usuario@email.com', delayType);
      cy.wait(waitTime);
      cy.contains('Enviar link de recuperação').click();
      cy.wait(waitTime);

      cy.get('#recoveryMessage')
        .should('be.visible')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('contain', 'Enviamos um link');

      cy.wait(waitTime);
      cy.get('#fakeLink').should('be.visible');
    });

    it('Deve conter link para redefinir senha', () => {
      cy.get('#email').type('usuario@email.com', delayType);
      cy.wait(waitTime);
      cy.contains('Enviar link de recuperação').click();
      cy.wait(waitTime);

      cy.get('#fakeLink a')
        .should('have.attr', 'href', 'redefinir-senha.html')
        .click();

      cy.wait(waitTime);
      cy.url().should('include', 'redefinir-senha.html');
      cy.contains('Redefinir Senha').should('be.visible');
    });
  });

  context('Página Redefinir Senha', () => {
    beforeEach(() => {
      cy.visit('redefinir-senha.html');
      cy.wait(waitTime);
    });

    it('Deve validar força da senha', () => {
      cy.get('#novaSenha').type('fraca', delayType);
      cy.wait(waitTime);
      cy.get('#confirmarSenha').type('fraca', delayType);
      cy.wait(waitTime);
      cy.contains('Redefinir senha').click();
      cy.wait(waitTime);

      cy.get('#resetMessage')
        .should('be.visible')
        .and('contain', 'pelo menos 8 caracteres');
    });

    it('Deve validar coincidência de senhas', () => {
      cy.get('#novaSenha').type('SenhaValida123', delayType);
      cy.wait(waitTime);
      cy.get('#confirmarSenha').type('Diferente123', delayType);
      cy.wait(waitTime);
      cy.contains('Redefinir senha').click();
      cy.wait(waitTime);

      cy.get('#resetMessage')
        .should('be.visible')
        .and('contain', 'As senhas não coincidem');
    });

    it('Deve permitir redefinição com senha válida', () => {
      const novaSenha = 'NovaSenha123';

      cy.get('#novaSenha').type(novaSenha, delayType);
      cy.wait(waitTime);
      cy.get('#confirmarSenha').type(novaSenha, delayType);
      cy.wait(waitTime);
      cy.contains('Redefinir senha').click();
      cy.wait(waitTime);

      cy.get('#resetMessage')
        .should('be.visible')
        .and('contain', 'Senha redefinida com sucesso');

      cy.url().should('include', 'index.html', { timeout: 3000 });
    });
  });

  context('Fluxo Completo', () => {
    it('Deve completar todo o ciclo de recuperação', () => {
      // 1. Inicia na página de login
      cy.visit('index.html');
      cy.wait(waitTime);
      cy.contains('Esqueci minha senha').click();
      cy.wait(waitTime);

      // 2. Preenche e-mail de recuperação
      cy.url().should('include', 'esqueceu-senha.html');
      cy.get('#email').type('usuario@email.com', delayType);
      cy.wait(waitTime);
      cy.contains('Enviar link de recuperação').click();
      cy.wait(waitTime);

      // 3. Acessa link de redefinição
      cy.get('#fakeLink a').click();
      cy.wait(waitTime);

      // 4. Redefine a senha
      const novaSenha = 'NovaSenha456';
      cy.get('#novaSenha').type(novaSenha, delayType);
      cy.wait(waitTime);
      cy.get('#confirmarSenha').type(novaSenha, delayType);
      cy.wait(waitTime);
      cy.contains('Redefinir senha').click();
      cy.wait(waitTime);

      // 5. Verifica se voltou ao login
      cy.url().should('include', 'index.html');
      cy.wait(waitTime);

      // 6. Testa login com a nova senha
      cy.get('input[type="text"]').type('usuario', delayType);
      cy.wait(waitTime);
      cy.get('input[type="password"]').type(novaSenha, delayType);
      cy.wait(waitTime);
      cy.contains('Entrar').click();
      cy.wait(waitTime);

      // Verifica animação de sucesso
      cy.get('.welcome-overlay').should('exist');
    });
  });
});
