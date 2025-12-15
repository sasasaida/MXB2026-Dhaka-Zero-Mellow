import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
    const isOnline = useOnlineStatus();

    if (isOnline) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-white text-center p-2 z-50">
            You are currently offline. Some features may be limited.
        </div>
    );
}
