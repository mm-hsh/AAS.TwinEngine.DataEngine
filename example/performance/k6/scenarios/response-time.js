import { sleep } from 'k6';
import { BASE_URL, getThresholds, sleepSeconds } from '../lib/config.js';
import { randomFixture, runCoreReadRequests } from '../lib/endpoints.js';

export const options = {
  scenarios: {
    response_time: {
      executor: 'constant-arrival-rate',
      rate: Number(__ENV.RATE || 10),
      timeUnit: '1s',
      duration: __ENV.DURATION || '3m',
      preAllocatedVUs: Number(__ENV.PREALLOCATED_VUS || 20),
      maxVUs: Number(__ENV.MAX_VUS || 100),
    },
  },
  thresholds: getThresholds(),
};

export default function responseTimeScenario() {
  runCoreReadRequests(BASE_URL, randomFixture());
  sleep(sleepSeconds());
}
