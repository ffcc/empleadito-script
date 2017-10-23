module.exports = {
    evaluate: function (expression, values){
        let evaluated = expression;
        let keys = Object.keys(values);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let token = "{{" + key + "}}";
            if (evaluated.includes(token)) {
                evaluated = evaluated.replace(token, values[key].toString());
            }
        }
        return evaluated;
    }
}