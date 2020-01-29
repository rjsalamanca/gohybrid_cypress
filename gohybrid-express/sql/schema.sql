DROP TABLE comparisons;
DROP TABLE users;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(200),
    email VARCHAR(500),
    password VARCHAR(500)
);

CREATE TABLE comparisons
(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    html VARCHAR(8000)
);
