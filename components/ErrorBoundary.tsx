import React, { ErrorInfo, ReactNode } from 'react';
import { Code } from '@/components/typography/code';
import { Link } from '@/components/typography/link';

interface ErrorBoundaryProps {
    fallback: ReactNode; // Fallback UI to render in case of error
    children: ReactNode;
    tenantId?: string; // Optional: Add tenantId prop for tenant context
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: React.ReactNode | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Example: Handling Clerk-specific errors
        if (error.message.includes('@clerk/clerk-react') && error.message.includes('publishableKey')) {
            return {
                hasError: true,
                error: (
                    <div>
                        <p>
                            Add{' '}
                            <Code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY={'"<your publishable key>"'}</Code>{' '}
                            to the <Code>.env.local</Code> file
                        </p>
                        <p>
                            You can find it at{' '}
                            <Link href="https://clerk.dashboard.com" target="_blank">
                                Clerk Dashboard
                            </Link>
                        </p>
                    </div>
                ),
            };
        }
        return {
            hasError: true,
            error: (
                <div>
                    <p>Something went wrong. Please try again later.</p>
                </div>
            ),
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.logErrorToCentralService(error, errorInfo);
    }

    logErrorToCentralService(error: Error, errorInfo: ErrorInfo) {
        const { tenantId } = this.props;
        // Example: Replace with your centralized logging service integration
        console.error(`[Tenant ${tenantId}] ErrorBoundary caught an error:`, error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="bg-destructive/30 p-8 flex flex-col gap-4 container">
                    <h1 className="text-xl font-bold">Caught an error while rendering:</h1>
                    {this.state.error}
                </div>
            );
        }
        return this.props.children || this.props.fallback; // Render children or fallback UI
    }
}

export default ErrorBoundary;
