<h1 align="center">JuriAssist - Backend</h1>

<p align="center">
  <strong>API e serviços de IA para o sistema JuriAssist de análise de documentos jurídicos</strong>
</p>

## 📋 Sobre

O backend do JuriAssist é responsável por processar documentos jurídicos, gerenciar o banco de dados e integrar com modelos de IA através do Ollama para fornecer análises e respostas sobre questões legais.

## ✨ Funcionalidades

-   **Processamento de Documentos**: API para upload, armazenamento e processamento de documentos jurídicos
-   **Integração com IA**: Utilização do Ollama e LangChain para análise de documentos e geração de respostas
-   **Banco de Dados**: Armazenamento de documentos, metadados e histórico de interações
-   **Vetorização de Documentos**: Indexação vetorial de documentos para busca semântica com Qdrant
-   **API RESTful**: Endpoints documentados com Swagger para integração com o frontend

## 🚀 Tecnologias

![Node.js](https://img.shields.io/badge/Node.js-0D1117?style=for-the-badge&logo=node.js&logoColor=339933&labelColor=0D1117)&nbsp;
![TypeScript](https://img.shields.io/badge/TypeScript-0D1117?style=for-the-badge&logo=typescript&logoColor=3178C6&labelColor=0D1117)&nbsp;
![Express](https://img.shields.io/badge/Express-0D1117?style=for-the-badge&logo=express&logoColor=FFFFFF&labelColor=0D1117)&nbsp;
![LangChain](https://img.shields.io/badge/LangChain-0D1117?style=for-the-badge&logo=chainlink&logoColor=375BD2&labelColor=0D1117)&nbsp;
![Ollama](https://img.shields.io/badge/Ollama-0D1117?style=for-the-badge&logo=llama&logoColor=FFFFFF&labelColor=0D1117)&nbsp;
![Qdrant](https://img.shields.io/badge/Qdrant-0D1117?style=for-the-badge&logo=database&logoColor=FFFFFF&labelColor=0D1117)&nbsp;
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-0D1117?style=for-the-badge&logo=postgresql&logoColor=4169E1&labelColor=0D1117)&nbsp;
![Docker](https://img.shields.io/badge/Docker-0D1117?style=for-the-badge&logo=docker&logoColor=2496ED&labelColor=0D1117)&nbsp;
![Swagger](https://img.shields.io/badge/Swagger-0D1117?style=for-the-badge&logo=swagger&logoColor=85EA2D&labelColor=0D1117)&nbsp;

## ⚠️ Requisitos Importantes

Para executar o backend localmente, você precisará:

1. [Docker](https://www.docker.com/products/docker-desktop/) - Para gerenciar containers
2. [Ollama](https://ollama.com) - **É NECESSÁRIO baixar e instalar o Ollama** para executar os modelos de IA localmente

## 📥 Download do Projeto

Baixe o projeto em seu computador através do comando:

```bash
https://github.com/anthonyDev01/JuriAssist.git
```

**ou**

1. Clique em `<> Code`.
2. Faça o download do arquivo ZIP.
3. Abra o seu explorador de arquivos na localização da instalação.
4. Extraia o arquivo ZIP.

## 🔄 Instalação e Execução

1. Navegue até a pasta do backend:
   ```bash
   cd juriAssist/backend
   ```
2. Execute o comando para construir os containers Docker:
   ```bash
   docker-compose build
   ```

3. Execute o comando para iniciar os containers:
   ```bash
   docker-compose up -d
   ```

Este comando iniciará todos os serviços necessários:

-   API Node.js com Express
-   Banco de dados PostgreSQL
-   Serviço Qdrant para busca vetorial
-   Integração com Ollama (que deve estar instalado em sua máquina)

> ⚠️ **Atenção**: A instalação do Ollama pode levar cerca de 10 minutos dependendo da sua velocidade de internet.

## 🌐 Documentação da API

A documentação da API está disponível através do Swagger UI:

```
http://localhost:3000/swagger
```

Através desta interface, você pode explorar e testar todos os endpoints disponíveis.

## 📊 Estrutura do Banco de Dados

O sistema utiliza PostgreSQL para armazenar:

-   Registro de atividades
-   Histórico de interações com a IA
-   Configurações do sistema

## 🔍 Busca Vetorial

O sistema utiliza Qdrant para indexação e busca vetorial de documentos, permitindo:

-   Busca semântica em documentos
-   Recuperação de contexto relevante para as perguntas do usuário
-   Melhoria na precisão das respostas da IA

## 🤖 Modelos de IA

O sistema utiliza Ollama para executar modelos de IA localmente, garantindo:

-   Privacidade dos dados
-   Processamento local de documentos sensíveis
-   Personalização das respostas para o contexto jurídico

## 🔧 Configuração de Modelos

Por padrão, o sistema está configurado para utilizar o modelo Llama 3 8B, mas você pode configurar outros modelos disponíveis no Ollama conforme sua necessidade.

