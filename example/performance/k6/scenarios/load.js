import { sleep } from 'k6';
import { BASE_URL, getThresholds, sleepSeconds } from '../lib/config.js';
import { randomFixture, runCoreReadRequests } from '../lib/endpoints.js';

export const options = {
  scenarios: {
    load: {
      executor: 'ramping-vus',
      startVUs: Number(__ENV.START_VUS || 1),
      stages: [
        { duration: __ENV.STAGE_1_DURATION || '3m', target: Number(__ENV.STAGE_1_TARGET || 20) },
        { duration: __ENV.STAGE_2_DURATION || '5m', target: Number(__ENV.STAGE_2_TARGET || 40) },
        { duration: __ENV.STAGE_3_DURATION || '3m', target: Number(__ENV.STAGE_3_TARGET || 0) },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: getThresholds(),
};

export default function loadScenario() {
  runCoreReadRequests(BASE_URL, randomFixture());
  sleep(sleepSeconds());
}
