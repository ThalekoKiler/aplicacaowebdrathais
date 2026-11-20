# 🦷 Dra Thais Tardelli - Cirurgiã Dentista

> Projeto Integrado do 2º Semestre de 2026 - **Desenvolvimento de Soluções Web Inteligentes e Integradas**  
> **Instituição:** UNIFEOB - Centro Universitário Octávio Bastos  
> **Curso:** Análise e Desenvolvimento de Sistemas / Ciência da Computação  
> **Participantes:** Thales (BANCO DE DADOS & BACKEND & ES), Matheus (BACKEND), Fernando (FRONTEND), João Miguel (CLOUD & ES), Kayky (CLOUD), Gabriel (CLOUD & ES)

---

## 📌 Sobre o Projeto

Este projeto consiste em uma aplicação web desenvolvida como uma **Atividade Extensionista** voltada para atender às necessidades reais de agendamento e gestão de atendimentos de uma clínica odontológica. 
A aplicação permite que pacientes realizem seus agendamentos de forma simples e intuitiva, além de fornecer aos administradores/recepção o controle total sobre a agenda, prontuários clínicos, fila de emergência e procedimentos.

### 🎯 Alinhamento com os Objetivos de Desenvolvimento Sustentável (ODS)
- **ODS 3 - Saúde e Bem-Estar:** Facilita o acesso dos pacientes a serviços odontológicos e incentiva os cuidados com a saúde bucal.
- **ODS 8 - Trabalho Decente e Crescimento Econômico:** Otimiza os processos operacionais e a organização da rotina da clínica.

---

## 🚀 Tecnologias Utilizadas

- **Front-end:** React.js (Vite + TypeScript), Tailwind CSS, Lucide Icons, HTML5, CSS3
- **Back-end:** Node.js, Express.js (API RESTful), JSON Web Token (JWT), bcrypt, ExcelJS
- **Banco de Dados:** MySQL (`mysql2/promise` com pool de conexões)
- **Integrações Externas:** API ViaCEP (consulta automática de endereços) e Chatbot IA
- **Nuvem & Infraestrutura:** AWS EC2 (Ubuntu + PM2), Git, GitHub

---

## 🛠️ Arquitetura do Sistema (MVC)

O projeto é dividido nas seguintes disciplinas do módulo e segue o padrão arquitetural **MVC (Model-View-Controller)**:
1. **Integração de Dados:** Modelagem relacional e persistência no MySQL, garantindo integridade referencial e regras de negócio.
2. **Tecnologias para Desenvolvimento Web:** API RESTful robusta com endpoints para controle de usuários, agendamentos, prontuários, procedimentos e assistente virtual.
3. **Desenvolvimento de Interfaces de Usuário para Web:** SPA (Single Page Application) responsiva desenvolvida em React + TypeScript.
4. **Computação em Nuvem:** Hospedagem na AWS EC2 e análise comparativa de custos entre AWS, Azure e Google Cloud.

```text
backend/
└── src/
    ├── config/
    │   └── database.js              # Configuração do pool de conexões MySQL
    ├── controllers/
    │   ├── appointmentController.js # Regras de negócio de agendamentos, bloqueios e Excel
    │   ├── chatController.js        # Integração e respostas do Chatbot IA
    │   ├── procedureController.js   # CRUD de tratamentos e procedimentos odontológicos
    │   ├── recordController.js      # Controle de prontuários clínicos (anamnese/evolução)
    │   └── userController.js        # Cadastro, login, ViaCEP e gestão de perfis
    ├── helpers/
    │   └── verify-token.js          # Middleware de validação do token JWT
    ├── models/
    │   ├── appointmentModel.js      # Queries SQL de agendamentos
    │   ├── procedureModel.js        # Queries SQL de procedimentos
    │   ├── recordModel.js           # Queries SQL de prontuários
    │   └── userModel.js             # Queries SQL de usuários
    ├── routes/
    │   ├── appointmentRoutes.js     # Rotas /agendamentos
    │   ├── chatRoutes.js            # Rotas /chat
    │   ├── procedureRoutes.js       # Rotas /procedimentos
    │   ├── recordRoutes.js          # Rotas /prontuarios
    │   └── userRoutes.js            # Rotas /usuarios
    ├── app.js                       # Configuração do Express, CORS e registro de rotas
    └── server.js                    # Inicialização do servidor na porta 3000
```

---

## 📋 Funcionalidades Principais

