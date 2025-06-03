// cypress/e2e/login.cy.js
describe('Fluxo de Login', () => {
  const delayType = { delay: 150 }; // Delay na digitação
  const waitTime = 500; // Delay entre ações

  beforeEach(() => {
    cy.visit('http://127.0.0.1:8080/index.html');
    cy.wait(waitTime);
  });

  it('Deve falhar no login com credenciais inválidas', () => {
    cy.get('input[type="text"]').type('usuario_invalido', delayType);
    cy.wait(waitTime);
    cy.get('input[type="password"]').type('senha_errada', delayType);
    cy.wait(waitTime);
    cy.contains('Entrar').click();
    cy.wait(waitTime);

    cy.get('.login-error').should('be.visible')
      .and('contain', 'Usuário ou senha incorretos!');
  });

  it('Deve realizar login com sucesso', () => {
    cy.get('input[type="text"]').type('usuario', delayType);
    cy.wait(waitTime);
    cy.get('input[type="password"]').type('senha123', delayType);
    cy.wait(waitTime);
    cy.contains('Entrar').click();
    cy.wait(waitTime);

    cy.get('.welcome-overlay').should('exist');
  });
});
