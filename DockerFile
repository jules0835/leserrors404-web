# Utiliser l'image officielle Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration du package (package.json, package-lock.json, etc.)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du projet dans le conteneur
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Lancer le serveur
CMD ["npm", "start"]
