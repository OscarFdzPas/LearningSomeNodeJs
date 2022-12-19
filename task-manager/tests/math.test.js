const math = require('../src/math');

test('Should calculate total with tip', () => {
    const total = math.calculateTip(10, 0.3);
    expect(total).toBe(13)

    // if(total !== 13) throw new Error("Total tip should be 13. Got " + total);
});

test('Should convert 32 F to 0 C', () => {
    const temp = math.fahrenheitToCelsius(32);
    expect(temp).toBe(0)
});

test('Should convert 0 C to 32 F', () => {
    const temp = math.celsiusToFahrenheit(0);
    expect(temp).toBe(32)
});

// test('Async test demo', (done) => {
//     setTimeout(() => {
//         expect(2).toBe(2);
//         done()
//     }, 2000);
// });

// test('Should add two numbers', (done) => {
//     math.add(2, 2).then(sum => {
//         expect(sum).toBe(5);
//         done()
//     });
// });

test('Should add two numbers', async () => {
    const sum = await math.add(2, 2);
    expect(sum).toBe(4);
});

// test("Hello test", () => {});
// test("Fail test", () => {
//     throw new Error("Fatal error")
// });