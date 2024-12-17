## ⚙️ Clonar o Repositório

```
git clone https://github.com/kaoosz/Ozmap.git
```
🔧 Configuração do Ambiente

Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:
```
MONGODB=mongodb://localhost:27017
PORT=3008
BASE_GEO_API_URL=https://api.geoapify.com/v1/geocode
GEO_API_KEY=b5d061a6e00d486c894db2aff57df0a6
JWT_SECRET=supersecretkeyfortesting12345!
jest=true
```
📦 Instalar Dependências
```
npm install
```
🚀 Rodar a Aplicação
Via Docker Compose
```
docker-compose up -d
```
```
npm run dev
```

  
Acesso ao Swagger

Utilize a documentação Swagger para testar os endpoints:
```
http://localhost:3008/api-docs/
```
Caso não consiga, os endpoints estão descritos abaixo.  

📄 Endpoints
👤 User Endpoints
Criar Usuário (POST)

Rota: /users
Regras:

    Forneça apenas o endereço ou as coordenadas, nunca ambos.
    A precisão das coordenadas não é garantida.

Exemplo de Request:
```
{
    "name": "Gui Alves",
    "email": "guitesterr@gmail.com",
    "password": "gui",
    "address": "Avenida Agenor Alves dos Santos"
    // "coordinates": [-45.7728598, -23.1384991]
}
```
Atualizar Usuário (PUT)

Rota: /users/:id
Regras:

    É necessário estar autenticado e fornecer o token JWT.
    O usuário só pode atualizar seu próprio perfil.

Exemplo de Request:
```
{
    "name": "Updated Name",
    "email": "updatedemail@gmail.com",
    // "address": "Updated Address"
    // "coordinates": [-23.1384991, -45.7728598]
}
```
🔑 Login Endpoint
Login (POST)

Rota: /login

Exemplo de Request:
```
{
    "email": "guitester@gmail.com",
    "password": "gui"
}
```
Exemplo de Resposta:
```
{
    "accessToken": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
🌍 Regions Endpoints
Criar Região (POST)

Rota: /regions
Regras:

    É necessário fornecer um token JWT para autenticação.

Exemplo de Request:
```
{
  "name": "São José Dos Campos",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [-46.625290, -23.533773],
        [-46.624130, -23.533773],
        [-46.624130, -23.532500],
        [-46.625290, -23.533773]
      ]
    ]
  }
}
```
Buscar Regiões Contendo um Ponto (GET)

Rota: /regions/contains  
Descrição: Procura regiões em um ponto específico fornecendo coordenadas via query.

Exemplo de URL Completa:
```
http://localhost:3008/regions/contains?lng=-46.624130&lat=-23.532500
```
Exemplo de Query:
```
lng=-46.624130
lat=-23.532500
```
Buscar Regiões Próximas a um Ponto (GET)

Rota: /regions/near  
Descrição: Lista regiões próximas a uma certa distância de um ponto. É possível filtrar regiões que não pertencem ao usuário autenticado.

Exemplo de URL Completa (Com Filtro de Usuário):
```
http://localhost:3008/regions/near?excludeUserId=675f1b20113cb12e14bed201&km=3100&lng=-45.7728598&lat=-23.1384991
```
Query:
```
excludeUserId=675f1b20113cb12e14bed201
km=3100
lng=-45.7728598
lat=-23.1384991
```
Exemplo de URL Completa (Sem Filtro de Usuário):
```
http://localhost:3008/regions/near?km=1000&lng=-45.7728598&lat=-23.1384991
```
🧪 Testes

Os testes de integração utilizam um banco em memória com mongodb-memory-server.
Executar os Testes
```
npm run test
```
Gerar Relatório de Cobertura
```
npm run test:coverage
```
