import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { ViewType } from '@/store/useUiStore';

type ViewComponent = ComponentType<object>;
type ViewModule = { default: ViewComponent };
type ViewLoader = () => Promise<ViewModule>;
type PreloadableView = LazyExoticComponent<ViewComponent> & {
  preload: ViewLoader;
};

const asDefault = <T extends ViewComponent>(
  module: Promise<{ [key: string]: T }>,
  exportName: string
): Promise<ViewModule> =>
  module.then((resolvedModule) => ({
    default: resolvedModule[exportName] as ViewComponent,
  }));

const viewLoaders: Record<ViewType, ViewLoader> = {
  lobby: () => asDefault(import('@/views/LobbyView'), 'LobbyView'),
  slots: () => asDefault(import('@/views/SlotView'), 'SlotView'),
  mines: () => asDefault(import('@/games/mines/Views/MinesView'), 'MinesView'),
  roulette: () => asDefault(import('@/games/roulette/Views/RouletteView'), 'RouletteView'),
  profile: () => asDefault(import('@/views/ProfileView'), 'ProfileView'),
  settings: () => asDefault(import('@/views/SettingsView'), 'SettingsView'),
};

const lazyWithPreload = (loader: ViewLoader): PreloadableView => {
  const LazyView = lazy(loader) as PreloadableView;
  LazyView.preload = loader;
  return LazyView;
};

export const viewRegistry: Record<ViewType, PreloadableView> = {
  lobby: lazyWithPreload(viewLoaders.lobby),
  slots: lazyWithPreload(viewLoaders.slots),
  mines: lazyWithPreload(viewLoaders.mines),
  roulette: lazyWithPreload(viewLoaders.roulette),
  profile: lazyWithPreload(viewLoaders.profile),
  settings: lazyWithPreload(viewLoaders.settings),
};

export const preloadView = (view: ViewType) => viewRegistry[view].preload();

export const preloadViews = (views: readonly ViewType[]) =>
  Promise.all(views.map((view) => preloadView(view)));
