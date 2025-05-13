<h1 align="center">JuriAssist</h1>

<p align="center">
  <strong>Simplifique a linguagem jurídica complexa e obtenha respostas claras sobre seus documentos legais com nosso assistente de IA, sem precisar de um advogado.</strong>
</p>

## 📋 Sobre o Projeto

JuriAssist é uma plataforma que utiliza um modelo de inteligência artificial baseado em RAG (Retrieval-Augmented Generation) para a análise de documentos jurídicos. O sistema permite que o usuário faça upload de seus documentos jurídicos e tire suas dúvidas por meio de um assistente de IA, sem correr o risco de vazar seus dados pessoais, já que o sistema utiliza uma inteligência artificial rodando localmente.

## ✨ Funcionalidades

- **Upload de Documentos**: Faça upload de contratos, processos e outros documentos jurídicos para análise automática e obtenha explicações em linguagem simples.

- **Assistente de IA Conversacional**: Converse com nosso assistente de IA para esclarecer dúvidas sobre seus processos e documentos em linguagem simples e acessível.

- **Análise Detalhada**: Receba resumos, análises de riscos e recomendações práticas sobre seus documentos, facilitando a tomada de decisões.

## 🚀 Tecnologias

### Frontend
![React](https://img.shields.io/badge/React-0D1117?style=for-the-badge&logo=react&logoColor=61DAFB&labelColor=0D1117)&nbsp;
![TypeScript](https://img.shields.io/badge/TypeScript-0D1117?style=for-the-badge&logo=typescript&logoColor=3178C6&labelColor=0D1117)&nbsp;
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0D1117?style=for-the-badge&logo=tailwind-css&logoColor=06B6D4&labelColor=0D1117)&nbsp;
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-0D1117?style=for-the-badge&logo=shadcnui&logoColor=000000&labelColor=0D1117)&nbsp;

### Backend
![Node.js](https://img.shields.io/badge/Node.js-0D1117?style=for-the-badge&logo=node.js&logoColor=339933&labelColor=0D1117)&nbsp;
![TypeScript](https://img.shields.io/badge/TypeScript-0D1117?style=for-the-badge&logo=typescript&logoColor=3178C6&labelColor=0D1117)&nbsp;
![Express](https://img.shields.io/badge/Express-0D1117?style=for-the-badge&logo=express&logoColor=FFFFFF&labelColor=0D1117)&nbsp;
![LangChain](https://img.shields.io/badge/LangChain-0D1117?style=for-the-badge&logo=chainlink&logoColor=375BD2&labelColor=0D1117)&nbsp;
![Ollama](https://img.shields.io/badge/Ollama-0D1117?style=for-the-badge&logo=llama&logoColor=FFFFFF&labelColor=0D1117)&nbsp;
![Qdrant](https://img.shields.io/badge/Qdrant-0D1117?style=for-the-badge&logo=database&logoColor=FFFFFF&labelColor=0D1117)&nbsp;
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-0D1117?style=for-the-badge&logo=postgresql&logoColor=4169E1&labelColor=0D1117)&nbsp;
![Docker](https://img.shields.io/badge/Docker-0D1117?style=for-the-badge&logo=docker&logoColor=2496ED&labelColor=0D1117)&nbsp;
![Swagger](https://img.shields.io/badge/Swagger-0D1117?style=for-the-badge&logo=swagger&logoColor=85EA2D&labelColor=0D1117)&nbsp;

## 🔧 Pré-requisitos

Para executar o JuriAssist localmente, você precisará:

1. [Node.js](https://nodejs.org/en/) (versão mais recente)
2. [Docker](https://www.docker.com/products/docker-desktop/)
3. [Ollama](https://ollama.com) - Necessário para executar os modelos de IA localmente
   > ⚠️ **Atenção**: A instalação do Ollama pode levar cerca de 10 minutos dependendo da sua velocidade de internet.

## 📦 Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **Frontend**: Interface de usuário construída com React, TypeScript e Tailwind CSS
- **Backend**: API construída com Node.js, Express, LangChain e integração com Ollama

Para instruções detalhadas sobre como configurar e executar cada parte do projeto, consulte os READMEs específicos:

- [README do Frontend](./frontend/README.md)
- [README do Backend](./backend/README.md)

## 🌐 Documentação da API

A documentação da API está disponível através do Swagger UI:

```bash
http://localhost:3000/swagger
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
