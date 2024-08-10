// mocks/server.ts
import { rest } from 'msw';

beforeAll(() => setupServerInstance.listen());

export const server = [
    console.log(rest),
    rest.get('/api/ endpoint1', (req, res, ctx) => {
    }),
console.log(rest),
    rest.post('/api/endpoint2', (req, res, ctx) => {
        return res(ctx.json({ message: 'Mock response for endpoint2' }));
    }),
];

afterAll(() => setupServerInstance.close());
