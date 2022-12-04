import { LimitToPipe } from './limit-to.pipe';

describe('LimitToPipe', () => {
  it('create an instance', () => {
    const pipe = new LimitToPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns same value when length is shorter than specified', () => {
    const pipe = new LimitToPipe();
    const result = pipe.transform('some text', '20');
    expect(result).toBe('some text');
  });

  it('returns limited value when length is longer than specified', () => {
    const pipe = new LimitToPipe();
    const result = pipe.transform('some text', '3');
    expect(result).toBe('som..');
  });

  it('returns empty string when value is empty', () => {
    const pipe = new LimitToPipe();
    const result = pipe.transform('', '3');
    expect(result).toBe('');
  });
});
