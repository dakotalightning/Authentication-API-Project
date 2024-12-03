# Authentication API Project

A secure authentication API built with NestJS, featuring JWT-based authentication, user registration, and protected routes.

## Features

- JWT-based authentication
- User registration with password hashing
- Protected routes with guards
- Redis-based session management
- Comprehensive test coverage

## Tech Stack

- NestJS - Progressive Node.js framework
- TypeScript - For type safety and better developer experience
- Redis - For session management
- JWT - For secure token-based authentication
- Jest - For unit and e2e testing

```mermaid
sequenceDiagram
    Client->>Server: POST /auth/register (Register)
    Server-->>Client: 200 OK
    Client->>Server: POST /auth/login (Login)
    Server-->>Client: JWT Token
    Client->>Server: Protected Requests with JWT
    Server-->>Client: Protected Resources
```

## Project setup

```bash
$ yarn install
```

## API Endpoints
Tha API provides the following endpoints:

### Public routes
```
GET / - Health check endpoint
POST /auth/register - Register new user
POST /auth/login - Authenticate user
```

### Protected Routes
```
GET /profile - Get user profile (requires authentication)
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Project Structure

The project follows NestJS's modular architecture:

- src/auth - Authentication module and related services
- src/users - User management module
- src/db - Database service and connections
- test - E2E test suites

## Development Approach

This project emphasizes:

- Clean Architecture principles for maintainable code
- Comprehensive testing strategy including unit and e2e tests
- Secure authentication practices using JWT
- Modular design following NestJS best practices

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are used for secure session management
- Protected routes are secured using Guards
- Input validation on all endpoints

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

### Examples

#### GET `/`
```
$ curl http://localhost:3000
```

#### Result:
```json
{ "message":"Hello World!" }
```
---
#### GET `/profile`
```
$ curl http://localhost:3000/profile
```
#### Result:
```json
{"statusCode":401,"message":"Unauthorized"}
```
---
#### POST `/auth/login`
```
$ curl -X POST http://localhost:3000/auth/login -d '{"username": "john", "password": "cH@ng3me"}' -H "Content-Type: application/json"
```
#### Result:
```json
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm... }
```
---
#### POST `/auth/register`
```
$ curl -X POST http://localhost:3000/auth/register -d '{"username": "john", "password": "cH@ng3me"}' -H "Content-Type: application/json"
```
#### Result:
```json
{"message":"User created successfully"}
```
---
#### GET `/profile` using access_token returned from previous step as bearer code
```
$ curl http://localhost:3000/users/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm..."
```

#### Result:
```json
{"username":"john"}
```


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Dakota Lightning](https://github.com/dakotalightning)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
