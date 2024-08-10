// jest.setup.ts
import { configure } from '@testing-library/react';
import { setLogger } from 'react-query';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { server } from './mocks/server';

// Set up react-query logger
setLogger({
    log: console.log,
    warn: console.warn,
    error: () => { },
});

// Set up testing library
configure({ testIdAttribute: 'data-testid' });

// Set up MSW server
export const setupServerInstance = setupServer(
    rest.get('/api/*', (req, res, ctx) => {
        return res(ctx.json({ message: 'Mock API response' }));
    }),
    ...server,
);

beforeAll(() => setupServerInstance.listen());
afterEach(() => setupServerInstance.resetHandlers());
afterAll(() => setupServerInstance.close());

// Optional: Set up global mocks for dependencies
jest.mock('@/lib/llamaScheduler', () => ({
    llamaScheduler: jest.fn(),
}));

// Optional: Set up global mocks for next.js
jest.mock('next/router', () => ({
    useRouter: () => ({
        route: '/',
        pathname: '/',
        query: {},
        asPath: '/',
        push: jest.fn(),
        replace: jest.fn(),
        reload: jest.fn(),
    }),
}));