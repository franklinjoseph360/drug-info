import '@testing-library/jest-dom';

// jsdom provides TextEncoder/TextDecoder, so assign to global if missing
if (typeof globalThis.TextEncoder === 'undefined') {
  // Only for Node environments <18
  const { TextEncoder, TextDecoder } = require('util');
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}
