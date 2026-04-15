import http from 'k6/http';
import { check } from 'k6';
import encoding from 'k6/encoding';

const PRODUCT_IDS = ['000-001', '000-002', '001-001'];

function toEncodedAasId(productId) {
  const plain = `https://mm-software.com/ids/aas/${productId}`;
  return encodeURIComponent(encoding.b64encode(plain));
}

function toEncodedSubmodelId(productId, submodelName) {
  const plain = `https://mm-software.com/submodel/${productId}/${submodelName}`;
  return encodeURIComponent(encoding.b64encode(plain));
}

const FIXTURES = PRODUCT_IDS.map((productId) => ({
  aasId: toEncodedAasId(productId),
  submodelTechnicalData: toEncodedSubmodelId(productId, 'TechnicalData'),
  submodelContact: toEncodedSubmodelId(productId, 'ContactInformation'),
  submodelNameplate: toEncodedSubmodelId(productId, 'Nameplate'),
  submodelCarbonFootprint: toEncodedSubmodelId(productId, 'CarbonFootprint'),
  submodelHandoverDocumentation: toEncodedSubmodelId(productId, 'HandoverDocumentation'),
}));

export function randomFixture() {
  return FIXTURES[Math.floor(Math.random() * FIXTURES.length)];
}

export function runCoreReadRequests(baseUrl, fixture) {
  const serializationUrl = `${baseUrl}/serialization?aasIds=${fixture.aasId}` +
    `&submodelIds=${fixture.submodelContact}` +
    `&submodelIds=${fixture.submodelNameplate}` +
    `&submodelIds=${fixture.submodelCarbonFootprint}` +
    `&submodelIds=${fixture.submodelHandoverDocumentation}` +
    `&submodelIds=${fixture.submodelTechnicalData}` +
    '&includeConceptDescriptions=false';

  const responses = http.batch([
    ['GET', `${baseUrl}/shells/${fixture.aasId}`, null, { tags: { operation: 'shell_by_id' } }],
    ['GET', `${baseUrl}/submodels/${fixture.submodelTechnicalData}`, null, { tags: { operation: 'submodel_by_id' } }],
    ['GET', `${baseUrl}/submodels/${fixture.submodelTechnicalData}/submodel-elements/GeneralInformation.ProductImage`, null, { tags: { operation: 'submodel_element_by_path' } }],
    ['GET', serializationUrl, null, { tags: { operation: 'serialization' } }],
  ]);

  for (const res of responses) {
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
  }
}
