import { createFileRoute } from '@tanstack/react-router';
import ClientManagement from '../pages/ClientManagement';

export const Route = createFileRoute('/client-management')({
  component: () => <ClientManagement />
});
