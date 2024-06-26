# Passos obrigatórios

- Passo 1 - Subir o cluster cockroachDB

```sh
docker-compose up
```

- Passo 2 - Conectar ao cluster

```sh
cockroach sql --insecure --host=localhost
```

- Passo 3 - Criar o database

```sql
CREATE DATABASE mydb;
```

- Passo 4 - Acessar o banco

```sql
USE mydb;
```

- Passo 5 - Criar a tabela

```sql
CREATE TABLE messages (
    id INT PRIMARY KEY,
    category STRING,
    content STRING
);
```

- Passo 6 - Iniciar o server

```sh
cd server && npm i && node index.js
```

---

# Passos adicionais

- Testar o client node.js

```sh
cd client && npm i && node index.js
```

- Testar o client python

```sh
cd client-python && python client.py
```

# Passos secundários

- Passo 1 - Criar o índice

```sql
CREATE INDEX idx_content_gin 
    ON messages 
    USING GIN (to_tsvector('portuguese_unaccent', content)
);
```
