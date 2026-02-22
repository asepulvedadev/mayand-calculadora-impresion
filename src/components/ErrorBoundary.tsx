'use client';

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Warning, Refresh } from '@mui/icons-material';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert className="max-w-md">
            <Warning className="h-4 w-4" />
            <AlertTitle>Algo salió mal</AlertTitle>
            <AlertDescription className="mt-2">
              Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
            </AlertDescription>
            <Button
              onClick={this.resetError}
              className="mt-4"
              variant="outline"
            >
              <Refresh className="mr-2 h-4 w-4" />
              Intentar de nuevo
            </Button>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}