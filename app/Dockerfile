FROM alpine:3.19
WORKDIR /app
COPY package.json .
RUN apk add --update npm && \
    npm install
COPY . ./
EXPOSE 3000 3443
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:3000/healthcheck || exit 1
CMD ["node", "app.js"]
