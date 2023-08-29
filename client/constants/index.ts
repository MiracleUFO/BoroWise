const NODE_DEVELOPMENT = 'development';

const BASE_URL = 'https://esurio.serveo.net';

const ALLOWED_JOBS = [
  { key: '1', value: 'Education' },
  { key: '2', value: 'Manufacturing' },
  { key: '3', value: 'Trading' },
  { key: '4', value: 'Software' },
  { key: '5', value: 'Financial' },
  { key: '6', value: 'Advertisement' },
  { key: '7', value: 'Self Employed' },
  { key: '8', value: 'Other' },
];

const ALLOWED_ASSETS = [
  { key: '1', value: 'Land' },
  { key: '2', value: 'Building' },
  { key: '3', value: 'Vehicle' },
  { key: '4', value: 'Business' },
  { key: '5', value: 'Equipment' },
  { key: '6', value: 'Other' },
];

const CREDIT_SCORE_LABELS = [
  {
    name: 'Too Low',
    labelColor: '#ff2900',
    activeBarColor: '#ff2900',
  },
  {
    name: 'Low Score',
    labelColor: '#ff2900',
    activeBarColor: '#ff2900',
  },
  {
    name: 'Good Score',
    labelColor: '#f4ab44',
    activeBarColor: '#f4ab44',
  },
  {
    name: 'Very Good',
    labelColor: '#f4ab44',
    activeBarColor: '#f4ab44',
  },
  {
    name: 'Excellent Score',
    labelColor: '#00ff6b',
    activeBarColor: '#00ff6b',
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DATE_OPTIONS: any = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DATE_OPTIONS_SHORT: any = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export {
  NODE_DEVELOPMENT,
  BASE_URL,
  DATE_OPTIONS,
  DATE_OPTIONS_SHORT,
  CREDIT_SCORE_LABELS,
  ALLOWED_JOBS,
  ALLOWED_ASSETS,
};
