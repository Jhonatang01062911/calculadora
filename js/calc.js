// Captura o elemento input com id "calcs", o input de valores
let elm_calcs = document.getElementById("calcs");

//Guarda a última operação
let last_opt = [null, null];
// Guarda o último tipo de parênteses, caso haja algum
let last_par = null;

// Limpa o input de valores e coloca o valor da última operação como "null"
function clear_ops() {
    elm_calcs.value = "";
    last_opt = [null, null];
    last_par = null;
}

// Mostra o resultado
function result_ops() {
    // Expressões regulares para busca
    let altern = [
        /\^/g,
        /\x/g,
        /([^0-9\)\π])$/g,
        /(\([^\d\π]*\))/g,
        /([0-9]|[\(]|[\)])(\π)/g,
        /(\π)([0-9]|[\)]|[\(])/g,
        /([0-9]|[\π]|[\)])(\()/g,
        /(\))([0-9]|[\π]|[\(])/g,
        /\π/g
    ];
    // Substituições para as expressões regulares
    let alterns = [
        "**",
        "*",
        "",
        "",
        "$1*$2",
        "$1*$2",
        "$1*$2",
        "$1*$2",
        "Math.PI"
    ]
    
    // Variavel para o resultado
    let result = elm_calcs.value.trim();

    // Loop para utilizar todas as expressões regulares
    for (let i = 0; i < altern.length; i++) {
        if (result.match(altern[i]) != null) 
            result = result.replaceAll(altern[i], alterns[i]);
    }
    
    // Tenta calcular o resultado
    try {
        elm_calcs.value = eval(result);
        last_opt = [0, elm_calcs];
    } catch (error) {
        // Em caso de falha retorna uma alerta
        alert("Não foi possível realizar conta, verifique se não está faltando algo.");
    }
}

function the_op() {
    // Captura o tipo de operação dado pelos elementos com classe "op_cal" pelo data-type
    /*
        0 - Número
        1 - Operação
        2 - parênteses
        3 - Número PI
        4 - Limpeza
        5 - Resultado
    */
    let v_otype = parseInt(this.dataset.type);
    // Captura o valor da operação dado pelos elementos com classe "op_cal" pelo data-value
    let v_op = this.dataset.value;

    if (elm_calcs.value == "" && v_otype == 0 || v_otype == 0) {
        // Verifica se os valores estão vazios e se a operação é numérica, ou verifica se é uma operação numérica
        // Insere o número no input de valores
        elm_calcs.value += v_op;
    }
    else if (v_otype == 1 && last_opt[0] != 1 && last_opt[0] != null && last_opt[1] != "(") {
        // Verifica se a uma operação, se a última operação é diferente de "1" ou se é diferente de "null"
        // Insere a operação no input de valores
        if (v_op != ".") {
            elm_calcs.value += " " + v_op + " ";
        }
        else {
            elm_calcs.value += v_op;
        }
    }
    else if (v_otype == 2) {
        // Adiciona os parênteses
        if (last_opt[0] == 2) {
            // Checa qual foi o último tipo de operação, e caso seja "2" repete o último valor
            elm_calcs.value += last_opt[1];
            // Troca o valor da operação
            v_op = last_opt[1];
        }
        else {
            // Checa se já foi adicionado um parênteses
            if (last_par == null || last_opt[0] != 2 && last_par != "(") {
                // Checa se já for adicionado um parêntese
                elm_calcs.value += "(";
                // Troca o valor da operação
                v_op = "(";
            } else {
                if (last_opt[0] != 1) {
                    elm_calcs.value += ")";
                    // Troca o valor da operação
                    v_op = ")";
                } else {
                    return;
                }
            }
        }

        last_par = v_op;
    }
    else if (v_otype == 3 && last_opt[0] != 0 && last_opt[0] != 3) {
        // Adiciona o número PI
        elm_calcs.value += v_op;
    }
    else if (v_otype == 4) {
        // Verifica se a operação é do tipo limpeza
        clear_ops();
        return;
    }
    else if (v_otype == 5 && elm_calcs.value != "") {
        // Verifica se a operação é do tipo resultado
        result_ops();
    }
    else {
        // Para a função caso não seja nenhuma das ocorrências
        return false;
    }

    // Guarda último tipo de operação e o último valor
    last_opt = [v_otype, v_op];
}

// Captura o evento de "click" de todos os elementos com a classe "op_cal"
const ops = document.getElementsByClassName("op_cal");
for (let i = 0; i < ops.length; i++) {
    ops[i].addEventListener("click", the_op, false)
}
