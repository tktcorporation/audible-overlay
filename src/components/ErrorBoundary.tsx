import { Component, ErrorInfo, ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

interface Props extends WithTranslation {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryComponent extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('エラーが発生しました:', error);
    console.error('エラー詳細:', errorInfo);
  }

  public render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
            {t('error.title')}
          </h2>
          <p className="mt-2 text-sm text-red-600 dark:text-red-300">
            {t('error.message')}
          </p>
          {/* ErrorDetails */}
          <div className="mt-4">
            <p className="text-sm text-red-600 dark:text-red-300">
              {JSON.stringify(this.state.error)}
            </p>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            {t('error.reload')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryComponent); 
