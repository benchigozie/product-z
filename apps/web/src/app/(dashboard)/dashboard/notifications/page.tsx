import NotificationsView from '@/components/general/NotificationsView';
import { ContentTransition } from '@/components/motion/ContenTransition';

export default function NotificationsPage() {

  return (
    <ContentTransition>
      <NotificationsView variant="dashboard" />;
    </ContentTransition>
  )
}