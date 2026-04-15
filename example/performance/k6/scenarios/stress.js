import { sleep } from 'k6';
import { BASE_URL, getThresholds, sleepSeconds } from '../lib/config.js';
import { randomFixture, runCoreReadRequests } from '../lib/endpoints.js';

export const options = {
  scenarios: {
    stress: {
      executor: 'ramping-vus',
      startVUs: Number(__ENV.START_VUS || 5),
      stages: [
        { duration: __ENV.STAGE_1_DURATION || '2m', target: Number(__ENV.STAGE_1_TARGET || 50) },
        { duration: __ENV.STAGE_2_DURATION || '3m', target: Number(__ENV.STAGE_2_TARGET || 100) },
        { duration: __ENV.STAGE_3_DURATION || '3m', target: Number(__ENV.STAGE_3_TARGET || 150) },
        { duration: __ENV.STAGE_4_DURATION || '2m', target: Number(__ENV.STAGE_4_TARGET || 0) },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    ...getThresholds(),
    http_req_failed: ['rate<0.01'],
  },
};

export default function stressScenario() {
  runCoreReadRequests(BASE_URL, randomFixture());
  sleep(sleepSeconds());
}
