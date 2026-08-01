import {
    CREATE_USER_QUERY,
    FIND_USER_BY_EMAIL_OR_USERNAME_QUERY,
    VERIFY_USER_QUERY,
    GET_USER_PASSWORD
} from "../queries/user.query.js";
import { pool } from "../config/database.js";

export async function createUser(username, email, password) {
    const client = await pool.connect();
    try {
        const result = await client.query(CREATE_USER_QUERY, [username, email, password]);
        return result.rows[0];
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    } finally {
        client.release();
    }
}

export async function findUserByEmailOrUsername(EmailOrUsername , EmailOrUsername2) {
    const client = await pool.connect();
    try {
        const result = await client.query(FIND_USER_BY_EMAIL_OR_USERNAME_QUERY, [EmailOrUsername , EmailOrUsername2]);
        return result.rows[0];
    } catch (error) {
        throw new Error(`Error finding user: ${error.message}`);
    } finally {
        client.release();
    }
}

export async function verifyUser(userID){
    const client = await pool.connect();
    try {
        const result = await client.query(VERIFY_USER_QUERY, [userID]);
        return result.rows[0];
    } catch (error) {
        throw new Error(`Error verifying user: ${error.message}`);
    } finally {
        client.release();
    }
}

export async function getUserPassword(EmailOrUsername , EmailOrUsername2) {
    const client = await pool.connect();
    try {
        const result = await client.query(GET_USER_PASSWORD, [EmailOrUsername , EmailOrUsername2]);
        return result.rows[0].password_hash;
    } catch (error) {
        throw new Error(`Error fetching user password: ${error.message}`);
    } finally {
        client.release();
    }
}