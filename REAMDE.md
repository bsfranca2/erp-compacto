# ERPCompacto

ERPCompacto é um sistema simples de gestão empresarial voltado para pequenas lojas, permitindo o controle de compras, estoque, vendas e pagamentos. Este projeto é open source e utiliza a stack Nuxt.js para o frontend e Supabase para o backend.

## Funcionalidades

- **Gestão de Compras:** Controle de itens comprados, status de pagamento e parcelas.
- **Gestão de Estoque:** Monitoramento de quantidade de produtos e alertas de estoque baixo.
- **Gestão de Vendas:** Registro de vendas, com valores de compra e venda.
- **Relatórios Financeiros:** Relatórios de vendas diárias, análise de lucros e mais.

## Stack Tecnológica

- **Frontend:** [Nuxt.js](https://nuxtjs.org/)
- **Backend:** [Supabase](https://supabase.com/)

## Instalação e Uso

### Requisitos

- Node.js
- [Bun](https://bun.sh/)
- Conta no Supabase

### Configuração

1. Clone o repositório:

   ```bash
   git clone https://github.com/bsfranca2/erp-compacto
   cd erp-compacto
   ```

2. Instale as dependências:

   ```bash
   bun install
   ```

3. Configure o ambiente com as credenciais do Supabase:

   - Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_anon_key
     ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   bun dev
   ```

   O projeto estará disponível em `http://localhost:3000`.

## Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue para discutir o que você gostaria de mudar ou melhorar.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
