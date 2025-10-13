/**
 * Tests for Schema Validators
 *
 * These validators are used throughout API routes for input validation.
 * Testing them ensures we properly validate all types of input data.
 */

import {
  requiredStringSchema,
  optionalStringSchema,
  requiredNumberSchema,
  optionalNumberSchema,
  requiredBooleanSchema,
  optionalBooleanSchema,
  requiredImageFileSchema,
  optionalImageFileSchema,
} from '../schemaValidators';
import { MAX_IMG_FILE_SIZE, MAX_IMG_FILE_SIZE_MB } from '../../constants';

describe('requiredStringSchema', () => {
  const schema = requiredStringSchema({
    name: 'TestField',
    description: 'A test field',
  });

  describe('valid input', () => {
    it('should accept valid non-empty string', () => {
      const result = schema.safeParse('valid string');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('valid string');
      }
    });

    it('should trim whitespace from strings', () => {
      const result = schema.safeParse('  trimmed  ');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('trimmed');
      }
    });

    it('should accept string with custom minLength', () => {
      const customSchema = requiredStringSchema({
        name: 'CustomField',
        description: 'Custom field',
        minLength: 5,
      });

      const result = customSchema.safeParse('12345');
      expect(result.success).toBe(true);
    });
  });

  describe('invalid input', () => {
    it('should reject empty string', () => {
      const result = schema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should reject whitespace-only string', () => {
      const result = schema.safeParse('   ');
      expect(result.success).toBe(false);
    });

    it('should reject non-string values', () => {
      expect(schema.safeParse(123).success).toBe(false);
      expect(schema.safeParse(null).success).toBe(false);
      expect(schema.safeParse(undefined).success).toBe(false);
      expect(schema.safeParse({}).success).toBe(false);
      expect(schema.safeParse([]).success).toBe(false);
    });

    it('should reject string shorter than minLength', () => {
      const customSchema = requiredStringSchema({
        name: 'CustomField',
        description: 'Custom field',
        minLength: 10,
      });

      const result = customSchema.safeParse('short');
      expect(result.success).toBe(false);
    });

    it('should include field name in error message', () => {
      const result = schema.safeParse(123);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessage = result.error.errors[0].message;
        expect(errorMessage).toContain('TestField');
      }
    });
  });
});

describe('optionalStringSchema', () => {
  const schema = optionalStringSchema({
    name: 'OptionalField',
    description: 'An optional field',
  });

  describe('valid input', () => {
    it('should accept valid non-empty string', () => {
      const result = schema.safeParse('valid string');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('valid string');
      }
    });

    it('should accept null', () => {
      const result = schema.safeParse(null);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });

    it('should accept undefined', () => {
      const result = schema.safeParse(undefined);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeUndefined();
      }
    });

    it('should trim whitespace from strings', () => {
      const result = schema.safeParse('  trimmed  ');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('trimmed');
      }
    });
  });

  describe('invalid input', () => {
    it('should reject empty string', () => {
      const result = schema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should reject whitespace-only string', () => {
      const result = schema.safeParse('   ');
      expect(result.success).toBe(false);
    });

    it('should reject non-string values (except null/undefined)', () => {
      expect(schema.safeParse(123).success).toBe(false);
      expect(schema.safeParse({}).success).toBe(false);
      expect(schema.safeParse([]).success).toBe(false);
    });
  });
});

describe('requiredNumberSchema', () => {
  const schema = requiredNumberSchema({
    name: 'NumberField',
    description: 'A number field',
  });

  describe('valid input', () => {
    it('should accept positive numbers', () => {
      const result = schema.safeParse(42);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(42);
      }
    });

    it('should accept negative numbers', () => {
      const result = schema.safeParse(-42);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(-42);
      }
    });

    it('should accept zero', () => {
      const result = schema.safeParse(0);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(0);
      }
    });

    it('should accept decimals', () => {
      const result = schema.safeParse(3.14);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(3.14);
      }
    });

    it('should accept numbers within min/max range', () => {
      const customSchema = requiredNumberSchema({
        name: 'RangeField',
        description: 'Range field',
        min: 1,
        max: 100,
      });

      expect(customSchema.safeParse(1).success).toBe(true);
      expect(customSchema.safeParse(50).success).toBe(true);
      expect(customSchema.safeParse(100).success).toBe(true);
    });
  });

  describe('invalid input', () => {
    it('should reject non-number values', () => {
      expect(schema.safeParse('123').success).toBe(false);
      expect(schema.safeParse(null).success).toBe(false);
      expect(schema.safeParse(undefined).success).toBe(false);
      expect(schema.safeParse({}).success).toBe(false);
      expect(schema.safeParse([]).success).toBe(false);
    });

    it('should reject NaN', () => {
      const result = schema.safeParse(NaN);
      expect(result.success).toBe(false);
    });

    it('should reject Infinity', () => {
      expect(schema.safeParse(Infinity).success).toBe(false);
      expect(schema.safeParse(-Infinity).success).toBe(false);
    });

    it('should reject numbers below min', () => {
      const customSchema = requiredNumberSchema({
        name: 'MinField',
        description: 'Min field',
        min: 10,
      });

      const result = customSchema.safeParse(5);
      expect(result.success).toBe(false);
    });

    it('should reject numbers above max', () => {
      const customSchema = requiredNumberSchema({
        name: 'MaxField',
        description: 'Max field',
        max: 100,
      });

      const result = customSchema.safeParse(150);
      expect(result.success).toBe(false);
    });

    it('should include field name in error message', () => {
      const result = schema.safeParse('not a number');
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessage = result.error.errors[0].message;
        expect(errorMessage).toContain('NumberField');
      }
    });
  });
});

