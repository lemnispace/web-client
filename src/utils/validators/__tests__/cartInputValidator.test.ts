/**
 * Tests for Cart Input Validation Schemas
 *
 * These schemas are used in API routes to validate incoming cart data.
 * Testing them ensures we reject invalid input and accept valid input.
 */

import { CartLineInputSchema, CartLineUpdateInputSchema } from '../cartInputValidator';

describe('CartLineInputSchema', () => {
  describe('valid input', () => {
    it('should accept valid cart line with required fields', () => {
      const validInput = {
        merchandiseId: 'var_123',
        quantity: 2,
      };

      const result = CartLineInputSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.merchandiseId).toBe('var_123');
        expect(result.data.quantity).toBe(2);
      }
    });

    it('should use default quantity of 1 when not provided', () => {
      const input = {
        merchandiseId: 'var_123',
      };

      const result = CartLineInputSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.quantity).toBe(1);
      }
    });

    it('should accept optional attributes', () => {
      const input = {
        merchandiseId: 'var_123',
        quantity: 2,
        attributes: [
          { key: 'color', value: 'red' },
          { key: 'size', value: 'large' },
        ],
      };

      const result = CartLineInputSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.attributes).toHaveLength(2);
        expect(result.data.attributes?.[0]).toEqual({ key: 'color', value: 'red' });
      }
    });

    it('should accept optional sellingPlanId', () => {
      const input = {
        merchandiseId: 'var_123',
        quantity: 1,
        sellingPlanId: 'plan_456',
      };

      const result = CartLineInputSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sellingPlanId).toBe('plan_456');
      }
    });
  });

  describe('invalid input', () => {
    it('should reject missing merchandiseId', () => {
      const input = {
        quantity: 2,
      };

      const result = CartLineInputSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should reject empty merchandiseId', () => {
      const input = {
        merchandiseId: '',
        quantity: 2,
      };

      const result = CartLineInputSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should reject negative quantity', () => {
      const input = {
        merchandiseId: 'var_123',
        quantity: -1,
      };

      const result = CartLineInputSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should reject zero quantity', () => {
      const input = {
        merchandiseId: 'var_123',
        quantity: 0,
      };

      const result = CartLineInputSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should reject non-numeric quantity', () => {
      const input = {
        merchandiseId: 'var_123',
        quantity: 'two',
      };

      const result = CartLineInputSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should reject attributes array exceeding 250 items', () => {
      const input = {
        merchandiseId: 'var_123',
        quantity: 1,
        attributes: Array.from({ length: 251 }, (_, i) => ({
          key: `key${i}`,
          value: `value${i}`,
        })),
      };

      const result = CartLineInputSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should reject attributes with missing key', () => {
      const input = {
        merchandiseId: 'var_123',
        quantity: 1,
        attributes: [{ value: 'red' }],
      };

      const result = CartLineInputSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should reject attributes with missing value', () => {
      const input = {
        merchandiseId: 'var_123',
        quantity: 1,
        attributes: [{ key: 'color' }],
      };

      const result = CartLineInputSchema.safeParse(input);

      expect(result.success).toBe(false);
    });
  });
});

describe('CartLineUpdateInputSchema', () => {
  describe('valid input', () => {
    it('should accept valid update with id and quantity', () => {
      const validInput = {
        id: 'item_123',
        quantity: 3,
      };

      const result = CartLineUpdateInputSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe('item_123');
        expect(result.data.quantity).toBe(3);
      }
    });

    it('should use default quantity of 1 when not provided', () => {
      const input = {
        id: 'item_123',
      };

      const result = CartLineUpdateInputSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.quantity).toBe(1);
      }
    });

    it('should accept optional merchandiseId', () => {
      const input = {
        id: 'item_123',
        merchandiseId: 'var_456',
        quantity: 2,
      };

      const result = CartLineUpdateInputSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.merchandiseId).toBe('var_456');
      }
    });

    it('should accept attributes for update', () => {
      const input = {
        id: 'item_123',
        quantity: 2,
        attributes: [{ key: 'note', value: 'Gift wrap please' }],
      };

      const result = CartLineUpdateInputSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.attributes).toHaveLength(1);
      }
    });
  });

  describe('invalid input', () => {
    it('should reject missing id', () => {
      const input = {
        quantity: 2,
      };

      const result = CartLineUpdateInputSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should reject empty id', () => {
      const input = {
        id: '',
        quantity: 2,
      };

      const result = CartLineUpdateInputSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should reject negative quantity', () => {
      const input = {
        id: 'item_123',
        quantity: -5,
      };

      const result = CartLineUpdateInputSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should accept zero quantity for item removal', () => {
      const input = {
        id: 'item_123',
        quantity: 0,
      };

      const result = CartLineUpdateInputSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.quantity).toBe(0);
      }
    });
  });

  describe('real-world scenarios', () => {
    it('should validate batch update of multiple items', () => {
      const items = [
        { id: 'item_1', quantity: 2 },
        { id: 'item_2', quantity: 5 },
        { id: 'item_3', quantity: 1 },
      ];

      items.forEach(item => {
        const result = CartLineUpdateInputSchema.safeParse(item);
        expect(result.success).toBe(true);
      });
    });

    it('should reject batch with any invalid item', () => {
      const items = [
        { id: 'item_1', quantity: 2 },
        { id: 'item_2', quantity: -1 }, // Invalid
        { id: 'item_3', quantity: 1 },
      ];

      const results = items.map(item => CartLineUpdateInputSchema.safeParse(item));

      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false); // Invalid item
      expect(results[2].success).toBe(true);
    });

    it('should handle item removal scenario (quantity 0 is valid)', () => {
      // The schema allows quantity: 0 for item removal
      // The route logic checks if quantity === 0 and calls removeCartItem instead
      const input = {
        id: 'item_123',
        quantity: 0,
      };

      const result = CartLineUpdateInputSchema.safeParse(input);

      // Schema validation succeeds for quantity 0
      // The route logic handles the removal by checking quantity === 0
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.quantity).toBe(0);
      }
    });
  });
});
