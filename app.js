(function(){
    'use strict';

    $(document).ready(function(){

        // module that implements the calculator
        function calculator(){
            let display = {
                    input: '',
                    result: ''
                },
                expr = {
                    strOperands : [],
                    operands : [],
                    operation : [],
                    result : 0,
                },
                isTyping = true;

            //handle the digits entered
            function setInput(d){

                // if equal is pressed, the result is moved to the input area and the loop starts again
                if ( d === '='){
                    isTyping = false;
                    display.input = expr.result;
                    display.result= '';

                    // console.log(expr.result);
                }
                else if ( d === 'AC'){
                    // if the user is still typing the operation, the key just deletes one digit at a time (DEL)
                    if (isTyping){
                        display.input = delChar(display.input);
                        expr = getExpression(display.input);
                        display.result = expr.result.toString();
                    }

                    // if equal was pressed, the key clears memory (CLR)
                    else{
                        clrMemory();
                        isTyping = true;
                    }
                }
                // while the user types the expression, get operands and operators
                else{
                    isTyping = true;
                    display.input += d;
                    expr = getExpression(display.input);
                    display.result = expr.result.toString();
                }
                return display;
            }


            // clear the memory completely
            function clrMemory(){
                display.input= '';
                display.result= '';
                expr.strOperands = [];
                expr.operands = [];
                expr.operation = [];
                expr.result = 0;
            }

            // delete one inserted character
            function delChar(str){
                if (str !== undefined && str.length >= 1)
                    return str.slice(0, length - 1);
                return '';
            }

            // expose the state of AC button
            // we don't want to change the text on the button from the inside of the module
            // it should be done from the outside, to respect the separation of concerns principle
            function getDelState(){
                return isTyping;
            }

            //discriminate numbers and signs by using a regex
            function getExpression(str){
                let newExpr = {
                    strOperands : [],
                    operands : [],
                    operation : [],
                    result : 0,
                }
                newExpr.strOperands = str.match(/(\d+\.\d+|\d+)/g);
                newExpr.operation = str.match(/[^\d*\.]/g);

                // convert operands to float
                if (newExpr.strOperands !== null){
                    newExpr.operands = newExpr.strOperands.map(parseFloat);
                    newExpr.result = calcExpression(newExpr.operands, newExpr.operation);
                }

                // console.log(newExpr.strOperands, newExpr.operation, newExpr.result);
                return newExpr;
            }

            // calculate concatenated expression
            function calcExpression(operands, operators){
                if (operands.length > 1 && operators.length > 0){
                    return operands.reduce(function(prev, curr, i){
                        return calculate(prev, curr, operators[i-1]);
                    });
                }
                else return '';
            }

            //basic operations
            function calculate(a, b, op){
                // console.log(a, op, b);

                if (!Number.isNaN(a) && !Number.isNaN(b) && a !== undefined && b !== undefined ){
                    if (op === '+'){
                        return a + b;
                    }
                    else if (op === '-'){
                         return a-b;
                    }
                    else if (op === '/' || op === '÷'){
                        return a / b;
                    }
                    else if (op === '*' || op === '×'){
                        return a * b;
                    }
                }
                else return '';
            }

            // return only the function to be exposed to the outside
            return {
                setInput: setInput,
                getDelState: getDelState,
            }
        }



        // instance of the module
        var runningTot = calculator();

        //callback
        // all the graphics is handled here
        // the module only handles data and operations
        function onDigitEntered(e){
            var display = {
                    input: '',
                    result: ''
                },
                buttonWidth = $(this).width(),
                buttonHeight =  $(this).height(),
                x,
                y;

            /*get value pressed by the user*/
            display.input = $(this).attr('value');

            // set the value
            display = runningTot.setInput(display.input);

            // display values
            $('input').val(display.input);
            $('#result').text(display.result);


            // change the text on the del button based on the info returned from the module
            if (!runningTot.getDelState())
                $('#key_del').text('CLR');
            else
                $('#key_del').text('DEL');


            // add ripple effect on keys
            $(this).prepend("<span class='ripple'></span>");

            // make the ripple round
            if(buttonWidth >= buttonHeight)
                buttonHeight = buttonWidth;
            else
                buttonWidth = buttonHeight;


            // Get the center of the element
            x = $(this).offset().left + $(this).width() / 2;
            y = $(this).offset().top + $(this).height() / 2;


            // Add the ripples
            $(".ripple").css({
                width: buttonWidth,
                height: buttonHeight,
                top: y + 'px',
                left: x + 'px'
            }).addClass("rippleEffect");


        };


        $('button').on('click', onDigitEntered);

    });

})();


