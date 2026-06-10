import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface OnboardingState {
  hasCompletedTour: boolean;
  hasSeenStartHere: boolean;
  tourStep: number;
  dismissedPages: string[];
  started: boolean;
  lastActive: string;
}

const STORAGE_KEY = "spark-onboarding";

const DEFAULT_STATE: OnboardingState = {
  hasCompletedTour: false,
  hasSeenStartHere: false,
  tourStep: 0,
  dismissedPages: [],
  started: false,
  lastActive: "",
};

function loadState(): OnboardingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_STATE;
}

function saveState(state: OnboardingState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

interface OnboardingContextType {
  state: OnboardingState;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  dismissPage: (page: string) => void;
  markStarted: () => void;
  resetOnboarding: () => void;
  isNewUser: boolean;
  activeStep: number;
  showTour: boolean;
  showStartHere: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

const TOUR_STEPS = 5;

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(loadState);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const startTour = () => {
    setState(s => ({ ...s, tourStep: 0, started: true }));
    setShowTour(true);
  };

  const nextStep = () => {
    setState(s => {
      const next = Math.min(s.tourStep + 1, TOUR_STEPS - 1);
      return { ...s, tourStep: next };
    });
  };

  const prevStep = () => {
    setState(s => {
      const prev = Math.max(s.tourStep - 1, 0);
      return { ...s, tourStep: prev };
    });
  };

  const endTour = () => {
    setState(s => ({ ...s, hasCompletedTour: true, tourStep: 0 }));
    setShowTour(false);
  };

  const dismissPage = (page: string) => {
    setState(s => ({
      ...s,
      dismissedPages: [...s.dismissedPages, page],
    }));
  };

  const markStarted = () => {
    setState(s => ({ ...s, started: true }));
  };

  const resetOnboarding = () => {
    setState(DEFAULT_STATE);
    setShowTour(false);
  };

  const isNewUser = !state.hasCompletedTour && !state.started;
  const showStartHere = !state.hasSeenStartHere && !state.hasCompletedTour;

  const activeStep = state.tourStep;

  return (
    <OnboardingContext.Provider
      value={{
        state,
        startTour,
        nextStep,
        prevStep,
        endTour,
        dismissPage,
        markStarted,
        resetOnboarding,
        isNewUser,
        activeStep,
        showTour,
        showStartHere,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
