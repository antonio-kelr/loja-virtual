# Loja Virtual - Front-End

Este é o projeto front-end de uma loja virtual desenvolvida com Angular.

## Fluxo de Compra

O fluxo de compra da aplicação segue os seguintes passos:

1. **Visualização de Produtos**
   - Os produtos são exibidos na página inicial e nas páginas de categorias
   - Cada produto possui um card com imagem, descrição e preço
   - Ao clicar em um produto, o usuário é redirecionado para a página de detalhes

2. **Página de Detalhes do Produto**
   - Exibe imagens do produto
   - Mostra descrição e especificações
   - Apresenta o preço e opções de parcelamento
   - Disponibiliza opções de frete
   - Possui botões para adicionar ao carrinho e ir para o carrinho

3. **Carrinho de Compras**
   - Lista todos os produtos adicionados
   - Permite alterar a quantidade de cada item
   - Exibe o valor total da compra
   - Oferece opções para continuar comprando, limpar o carrinho ou finalizar a compra

4. **Finalização da Compra (Checkout)**
   - Mostra o resumo dos itens no carrinho
   - Exibe o valor total
   - Oferece opções de pagamento: PIX e Cartão
   - Possui botão para confirmar a compra

## Tecnologias Utilizadas

- Angular
- TypeScript
- SCSS
- PrimeNG
- Font Awesome

## Como Executar o Projeto

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Execute o projeto com `ng serve`
4. Acesse a aplicação em `http://localhost:4200`

# Kaboom

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
