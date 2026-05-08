# SINC - Portal Corporativo e Website 🚀

Bem-vindo ao repositório do site institucional e portal corporativo da **SINC Jr**. Este projeto combina uma landing page moderna com uma dashboard exclusiva integrada ao Google Workspace.

---

## 📋 Sumário
- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar](#-como-executar)
- [Configuração de APIs](#-configuração-de-apis)

---

## 🌟 Visão Geral
O projeto SINC foi desenvolvido para oferecer uma presença digital forte para a empresa júnior, além de uma ferramenta interna (Dashboard) que centraliza o acesso a recursos essenciais como Agenda e Arquivos, utilizando autenticação segura via Google.

## 🛠 Tecnologias
- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Design:** Glassmorphism, Design Responsivo, Animações com Intersection Observer.
- **Integrações:** Google Identity Services (Sign-In), Google Drive API, Google Calendar (Embed).
- **Formulários:** Integração com FormSubmit.co.

## ✨ Funcionalidades
1. **Landing Page Premium:**
   - Design moderno e responsivo.
   - Animações suaves ao rolar a página.
   - Seções: Início, Sobre, Serviços, Membros e Contato.
   - Formulário de contato funcional.

2. **Dashboard Corporativa (Restrita):**
   - Acesso exclusivo para e-mails `@sincjr.com.br`.
   - Autenticação via Google (OAuth2).
   - Widget de **Agenda** integrado.
   - Listagem em tempo real de arquivos do **Google Drive**.

## 📂 Estrutura do Projeto
```text
/
├── assets/             # Imagens e ícones
├── index.html          # Landing Page principal
├── style.css           # Estilos globais e da landing page
├── main.js             # Lógica da landing page (menu, animações)
├── dashboard.html      # Interface do portal corporativo
├── dashboard.css       # Estilos específicos da dashboard
└── dashboard.js        # Lógica de autenticação e APIs do Google
```

## 🚀 Como Executar
1. Clone o repositório.
2. Como o projeto utiliza APIs do Google, é recomendado rodar através de um servidor local (Ex: Live Server do VS Code) para que as origens de redirecionamento funcionem corretamente.
3. Acesse `index.html` para ver o site principal ou clique em "Entrar" para acessar o portal.

## 🔑 Configuração de APIs
Para que a Dashboard funcione corretamente em novos domínios, é necessário configurar as credenciais no [Google Cloud Console](https://console.cloud.google.com/):
1. Crie um projeto.
2. Configure a **Tela de Consentimento OAuth**.
3. Crie um **ID do cliente OAuth 2.0** (Tipo: Aplicativo Web).
4. Adicione sua URL em "Origens JavaScript autorizadas".
5. Substitua o `CLIENT_ID` no topo do arquivo `dashboard.js`.

---

# SINC - Corporate Portal and Website 🇺🇸

Welcome to the **SINC Jr** institutional website and corporate portal repository. This project combines a modern landing page with an exclusive dashboard integrated with Google Workspace.

## 📋 Summary
- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [How to Run](#-how-to-run)

## 🌟 Overview
The SINC project was developed to provide a strong digital presence for the junior enterprise, as well as an internal tool (Dashboard) that centralizes access to essential resources such as Calendars and Files, using secure Google authentication.

## 🛠 Tech Stack
- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Design:** Glassmorphism, Responsive Design, Intersection Observer Animations.
- **Integrations:** Google Identity Services (Sign-In), Google Drive API, Google Calendar (Embed).

## ✨ Features
1. **Premium Landing Page:**
   - Modern and responsive design.
   - Smooth scroll animations.
   - Functional contact form.

2. **Corporate Dashboard (Restricted):**
   - Exclusive access for `@sincjr.com.br` emails.
   - Google Authentication (OAuth2).
   - Integrated **Calendar** widget.
   - Real-time **Google Drive** file listing.

---
© 2026 SINCJR. Todos os direitos reservados.