- [x] **Área do Paciente:**
  - Cadastro e autenticação segura (JWT) com preenchimento automático de endereço via ViaCEP.
  - Visualização de horários e datas disponíveis com bloqueio automático de horários ocupados.
  - Agendamento, visualização e cancelamento de consultas.
  - Assistente virtual integrada (Chatbot IA) para suporte e dúvidas.
- [x] **Área Administrativa (Clínica):**
  - Painel/Dashboard com métricas diárias, mensais e próxima consulta.
  - Gestão de agenda com priorização automática de atendimentos de **Emergência** (`is_emergencia`).
  - Prontuário clínico completo por paciente (anamnese, histórico de tratamentos, controle de prótese e evolução).
  - Cadastro e gerenciamento de procedimentos/tratamentos e duração em minutos.
  - Exportação de relatórios de agendamentos em planilha Excel (`.xlsx`).

---

## 🗄️ Banco de Dados e Modelagem (MySQL)

O banco de dados relacional **`clinica_odontologica`** utiliza o **MySQL** e é estruturado em **4 tabelas principais**:

### 1. Tabela `usuarios`
Armazena os dados cadastrais e de endereço tanto de pacientes quanto de administradores da clínica, diferenciados pela coluna `tipo`.

| Coluna | Tipo | Restrições / Descrição |
| :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` |
| `nome` | `VARCHAR(150)` | `NOT NULL` |
| `email` | `VARCHAR(150)` | `NOT NULL`, `UNIQUE` |
| `senha` | `VARCHAR(255)` | `NOT NULL` (Hash criptografado com `bcrypt`) |
| `telefone` | `VARCHAR(20)` | Telefone / WhatsApp de contato |
| `cep` | `VARCHAR(10)` | CEP consultado via ViaCEP |
| `logradouro` | `VARCHAR(150)` | Rua / Avenida |
| `numero` | `VARCHAR(20)` | Número da residência |
| `complemento` | `VARCHAR(100)` | Complemento opcional |
| `bairro` | `VARCHAR(100)` | Bairro |
| `cidade` | `VARCHAR(100)` | Cidade |
| `uf` | `CHAR(2)` | Estado (UF) |
| `tipo` | `ENUM('PACIENTE', 'CLINICA')` | Nível de permissão (`DEFAULT 'PACIENTE'`) |
| `criado_em` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` |

### 2. Tabela `procedimentos`
Catálogo de serviços odontológicos oferecidos pela clínica e seus tempos médios de duração.

| Coluna | Tipo | Restrições / Descrição |
| :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` |
| `nome` | `VARCHAR(150)` | `NOT NULL` (Ex: Avaliação Geral, Limpeza, Restauração) |
| `descricao` | `TEXT` | Detalhes clínicos ou orientações prévias |
| `duracao_minutos` | `INT` | `NOT NULL` (Tempo estimado de atendimento em minutos) |

### 3. Tabela `agendamentos`
Registra as consultas marcadas, relacionando `usuarios` e `procedimentos`, além de controlar o status e a fila de prioridade.

| Coluna | Tipo | Restrições / Descrição |
| :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` |
| `paciente_id` | `INT` | `FOREIGN KEY` -> `usuarios(id)` |
| `procedimento_id` | `INT` | `FOREIGN KEY` -> `procedimentos(id)` |
| `data_hora_inicio` | `DATETIME` | `NOT NULL` (Data e hora de início em UTC) |
| `data_hora_fim` | `DATETIME` | `NOT NULL` (Calculado conforme `duracao_minutos`) |
| `estado` | `ENUM('AGENDADO', 'CONCLUIDO', 'CANCELADO')` | Status atual da consulta (`DEFAULT 'AGENDADO'`) |
| `is_emergencia` | `TINYINT(1)` | `DEFAULT 0` (`1` = Prioridade máxima na fila da clínica) |
| `observacao` | `TEXT` | Observações adicionais do agendamento |
| `criado_em` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` |

### 4. Tabela `prontuarios`
Relacionamento **1:1** com a tabela `usuarios`, armazenando a ficha clínica odontológica do paciente.

| Coluna | Tipo | Restrições / Descrição |
| :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` |
| `paciente_id` | `INT` | `UNIQUE`, `FOREIGN KEY` -> `usuarios(id)` |
| `anamnese` | `TEXT` | Queixa principal, alergias e histórico de saúde |
| `historico_tratamento` | `TEXT` | Procedimentos realizados, datas e materiais |
| `controle_protese` | `TEXT` | Moldes, cor, laboratório e ajustes de prótese/aparelho |
| `follow_up_evolucao` | `TEXT` | Evolução pós-atendimento e orientações |
| `atualizado_em` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` |

---

## 📡 Documentação dos Endpoints da API REST

As rotas protegidas exigem o envio do token JWT no cabeçalho HTTP: `Authorization: Bearer <token>`.

### 🩺 Status da API
| Verbo HTTP | Endpoint | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/status` | Público | Verifica se a API Express está online e respondendo. |

