Gerenciamento de Usuários (com persistência via LocalStorage) 👥

Este é um projeto web frontend focado em demonstrar a construção de um painel de gerenciamento de usuários. O projeto utiliza o padrão de arquitetura **MVC (Model, View, Controller)** e garante a persistência de dados diretamente no navegador do cliente através da API nativa do **LocalStorage**.

## 🚀 Funcionalidades

- **CRUD Completo:** Criação, leitura, atualização e exclusão de usuários.
- **Persistência de Dados (LocalStorage):** Os usuários cadastrados são salvos no `localStorage` do navegador. Isso garante que os dados não sejam perdidos mesmo que você feche ou recarregue a aba/página.
- **Upload de Imagens:** Suporte para carregamento de fotos de perfil no formulário. A imagem é convertida automaticamente para o formato **Base64** antes de ser salva no Storage.
- **Painel de Estatísticas:** Atualização dinâmica em tempo real exibindo a quantidade de usuários totais e a quantidade de administradores cadastrados.
- **Interface Visual:** Utilização do poderoso template administrativo **AdminLTE** (baseado em Bootstrap), proporcionando uma interface limpa, moderna e responsiva.

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3**
- **JavaScript (Vanilla/ES6+)**
- **LocalStorage API** (Mecanismo de banco de dados no lado do cliente)
- **Orientação a Objetos e Padrão MVC** (Separação em Models, Controllers e Classes Utilitárias)

## 📁 Estrutura do Projeto

O código do projeto foi organizado visando separar responsabilidades, facilitando a manutenção:

* **`/models/User.js`**: Representa o objeto Usuário. Contém as regras de negócio de como os dados são montados, validados, carregados e salvos em JSON dentro do LocalStorage.
* **`/controllers/UserController.js`**: O "cérebro" da interface. Escuta os eventos da tela (como cliques e envio do formulário), coleta os dados do HTML, chama as rotinas do Model para salvar/excluir e atualiza a tabela e as estatísticas visuais.
* **`/classes/Utils.js`**: Funções auxiliares gerais, como formatação de data e hora para exibição na tabela.
* **`index.html`**: A página principal (View) que engloba o layout do AdminLTE, a tabela e os formulários de cadastro/edição.
* **`index.js`**: Arquivo de inicialização, responsável por instanciar o `UserController` quando a aplicação é aberta.

## 💾 O Papel do LocalStorage

1. **Salvar:** Quando um usuário é inserido/editado, a lista de usuários é convertida em texto puro usando `JSON.stringify()` e armazenada na memória do navegador.
2. **Ler:** Ao abrir a página, a aplicação busca essa string no LocalStorage, reconstrói os objetos JavaScript através do `JSON.parse()` e constrói as linhas da tabela dinamicamente usando a manipulação da DOM.
