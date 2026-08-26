# ⚙️ Requisitos Não Funcionais (RNF)

Os requisitos não funcionais definem os critérios de qualidade, desempenho, segurança e infraestrutura da aplicação.

- **[RNF001] Interface Responsiva:** O front-end em React deve ser totalmente responsivo, adaptando-se a dispositivos móveis e desktops.
- **[RNF002] Segurança e Privacidade dos Dados (LGPD):** Prontuários e dados de saúde sensíveis devem ser armazenados de forma segura, com controle estrito de acesso e encriptação de dados sensíveis no banco de dados.
- **[RNF003] Arquitetura de API RESTful:** O back-end deve disponibilizar endpoints organizados sob os padrões HTTP (GET, POST, PUT, DELETE).
- **[RNF004] Hospedagem e Alta Disponibilidade em Nuvem:** A aplicação e o banco de dados devem ser hospedados em ambiente de nuvem (AWS) garantindo execução contínua.
- **[RNF005] Desempenho e Sincronismo:** As atualizações na agenda devem refletir instantaneamente (baixa latência) para evitar agendamentos duplicados simultâneos.
