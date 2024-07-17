# Passos obrigatórios

- Passo 1 - Subir o cluster cockroachDB

```sh
docker-compose up
```

- Passo 2 - Conectar ao cluster

- - (<https://www.cockroachlabs.com/docs/stable/cockroach-sql-binary?filters=linux>)

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
    USING GIN (to_tsvector('portuguese', content)
);
```

---

```sql
SELECT id, category, ts_rank(document, query) AS rank
    FROM messages, to_tsvector(content) document, to_tsquery('tecnologia') query
WHERE query @@ document
    ORDER BY rank DESC
LIMIT 10;
```

```sql
SELECT id, category, content, ts_rank(document, query) AS rank
    FROM messages, to_tsvector(content) document, plainto_tsquery('autonomos') query
WHERE query @@ document
    ORDER BY rank DESC
LIMIT 10;
```

```sql
SELECT id, category, content, ts_rank(document, query) AS rank
    FROM messages, to_tsvector(content) document, phraseto_tsquery('o empregado com o advento') query
WHERE query @@ document
    ORDER BY rank DESC
LIMIT 10;
```

----
WITH search_terms AS (
    SELECT
        unnest(string_to_array(unaccent('o empreg com o advento'), ' ')) AS term
),
search_query AS (
    SELECT
        string_agg(term || ':*', ' | ') AS query
    FROM
        search_terms
)
SELECT
    id,
    category,
    content,
    ts_rank(document, to_tsquery('portuguese', query)) AS rank
FROM
    messages,
    to_tsvector('portuguese', unaccent(content)) document,
    (SELECT query FROM search_query) AS q(query)
WHERE
    to_tsquery('portuguese', query) @@ document
ORDER BY
    rank DESC
LIMIT 10;

```sql
WITH search_terms AS (
    SELECT 
        unnest(string_to_array(unaccent('esu'), ' ')) || ':*' AS term
),
search_query AS (
    SELECT 
        string_agg(term, ' | ') AS query
    FROM 
        search_terms
)
SELECT 
    id, 
    category, 
    content, 
    ts_rank(document, to_tsquery('portuguese', query)) AS rank
FROM 
    messages, 
    to_tsvector('portuguese', unaccent(content)) document, 
    (SELECT query FROM search_query) AS q(query)
WHERE 
    to_tsquery('portuguese', query) @@ document
ORDER BY 
    rank DESC
LIMIT 10;

```

```sql
SELECT 
    id, 
    category, 
    content, 
    ts_rank(document, query) AS rank
FROM 
    messages, 
    to_tsvector('portuguese', unaccent(content)) document, 
    to_tsquery('portuguese', unaccent('jesus')) query
WHERE 
    query @@ document
ORDER BY 
    rank DESC
LIMIT 10;
```

```sql
SELECT id, category, content, ts_rank(document, query, query_plaint, query_phrase) AS rank
    FROM messages, to_tsvector(content) document,
    to_tsquery('tecnologia') query,
    plainto_tsquery('autonomos') query_plaint,
    phraseto_tsquery('o empregado com o advento') query_phrase
WHERE query @@ document
    ORDER BY rank DESC
LIMIT 10;
```

---

```sql
INSERT INTO messages (id, category, content) VALUES (
    1,
    'privado',
    '
Jesus

A Inovação na Era Digital

No mundo contemporâneo, a inovação digital tornou-se um pilar essencial para o desenvolvimento econômico e social. À medida que a tecnologia avança, ela transforma indústrias, altera dinâmicas de mercado e impacta profundamente a maneira como vivemos e trabalhamos. Este artigo explora as várias facetas da inovação na era digital, destacando suas implicações, benefícios e desafios.

A inovação digital não é apenas uma questão de desenvolver novas tecnologias, mas também de encontrar maneiras criativas de aplicá-las. Empresas ao redor do mundo estão utilizando a inteligência artificial, a internet das coisas (IoT), e o big data para otimizar operações, melhorar a eficiência e criar novos produtos e serviços. Essas tecnologias emergentes estão revolucionando setores como saúde, educação, transporte e manufatura.

Na área da saúde, por exemplo, a telemedicina está transformando a maneira como os pacientes interagem com os profissionais de saúde. A capacidade de realizar consultas virtuais não só aumenta o acesso aos cuidados médicos, mas também permite uma monitoração mais eficaz de condições crônicas. Além disso, a análise de big data está permitindo avanços significativos na pesquisa médica, ajudando a identificar padrões e tendências que podem levar a novas descobertas e tratamentos.

A educação também está passando por uma revolução digital. Com o advento das plataformas de aprendizagem online, o acesso ao conhecimento tornou-se mais democrático. Alunos de todas as partes do mundo podem agora acessar cursos de instituições renomadas, muitas vezes gratuitamente. A personalização do ensino, facilitada por algoritmos de aprendizado de máquina, está permitindo que os educadores adaptem o conteúdo às necessidades individuais dos estudantes, melhorando assim os resultados educacionais.

O transporte é outro setor que está sendo remodelado pela inovação digital. Veículos autônomos, sistemas de transporte inteligente e a logística baseada em dados estão tornando as viagens mais seguras e eficientes. As cidades estão se tornando mais inteligentes, com infraestrutura conectada que pode gerir o tráfego em tempo real, reduzir congestionamentos e diminuir a poluição.

No setor de manufatura, a automação e a robótica estão otimizando as linhas de produção. As fábricas inteligentes, equipadas com sensores IoT, podem monitorar e ajustar processos em tempo real, minimizando desperdícios e aumentando a produtividade. A impressão 3D está possibilitando a produção de protótipos rápidos e a customização em massa, revolucionando o design e a fabricação de produtos.

Apesar dos muitos benefícios, a inovação digital também traz desafios significativos. A questão da privacidade e segurança dos dados tornou-se uma preocupação central à medida que mais informações pessoais são coletadas e armazenadas online. A cibersegurança é uma área crítica que precisa de constante vigilância e atualização para proteger contra ameaças e ataques. Além disso, a rápida evolução tecnológica pode levar à obsolescência de habilidades e empregos, exigindo que a força de trabalho se adapte constantemente para manter-se relevante.

A inclusão digital é outro desafio importante. Enquanto muitos desfrutam dos benefícios da inovação tecnológica, há uma parte significativa da população mundial que ainda não tem acesso à internet ou a dispositivos digitais. Fechar essa lacuna é essencial para garantir que todos possam participar e beneficiar-se da era digital.

Em conclusão, a inovação na era digital oferece vastas oportunidades para transformar nossa sociedade de maneiras positivas. No entanto, é crucial abordar os desafios associados a essa transformação de maneira proativa e ética. A colaboração entre governos, empresas e sociedade civil será fundamental para garantir que a inovação tecnológica seja inclusiva, segura e benéfica para todos.'
);
```

```sql
WITH search_terms AS (
    SELECT 
        unnest(string_to_array(unaccent('mpre'), ' ')) || ':*' AS term
),
search_query AS (
    SELECT 
        string_agg(term, ' | ') AS query
    FROM 
        search_terms
),
ranked_messages AS (
    SELECT 
        id, 
        category, 
        content, 
        ts_rank(to_tsvector('portuguese', unaccent(content)), to_tsquery('portuguese', query)) AS rank
    FROM 
        messages, 
        to_tsvector('portuguese', unaccent(content)) document, 
        (SELECT query FROM search_query) AS q(query)
    WHERE 
        to_tsquery('portuguese', query) @@ document
)
SELECT 
    id, 
    category, 
    content, 
    rank
FROM 
    ranked_messages
ORDER BY 
    rank DESC
LIMIT 10;
```
