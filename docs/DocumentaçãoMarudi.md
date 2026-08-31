# **Plano de Infraestrutura em Nuvem e Arquitetura de Serviços** 

## **1\. Classificação do Modelo de Serviço**

* **Modelo Recomendado (PaaS):** Platform as a Service utilizando AWS Elastic Beanstalk ou AWS App Runner.  
* **Justificativa:** Como o foco do desenvolvimento está nas regras de negócio da clínica odontológica (agendamento de consultas, cadastro de pacientes e prontuários), o PaaS abstrai a gestão de hardware, sistema operacional e redes, permitindo que o grupo foque na entrega do código Node.js e React.  
* **Plano de Contingência (IaaS):** Caso o ambiente do AWS Academy Learner Lab restrinja o provisionamento de serviços gerenciados, a infraestrutura adotará o modelo Infrastructure as a Service (IaaS) com instâncias Amazon EC2. Isso concede controle total sobre a máquina virtual para instalação manual do runtime Node.js, servidor web Nginx e banco de dados.

---

## **2. Comparativo de Nomenclaturas e Serviços entre Provedores** 

<img width="1600" height="549" alt="Code_Generated_Image" src="https://github.com/user-attachments/assets/e4c2afc1-1d23-4d5e-a8e1-d9807503409f" />

---

## **3\. Levantamento e Estimativa de Custos em Nuvem**

* **AWS (Plano A \- Parceria Acadêmica):** US$ 0,00/mês durante o desenvolvimento do projeto integrado, utilizando o orçamento disponibilizado via AWS Academy Learner Lab. Para um cenário comercial futuro pós-curso, uma estrutura de entrada (t3.micro \+ RDS db.t3.micro) custa em média US$ 15,00 a US$ 30,00/mês.  
* **Microsoft Azure:** Estimativa de US$ 25,00 a US$ 35,00/mês (utilizando App Service no plano básico B1 e Azure SQL Database nível de entrada).  
* **Google Cloud Platform (GCP):** Estimativa de US$ 18,00 a US$ 28,00/mês (com Cloud Run alocado sob demanda e Cloud SQL na menor especificação db-f1-micro).

---

## **4\. Estratégia de Implantação e Execução Contínua**

* **Ambiente de Desenvolvimento:** O desenvolvimento e os testes ocorrem integralmente em ambiente local (Node.js, React e banco de dados local), migrando para a nuvem apenas na etapa final do ciclo de entrega.  
* **Execução Contínua da API:** Para garantir a alta disponibilidade da API Node.js no deploy final na AWS:  
  * ***No modelo PaaS:*** A própria infraestrutura gerenciada monitora a aplicação e realiza o reinício automático da instância em caso de falha de processo.  
  * ***No modelo IaaS (EC2):*** Será utilizado o gerenciador de processos PM2 integrado ao systemd da instância Linux, garantindo que a aplicação Node.js permaneça em execução ininterrupta e reinicie automaticamente em casos de erros fatais ou reinicialização do servidor.
