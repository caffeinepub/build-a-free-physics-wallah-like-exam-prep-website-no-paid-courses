import { Loader2, AlertCircle } from 'lucide-react';

interface QueryStateProps {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  error?: Error | null;
  loadingMessage?: string;
  emptyMessage?: string;
  errorMessage?: string;
}

export default function QueryState({
  isLoading,
  isError,
  isEmpty,
  error,
  loadingMessage = 'Loading...',
  emptyMessage = 'No data available',
  errorMessage = 'Something went wrong'
}: QueryStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-muted-foreground">{loadingMessage}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive mb-1">Error</h3>
              <p className="text-sm text-muted-foreground">
                {error?.message || errorMessage}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-lg border bg-muted/30 p-8 max-w-md text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return null;
}
