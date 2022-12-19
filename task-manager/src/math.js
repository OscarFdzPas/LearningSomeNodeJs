const calculateTip = (total, tipPercent) => total + (total * tipPercent);

const fahrenheitToCelsius = (temp) => (temp - 32) / 1.8;

const celsiusToFahrenheit = (temp) => (temp * 1.8) + 32; 

const add = (a, b) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if(a < 0 || b < 0) return rej('Numbers must be non-negative')
            res(a + b)
        }, 2000);
    });
}

module.exports = {
    calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
}