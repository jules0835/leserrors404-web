# Étape 1: Utiliser une image de base avec Node.js
FROM node:18

# Étape 2: Définir le répertoire de travail
WORKDIR /app

# Étape 3: Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Étape 4: Installer les dépendances
RUN npm install

# Étape 5: Copier le reste des fichiers de l'application
COPY . .

# Étape 6: Construire le projet Next.js pour la production
RUN npm run build

# Étape 7: Exposer le port que Next.js va utiliser
EXPOSE 5002

# Étape 8: Lancer l'application Next.js en mode production
CMD ["npm", "start"]
