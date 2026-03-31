import { MainLayout } from './components/layout/MainLayout';
import { useUiStore } from './store/useUiStore';
import { LobbyView } from './views/LobbyView';
import { SlotView } from './views/SlotView';
import { ProfileView } from './views/ProfileView';
import { MinesView } from './games/mines/Views/MinesView';
import { TablesView } from './views/TablesView';

function App() {
  const currentView = useUiStore((state) => state.currentView);

  return (
    <MainLayout>
      {currentView === 'lobby' && <LobbyView />}
      {currentView === 'slots' && <SlotView />}
      {currentView === 'profile' && <ProfileView />}
      {currentView === 'mines' && <MinesView />}
      {currentView === 'tables' && <TablesView />}
    </MainLayout>
  );
}

export default App;
