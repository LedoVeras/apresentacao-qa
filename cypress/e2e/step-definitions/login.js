// cypress/e2e/login.cy.js
describe('Fluxo de Login', () => {
  beforeEach(() => {
    cy.visit('apresentacao-qa/index.html')
  })

  it('Deve exibir credenciais de teste quando clicado', () => {
    cy.contains('Ver Credenciais de Teste').click()
    cy.on('window:alert', (text) => {
      expect(text).to.contain('Credenciais de teste disponíveis')
    })
  })

  it('Deve falhar no login com credenciais inválidas', () => {
    cy.get('input[type="text"]').type('usuario_invalido')
    cy.get('input[type="password"]').type('senha_errada')
    cy.contains('Entrar').click()
    cy.get('.login-error').should('be.visible')
      .and('contain', 'Usuário ou senha incorretos!')
  })

  it('Deve realizar login com sucesso', () => {
    cy.get('input[type="text"]').type('usuario')
    cy.get('input[type="password"]').type('senha123')
    cy.contains('Entrar').click()
    cy.get('.welcome-overlay').should('exist')
  })
})