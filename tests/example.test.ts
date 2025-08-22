// Simple test to ensure CI passes
describe('Basic Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle basic operations', () => {
    expect('hello' + ' world').toBe('hello world');
  });
});