describe('optionalNumberSchema', () => {
  const schema = optionalNumberSchema({
    name: 'OptionalNumber',
    description: 'Optional number',
  });

  describe('valid input', () => {
    it('should accept valid numbers', () => {
      const result = schema.safeParse(42);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(42);
      }
    });

    it('should accept null', () => {
      const result = schema.safeParse(null);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });

    it('should accept undefined', () => {
      const result = schema.safeParse(undefined);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeUndefined();
      }
    });
  });

  describe('invalid input', () => {
    it('should reject non-number values (except null/undefined)', () => {
      expect(schema.safeParse('123').success).toBe(false);
      expect(schema.safeParse({}).success).toBe(false);
      expect(schema.safeParse([]).success).toBe(false);
    });

    it('should reject NaN', () => {
      const result = schema.safeParse(NaN);
      expect(result.success).toBe(false);
    });
  });
});

describe('requiredBooleanSchema', () => {
  const schema = requiredBooleanSchema({
    name: 'BooleanField',
    description: 'A boolean field',
  });

  describe('valid input', () => {
    it('should accept true', () => {
      const result = schema.safeParse(true);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(true);
      }
    });

    it('should accept false', () => {
      const result = schema.safeParse(false);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(false);
      }
    });
  });

  describe('invalid input', () => {
    it('should reject non-boolean values', () => {
      expect(schema.safeParse(1).success).toBe(false);
      expect(schema.safeParse(0).success).toBe(false);
      expect(schema.safeParse('true').success).toBe(false);
      expect(schema.safeParse('false').success).toBe(false);
      expect(schema.safeParse(null).success).toBe(false);
      expect(schema.safeParse(undefined).success).toBe(false);
      expect(schema.safeParse({}).success).toBe(false);
      expect(schema.safeParse([]).success).toBe(false);
    });

    it('should include field name in error message', () => {
      const result = schema.safeParse('true');
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessage = result.error.errors[0].message;
        expect(errorMessage).toContain('BooleanField');
      }
    });
  });
});

describe('optionalBooleanSchema', () => {
  const schema = optionalBooleanSchema({
    name: 'OptionalBoolean',
    description: 'Optional boolean',
  });

  describe('valid input', () => {
    it('should accept true', () => {
      const result = schema.safeParse(true);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(true);
      }
    });

    it('should accept false', () => {
      const result = schema.safeParse(false);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(false);
      }
    });

    it('should accept null', () => {
      const result = schema.safeParse(null);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });

    it('should accept undefined', () => {
      const result = schema.safeParse(undefined);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeUndefined();
      }
    });
  });

  describe('invalid input', () => {
    it('should reject non-boolean values (except null/undefined)', () => {
      expect(schema.safeParse(1).success).toBe(false);
      expect(schema.safeParse(0).success).toBe(false);
      expect(schema.safeParse('true').success).toBe(false);
      expect(schema.safeParse({}).success).toBe(false);
      expect(schema.safeParse([]).success).toBe(false);
    });
  });
});

