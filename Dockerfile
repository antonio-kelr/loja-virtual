FROM node:20

WORKDIR /app

# Copia só os arquivos de dependência primeiro
COPY package*.json ./

# Instala dependências
RUN npm install --legacy-peer-deps

# Copia o resto do projeto
COPY . .

# Instala o Angular CLI globalmente
RUN npm install -g @angular/cli

EXPOSE 4200

# Corrige o CMD
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
