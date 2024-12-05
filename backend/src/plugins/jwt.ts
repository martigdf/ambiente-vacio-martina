import jwt, { FastifyJWTOptions } from "@fastify/jwt";
import fp from "fastify-plugin";
import { FastifyReply, FastifyRequest } from "fastify";
import { authenticateFunction } from '../types/fastify.js';
import {query} from '../services/database.js';

const jwtOptions: FastifyJWTOptions = {
    secret: 'supersecret'
};

export default fp(async (fastify) => {
    fastify.register(jwt, jwtOptions);

    const authenticate: authenticateFunction = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.code(401).send({ error: 'Unauthorized' });
        }
    };

    fastify.decorate("authenticate", authenticate);

    const verifyAdmin: authenticateFunction = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
            const { id } = request.user as { id: number };
            const { rows } = await query(`SELECT role FROM users WHERE id = ${id}`);
            const role = rows[0].role;
            if (role !== 'admin') {
                reply.code(401).send({ error: `Unauthorized, you must be an admin and you are ${role}` });
            }
        } catch (err) {
            reply.code(401).send({ error: 'Unauthorized' });
        }
    }

    fastify.decorate("verifyAdmin", verifyAdmin);

    const verifySelfOrAdmin: authenticateFunction = async (request: FastifyRequest, reply: FastifyReply) => {
        try{
            await request.jwtVerify();
            const { id: userId } = request.params as { id: string };
            const { id } = request.user as { id: number };
            const { rows } = await query(`SELECT role FROM users WHERE id = ${id}`);
            const role = rows[0].role;
            if (role === 'admin' || id === Number(userId)) {
                return;
            }
        } catch (err) {
            reply.code(401).send({error: 'Unauthorized'})
        }
    }

    fastify.decorate("verifySelfOrAdmin", verifySelfOrAdmin);
});
