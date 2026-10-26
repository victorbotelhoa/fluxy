const FLM = {
    QuestsTypes: {
        Subtraction: 'sub',
        Addition: 'add',
        Multiplication: 'mul',
        Division: 'div'
    }
}

FLM.operationCreate = async (questType, num) => {
    if (num < 2) throw new Error("num precisa ser pelo menos 2");

    let operation = "";
    let result;

    
    let numbers = [];

    for (let i = 0; i < num; i++) {
        numbers.push(i + 1); 
    }

    switch (questType) {

        case FLM.QuestsTypes.Addition:
            operation = numbers.join(" + ");
            result = numbers.reduce((acc, n) => acc + n, 0);
            break;

        case FLM.QuestsTypes.Subtraction:
            operation = numbers.join(" - ");
            result = numbers.reduce((acc, n) => acc - n);
            break;

        case FLM.QuestsTypes.Multiplication:
            operation = numbers.join(" * ");
            result = numbers.reduce((acc, n) => acc * n, 1);
            break;

        case FLM.QuestsTypes.Division:
            operation = numbers.join(" / ");
            result = numbers.reduce((acc, n) => acc / n);
            break;

        default:
            throw new Error("Tipo de operação inválido");
    }

    return {
        operation,
        result
    };
};

export default FLM