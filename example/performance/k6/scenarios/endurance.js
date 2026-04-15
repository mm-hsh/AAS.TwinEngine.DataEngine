import { sleep } from 'k6';
import { BASE_URL, getThresholds, sleepSeconds } from '../lib/config.js';
import { randomFixture, runCoreReadRequests } from '../lib/endpoints.js';

export const options = {
  scenarios: {
    endurance: {
      executor: 'constant-vus',
      vus: Number(__ENV.VUS || 20),
      duration: __ENV.DURATION || '8h',
    },
  },
  thresholds: getThresholds(),
};

export default function enduranceScenario() {
  runCoreReadRequests(BASE_URL, randomFixture());
  sleep(sleepSeconds());
}
