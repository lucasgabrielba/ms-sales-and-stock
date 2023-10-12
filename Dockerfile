FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x script.sh
EXPOSE 4092
CMD ["./script.sh"]