describe('requiredImageFileSchema', () => {
  const schema = requiredImageFileSchema({ name: 'ImageFile' });

  // Helper to create mock File objects
  const createMockFile = (type: string, size: number, name: string = 'test.jpg'): File => {
    const blob = new Blob(['x'.repeat(size)], { type });
    return new File([blob], name, { type });
  };

  describe('valid input', () => {
    it('should accept valid JPEG image', () => {
      const file = createMockFile('image/jpeg', 1024);
      const result = schema.safeParse(file);
      expect(result.success).toBe(true);
    });

    it('should accept valid PNG image', () => {
      const file = createMockFile('image/png', 2048);
      const result = schema.safeParse(file);
      expect(result.success).toBe(true);
    });

    it('should accept valid GIF image', () => {
      const file = createMockFile('image/gif', 512);
      const result = schema.safeParse(file);
      expect(result.success).toBe(true);
    });

    it('should accept valid WEBP image', () => {
      const file = createMockFile('image/webp', 1024);
      const result = schema.safeParse(file);
      expect(result.success).toBe(true);
    });

    it('should accept image at max file size', () => {
      const file = createMockFile('image/jpeg', MAX_IMG_FILE_SIZE);
      const result = schema.safeParse(file);
      expect(result.success).toBe(true);
    });

    it('should accept image just under max file size', () => {
      const file = createMockFile('image/jpeg', MAX_IMG_FILE_SIZE - 1);
      const result = schema.safeParse(file);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid input', () => {
    it('should reject non-File objects', () => {
      expect(schema.safeParse('file.jpg').success).toBe(false);
      expect(schema.safeParse(null).success).toBe(false);
      expect(schema.safeParse(undefined).success).toBe(false);
      expect(schema.safeParse({}).success).toBe(false);
      expect(schema.safeParse([]).success).toBe(false);
    });

    it('should reject non-image file types', () => {
      const pdfFile = createMockFile('application/pdf', 1024, 'document.pdf');
      const result = schema.safeParse(pdfFile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('must be an image');
      }
    });

    it('should reject text files', () => {
      const textFile = createMockFile('text/plain', 1024, 'file.txt');
      const result = schema.safeParse(textFile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('must be an image');
      }
    });

    it('should reject files exceeding max size', () => {
      const largeFile = createMockFile('image/jpeg', MAX_IMG_FILE_SIZE + 1);
      const result = schema.safeParse(largeFile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain(`less than ${MAX_IMG_FILE_SIZE_MB}MB`);
      }
    });

    it('should reject significantly oversized files', () => {
      const hugeFile = createMockFile('image/jpeg', MAX_IMG_FILE_SIZE * 2);
      const result = schema.safeParse(hugeFile);
      expect(result.success).toBe(false);
    });

    it('should include field name in error message', () => {
      const result = schema.safeParse('not a file');
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessage = result.error.errors[0].message;
        expect(errorMessage).toContain('ImageFile');
      }
    });
  });

  describe('real-world scenarios', () => {
    it('should validate typical product customization upload', () => {
      // Typical 2MB JPEG upload
      const file = createMockFile('image/jpeg', 2 * 1024 * 1024, 'customization.jpg');
      const result = schema.safeParse(file);
      expect(result.success).toBe(true);
    });

    it('should reject common mistake: passing file path instead of File object', () => {
      const result = schema.safeParse('/uploads/image.jpg');
      expect(result.success).toBe(false);
    });

    it('should reject common mistake: passing base64 string', () => {
      const base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRg...';
      const result = schema.safeParse(base64);
      expect(result.success).toBe(false);
    });
  });
});

describe('optionalImageFileSchema', () => {
  const schema = optionalImageFileSchema({ name: 'OptionalImage' });

  const createMockFile = (type: string, size: number): File => {
    const blob = new Blob(['x'.repeat(size)], { type });
    return new File([blob], 'test.jpg', { type });
  };

  describe('valid input', () => {
    it('should accept valid image file', () => {
      const file = createMockFile('image/jpeg', 1024);
      const result = schema.safeParse(file);
      expect(result.success).toBe(true);
    });

    it('should accept null', () => {
      const result = schema.safeParse(null);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });

    it('should accept undefined', () => {
      const result = schema.safeParse(undefined);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeUndefined();
      }
    });
  });

  describe('invalid input', () => {
    it('should reject non-image files', () => {
      const pdfFile = createMockFile('application/pdf', 1024);
      const result = schema.safeParse(pdfFile);
      expect(result.success).toBe(false);
    });

    it('should reject oversized files', () => {
      const largeFile = createMockFile('image/jpeg', MAX_IMG_FILE_SIZE + 1);
      const result = schema.safeParse(largeFile);
      expect(result.success).toBe(false);
    });

    it('should reject non-File objects (except null/undefined)', () => {
      expect(schema.safeParse('image.jpg').success).toBe(false);
      expect(schema.safeParse({}).success).toBe(false);
      expect(schema.safeParse([]).success).toBe(false);
    });
  });
});
