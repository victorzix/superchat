import { Transform } from 'class-transformer';
import * as xss from 'xss';

export function Sanitize() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      const sanitizedValue = xss.filterXSS(value);
      return sanitizedValue;
    }

    return value;
  });
}
