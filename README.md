# Projeto Loja Virtual - Front-End

Este repositório contém o front-end de uma loja virtual desenvolvido em Angular. O objetivo do projeto é fornecer uma interface moderna, responsiva e funcional para usuários finais e administradores, permitindo navegação, cadastro, login, gerenciamento de produtos, carrinho de compras, pedidos e muito mais.

## 🚀 Tecnologias Utilizadas

- [Angular](https://angular.io/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [SCSS](https://sass-lang.com/)  
- [Docker](https://www.docker.com/)  
- [Firebase](https://firebase.google.com/) (configuração presente)

## 📁 Estrutura de Pastas

```
turbosetup/
├── src/
│   ├── app/
│   │   ├── components/         # Componentes reutilizáveis e páginas
│   │   ├── guards/             # Guards de rotas (ex: autenticação)
│   │   ├── interceptors/       # Interceptadores HTTP
│   │   ├── interfaces/         # Interfaces TypeScript
│   │   ├── models/             # Modelos de dados
│   │   ├── services/           # Serviços (ex: Auth, Carrinho, Produto)
│   │   ├── utils/              # Utilitários
│   │   ├── app-routing.module.ts  # Rotas principais
│   │   ├── app.module.ts          # Módulo principal
│   ├── assets/                # Imagens e outros assets
│   ├── environments/          # Configurações de ambiente
│   ├── styles.scss            # Estilos globais
├── Dockerfile                 # Dockerfile para build do front-end
├── docker-compose.yml         # Docker Compose para orquestração
├── package.json               # Dependências e scripts
├── angular.json               # Configuração do Angular
```

## 🛠️ Como rodar o projeto localmente

1. **Pré-requisitos:**
   - Node.js (recomendado: versão 18+)
   - npm (geralmente já vem com o Node)
   - Angular CLI (`npm install -g @angular/cli`)

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Rode o projeto:**
   ```bash
   ng serve
   ```
   O projeto estará disponível em `http://localhost:4200`.

## 🐳 Como rodar com Docker

1. **Build da imagem:**
   ```bash
   docker build -t loja-virtual-front .
   ```
2. **Suba o container:**
   ```bash
   docker run -p 4200:80 loja-virtual-front
   ```
   O front-end estará disponível em `http://localhost:4200`.

Ou utilize o Docker Compose:
```bash
docker-compose up --build
```

## 📜 Scripts Disponíveis

- `ng serve` — Roda o projeto em modo desenvolvimento
- `ng build` — Gera o build de produção
- `ng test` — Executa os testes unitários
- `ng lint` — Analisa o código com o linter

## 🧩 Principais Componentes

- **Home:** Página inicial com destaques e carrossel
- **Login/Cadastro:** Autenticação de usuários
- **Carrinho:** Gerenciamento de produtos no carrinho
- **Checkout:** Processo de finalização de compra
- **Admin:** Área administrativa para gestão de produtos e usuários
- **Produtos:** Listagem e detalhes de produtos
- **Favoritos:** Lista de produtos favoritos do usuário
- **Meus Pedidos/Minha Conta:** Área do usuário para acompanhar pedidos e editar dados

## 🔒 Segurança
- Utiliza guards para proteger rotas restritas
- Interceptor para adicionar tokens de autenticação nas requisições

## 🤝 Como contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b minha-feature`)
3. Commit suas alterações (`git commit -m 'feat: minha nova feature'`)
4. Faça push para a branch (`git push origin minha-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

Dúvidas? Abra uma issue ou entre em contato!