### 👤 Usuários e Autenticação (`/usuarios`)
| Verbo HTTP | Endpoint | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/usuarios/cep/:cep` | Público | Consulta endereço completo a partir do CEP via ViaCEP. |
| `POST` | `/usuarios` | Público | Cadastra um novo usuário (`PACIENTE` ou `CLINICA`) e gera token JWT. |
| `POST` | `/usuarios/login` | Público | Autentica credenciais (e-mail e senha) e retorna token JWT. |
| `GET` | `/usuarios/perfil` | Autenticado | Retorna os dados cadastrais do usuário logado. |
| `PATCH` | `/usuarios/perfil` | Autenticado | Atualiza parcialmente nome, e-mail e telefone do usuário logado. |
| `GET` | `/usuarios/pacientes` | `CLINICA` | Lista todos os usuários cadastrados com perfil `PACIENTE`. |

### 📅 Agendamentos (`/agendamentos`)
| Verbo HTTP | Endpoint | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/agendamentos` | Autenticado | Lista todos os agendamentos (`CLINICA`) ou apenas os do próprio usuário (`PACIENTE`). |
| `GET` | `/agendamentos/ocupados` | Autenticado | Retorna os intervalos já reservados para bloqueio de horários no calendário. |
| `GET` | `/agendamentos/exportar/excel` | `CLINICA` | Exporta e faz download de relatório completo em planilha Excel (`.xlsx`). |
| `GET` | `/agendamentos/:id` | Autenticado | Busca os detalhes de um agendamento específico pelo ID. |
| `POST` | `/agendamentos` | Autenticado | Cria um novo agendamento (aceita `is_emergencia` quando criado pela clínica). |
| `PATCH` | `/agendamentos/:id/estado` | Autenticado | Atualiza o status do agendamento (`AGENDADO`, `CONCLUIDO` ou `CANCELADO`). |
| `DELETE` | `/agendamentos/:id` | `CLINICA` | Exclui permanentemente um registro de agendamento. |

### 📋 Prontuários Clínicos (`/prontuarios`)
| Verbo HTTP | Endpoint | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/prontuarios` | `CLINICA` | Lista todos os prontuários cadastrados na clínica. |
| `GET` | `/prontuarios/paciente/:pacienteId` | Autenticado | Busca o prontuário de um paciente específico (pacientes acessam apenas o próprio). |
| `POST` | `/prontuarios` | `CLINICA` | Cria um novo prontuário clínico vinculado a um `paciente_id`. |
| `PUT` | `/prontuarios/paciente/:pacienteId` | `CLINICA` | Atualiza anamnese, histórico de tratamento, prótese e evolução do paciente. |
| `DELETE` | `/prontuarios/paciente/:pacienteId` | `CLINICA` | Remove o prontuário clínico do paciente informado. |

### 🦷 Procedimentos (`/procedimentos`)
| Verbo HTTP | Endpoint | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/procedimentos` | Público | Lista todos os procedimentos odontológicos ativos e suas durações. |
| `POST` | `/procedimentos` | `CLINICA` | Cadastra um novo procedimento/tratamento no catálogo da clínica. |
| `DELETE` | `/procedimentos/:id` | `CLINICA` | Remove um procedimento cadastrado pelo ID. |

### 🤖 Assistente Virtual (`/chat`)
| Verbo HTTP | Endpoint | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/chat/mensagem` | Autenticado | Envia uma mensagem do paciente e retorna a resposta da assistente virtual. |

---

## ⚙️ Variáveis de Ambiente (`.env`)

Para executar o backend localmente ou na instância AWS EC2, configure o arquivo `.env` na raiz da pasta `backend/`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=admin_clinica
DB_PASSWORD=sua_senha_segura
DB_NAME=clinica_odontologica
JWT_SECRET=sua_chave_secreta_jwt
```

---

## 📚 Documentação Complementar

A documentação detalhada de requisitos e regras de negócio da aplicação encontra-se na pasta [`/docs`](./docs):

- 📋 [Requisitos Funcionais (RF)](./docs/rf.md)
- ⚙️ [Requisitos NÃO Funcionais (RNF)](./docs/rnf.md)
- ⚖️ [Regras de Negócios (RN)](./docs/rn.md)
- ☁️ [Documentação Marudi](./docs/DocumentaçãoMarudi.md)