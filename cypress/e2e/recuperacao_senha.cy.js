// cypress/e2e/recovery.cy.js
describe('Fluxo de Recuperação de Senha', () => {
  context('Página Esqueci Minha Senha', () => {
    beforeEach(() => {
      cy.visit('http://127.0.0.1:8080/esqueceu-senha.html')
    })

    it('Deve exibir mensagem de erro para e-mail não cadastrado', () => {
      cy.get('#email').type('naoexiste@teste.com')
      cy.contains('Enviar link de recuperação').click()
      
      cy.get('#recoveryMessage')
        .should('be.visible')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('contain', 'E-mail não encontrado')
      
      cy.get('#fakeLink').should('not.be.visible')
    })

    it('Deve simular envio com e-mail válido', () => {
      cy.get('#email').type('usuario@email.com')
      cy.contains('Enviar link de recuperação').click()
      
      cy.get('#recoveryMessage')
        .should('be.visible')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('contain', 'Enviamos um link')
      
      cy.get('#fakeLink').should('be.visible')
    })

    it('Deve conter link para redefinir senha', () => {
      cy.get('#email').type('usuario@email.com')
      cy.contains('Enviar link de recuperação').click()
      
      cy.get('#fakeLink a')
        .should('have.attr', 'href', 'redefinir-senha.html')
        .click()
      
      cy.url().should('include', 'redefinir-senha.html')
      cy.contains('Redefinir Senha').should('be.visible')
    })
  })

  context('Página Redefinir Senha', () => {
    beforeEach(() => {
      cy.visit('redefinir-senha.html')
    })

    it('Deve validar força da senha', () => {
      cy.get('#novaSenha').type('fraca')
      cy.get('#confirmarSenha').type('fraca')
      cy.contains('Redefinir senha').click()
      
      cy.get('#resetMessage')
        .should('be.visible')
        .and('contain', 'pelo menos 8 caracteres')
    })

    it('Deve validar coincidência de senhas', () => {
      cy.get('#novaSenha').type('SenhaValida123')
      cy.get('#confirmarSenha').type('Diferente123')
      cy.contains('Redefinir senha').click()
      
      cy.get('#resetMessage')
        .should('be.visible')
        .and('contain', 'As senhas não coincidem')
    })

    it('Deve permitir redefinição com senha válida', () => {
      const novaSenha = 'NovaSenha123'
      
      cy.get('#novaSenha').type(novaSenha)
      cy.get('#confirmarSenha').type(novaSenha)
      cy.contains('Redefinir senha').click()
      
      cy.get('#resetMessage')
        .should('be.visible')
        .and('contain', 'Senha redefinida com sucesso')
      
      cy.url().should('include', 'index.html', { timeout: 3000 })
    })
  })

  context('Fluxo Completo', () => {
    it('Deve completar todo o ciclo de recuperação', () => {
      // 1. Inicia na página de login
      cy.visit('index.html')
      cy.contains('Esqueci minha senha').click()
      
      // 2. Preenche e-mail de recuperação
      cy.url().should('include', 'esqueceu-senha.html')
      cy.get('#email').type('usuario@email.com')
      cy.contains('Enviar link de recuperação').click()
      
      // 3. Acessa link de redefinição
      cy.get('#fakeLink a').click()
      
      // 4. Redefine a senha
      const novaSenha = 'NovaSenha456'
      cy.get('#novaSenha').type(novaSenha)
      cy.get('#confirmarSenha').type(novaSenha)
      cy.contains('Redefinir senha').click()
      
      // 5. Verifica se voltou ao login
      cy.url().should('include', 'index.html')
      
      // 6. Testa login com a nova senha
      cy.get('input[type="text"]').type('usuario')
      cy.get('input[type="password"]').type(novaSenha)
      cy.contains('Entrar').click()
      
      // Verifica animação de sucesso
      cy.get('.welcome-overlay').should('exist')
    })
  })
})