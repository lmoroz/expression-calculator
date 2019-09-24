function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    expr = '(' + expr.replace(/ /gi, '') + ')';
    let brackets;

    while ((brackets = expr.match(/\([0-9.n\+\-\*\/]*\)/g)) != null) {
        brackets.forEach(br => {
            let replacer = br;
            while (replacer.charAt(0) === '(' &&
            replacer.charAt(replacer.length - 1) === ')') {
                replacer = replacer.substring(1, replacer.length - 1);
            }
            replacer.match(/[0-9.n\*\/]+/g).
                forEach(m => { replacer = replacer.replace(m, solve(m)); });
            replacer = solve(replacer);
            expr = expr.replace(br, replacer);
        });
    }

    function solve(simpleExpr) {

        const foi = simpleExpr.search(/[\/\*\-\+]/);

        if (foi === -1) return simpleExpr;
        if (simpleExpr.charAt(0) === 'n') simpleExpr = simpleExpr.replace('n',
            '-');

        let result = +simpleExpr.substring(0, foi);
        let operation = simpleExpr.charAt(foi);
        let second = '';

        for (let i = foi + 1; i < simpleExpr.length; i++) {
            const currChar = simpleExpr.charAt(i);

            if (currChar === 'n') second += '-';
            else if ('/*+-'.search(new RegExp('\\' + currChar)) !== -1
                || i === simpleExpr.length - 1) {

                if (i === simpleExpr.length - 1) second += currChar;
                if (operation === '/') {
                    if (second === '0') throw 'TypeError: Division by zero.';
                    result /= second;
                } else if (operation === '*') result *= second;
                else if (operation === '+') result += (+second);
                else result -= second;
                second = '';
                operation = currChar;
            } else second += currChar;
        }
        if (Math.abs(result) < 1) result = result.toFixed(12);
        if (result < 0) result = 'n' + (-result);
        return result + '';

    }

    if (expr.match(/[)\(]+/)) throw 'ExpressionError: Brackets must be paired';
    if (expr.charAt(0) === 'n') expr = expr.replace('n', '-');
    return +expr;
}

module.exports = {
    expressionCalculator,
};
