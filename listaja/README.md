# ListaJá

Aplicação web de gerenciamento de tarefas criada com React, TypeScript e Vite.

## Funcionalidades

- Criar tarefas;
- marcar tarefas como concluídas ou pendentes;
- editar títulos;
- remover tarefas com confirmação;
- manter os dados no `localStorage`;
- recuperar-se de dados inválidos armazenados no navegador.

## Executar

Pré-requisitos: Node.js e npm.

```bash
npm install
npm run dev
```

A aplicação será exibida no endereço informado pelo Vite no terminal, normalmente `http://localhost:5173`.

## Scripts

```bash
npm test       # executa os testes
npm run lint   # executa o linter
npm run build  # gera o build de produção
npm run preview # serve o build localmente
```

## Testes e validação

O projeto utiliza Vitest, Testing Library e jsdom. Antes da entrega, execute:

```bash
npm test
npm run lint
npm run build
```

## Persistência

As tarefas são armazenadas na chave `listaja.tasks` do `localStorage`. Se o conteúdo armazenado não puder ser interpretado como JSON, a aplicação registra o problema no console e começa com uma lista vazia.
