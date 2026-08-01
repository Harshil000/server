const CREATE_USER_QUERY = `
    INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email;
`;

const FIND_USER_BY_EMAIL_OR_USERNAME_QUERY = `
    SELECT id, username, email , verified FROM users WHERE email = $1 OR username = $2;
`;

const VERIFY_USER_QUERY = `
    UPDATE users SET verified = true WHERE id = $1 RETURNING id, username, email, verified;
`;

const GET_USER_PASSWORD = `
    SELECT password_hash FROM users WHERE email = $1 OR username = $2;
`;

export { CREATE_USER_QUERY, FIND_USER_BY_EMAIL_OR_USERNAME_QUERY, VERIFY_USER_QUERY, GET_USER_PASSWORD };