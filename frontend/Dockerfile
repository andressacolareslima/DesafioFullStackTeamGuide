# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# Instala as dependências da interface mantendo a lógica de pacotes legados
RUN npm install --legacy-peer-deps
COPY . .
# Passa a variável da Render para dentro do container na hora de compilar o Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Cria a pasta /dist para produção (Vite)
RUN npm run build

# Serve stage
FROM nginx:alpine
# Copia o código otimizado do React para a pasta nativa do servidor WEB
COPY --from=build /app/dist /usr/share/nginx/html
# Injete as regras nativas de roteamento SPA (para evitar o ERRO 404 em recarregamento de abas)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
