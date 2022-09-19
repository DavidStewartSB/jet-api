# jet-api
Api desenvolvida em node

Para rodar esse projeto é bem simples!

Basta clonar na sua máquina e executar o comando:

npm install - para instalar as dependencias
npm start - para rodar o projeto localmente

após isso, basta rodar no seu browser preferido esta url: 

localhost:3000/api/v1/products
localhost:3000/api/v1/categories.


abaixo revalarei um secredinho para ter mais eficácia.

1 - Crie um arquivo .env. Na raiz do projeto
2 - cole as informações abaixo:

CONNECTION_STRING=mongodb+srv://admin:admin@jet-store.jt5zhpo.mongodb.net/?retryWrites=true&w=majority
API_URL=/api/v1
PORT=3000


e Voilà!! A conexão com meu banco de dados MongoDB será realizada!!
