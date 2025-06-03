Feature: Recuperação de Senha

  Scenario: Solicitação de recuperação com e-mail válido
    Given que o usuário está na página de "esqueceu-senha.html"
    When ele preenche o campo de e-mail com "usuario1@email.com"
    And clica em "Enviar link de recuperação"
    Then o sistema exibe a mensagem "Link de redefinição enviado com sucesso."

  Scenario: Solicitação com e-mail não cadastrado
    Given que o usuário está na página de "esqueceu-senha.html"
    When ele preenche o campo de e-mail com "naoexiste@email.com"
    And clica em "Enviar link de recuperação"
    Then o sistema exibe a mensagem "E-mail não encontrado em nossa base de dados."

  Scenario: Redefinição bem-sucedida com nova senha
    Given que o usuário está na página de "redefinir-senha.html"
    When ele preenche "Nova senha" com "senhaSegura123"
    And preenche "Confirmar nova senha" com "senhaSegura123"
    And clica em "Redefinir senha"
    Then o sistema exibe a mensagem "Senha redefinida com sucesso. Você já pode fazer login."
