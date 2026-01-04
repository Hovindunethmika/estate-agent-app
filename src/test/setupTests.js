require('@testing-library/jest-dom');

// Mock lucide-react icons globally for all tests
jest.mock('lucide-react', () => ({
  Search: () => null,
  X: () => null,
  FileText: () => null,
  Home: () => null,
  Map: () => null,
  Heart: () => null,
  ChevronLeft: () => null,
  ChevronRight: () => null,
  Download: () => null,
  Share2: () => null,
  AlertCircle: () => null,
  CheckCircle: () => null,
  Clock: () => null,
  MapPin: () => null,
  Trash2: () => null,
}));

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock fetch globally
global.fetch = jest.fn();

// Suppress React warnings for react-widgets props that aren't standard HTML
// These warnings are expected because react-widgets v5.8.0 passes custom component props
// through to DOM elements, which React validates. These props work correctly at runtime
// and don't appear in production builds.
const originalError = console.error;
global.console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('React does not recognize the `caseSensitive` prop') ||
     args[0].includes('React does not recognize the `allowCreate` prop'))
  ) {
    return; // Suppress these expected react-widgets warnings in tests
  }
  originalError(...args);
};

// Reset mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});
