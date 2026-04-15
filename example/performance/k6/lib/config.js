export const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
export const THINK_TIME_SECONDS = Number(__ENV.THINK_TIME_SECONDS || 0.2);

export function sleepSeconds() {
  return THINK_TIME_SECONDS;
}

export function getThresholds() {
  return {
    http_req_failed: ['rate<0.001'],
    'http_req_duration{operation:shell_by_id}': ['p(95)<500', 'p(99)<2000'],
    'http_req_duration{operation:submodel_by_id}': ['p(95)<500', 'p(99)<2000'],
    'http_req_duration{operation:submodel_element_by_path}': ['p(95)<500', 'p(99)<2000'],
    'http_req_duration{operation:serialization}': ['p(95)<500', 'p(99)<2000'],
  };
}
