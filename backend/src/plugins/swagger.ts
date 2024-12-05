import swagger, {SwaggerOptions} from '@fastify/swagger';
import fp from 'fastify-plugin'
import swaggerUI from '@fastify/swagger-ui';

const options : SwaggerOptions = {
    openapi: {
        openapi: '3.0.0',
        info: {
            title: 'Project API',
            description: 'Project API Documentation',
            version: '0.1.0'
        },
        servers: [
            {
                url: 'http://localhost/backend',
                description: 'Development server'
            }
        ],
        tags: [
//            {name: 'auth', description: 'Auth description'},
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT",
                }
            }
        },
        security: [
            {
              bearerAuth: [],
            },
        ],
        externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
        }
    }
}

export default fp<SwaggerOptions>(async (fastify) => {
    fastify.register(swagger, options);
    await fastify.register(swaggerUI, {routePrefix: 'docs',
        uiConfig: {
            docExpansion: 'none',
            deepLinking: false
        },
        uiHooks: {
            onRequest: function (request, reply, next) { next() },
            preHandler: function (request, reply, next) { next() }
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
        transformSpecificationClone: true})
})


