if('serviceWorker' in navigator) 
{
    navigator.serviceWorker.register('./sw.js')
    .then(reg => console.log('Registro de SW exitoso', reg))
    .catch(err => console.warn('Error al tratar de registrar SW', err));
}

var result = document.querySelector("#result");           
var resultValue = document.querySelector("#equal-value"); 
var buttons = document.querySelectorAll(".key-number");
var formula = document.getElementById("formula");         
var operation = { firstVal:undefined, secondVal:undefined, operator:undefined }
var fValue = [];
var oValue = [];
var sValue = [];
var firstTimeButtonDown = new Boolean(true);
let count = -1;


buttons.forEach(function(item)
{
    console.log(item);
    item.addEventListener("click", function()
    {
        button(item.id.replace("button-", ""));
        
    });
});

function GetStringOperation(_operation) 
{
    var op = undefined;

    switch(_operation.operator)
    {
        case 'div':
            op = "/";
            break;
        
        case 'mul':
            op = "*";
            break;

        case 'min':
            op = "-";
            break;   
            
        case 'add':
            op = "+";
            break;

        case 'mod':
            op = "%";
            break;
    }

    if(_operation.firstVal == undefined && operation.secondVal == undefined) return 0;

    else if(_operation.firstVal != undefined && op == undefined)
    {
        return _operation.firstVal;
    }
    else if(_operation.firstVal != undefined && op != undefined && _operation.secondVal == undefined)
    {
        return _operation.firstVal + " " + op;
    }
    else
    {
        return _operation.firstVal + " " + op + " " + _operation.secondVal;
    }
}

function Show(_operation)
{
    formula.innerHTML = GetStringOperation(_operation);

    if(_operation.firstVal == undefined)
    {
        resultValue.innerHTML = 0;
        formula.innerHTML = "&nbsp;";
    }
}

function CalculateResult(_operation)
{
    let localResult = 0;

    if(_operation.firstVal == undefined || _operation.secondVal == undefined) return localResult;
    
    switch(_operation.operator)
    {
        case undefined:
            return _operation.firstVal;

        case 'div':
            if(parseFloat(_operation.secondVal) == 0)
            {
                localResult = 0;
            }
            else
            {
                localResult = parseFloat(_operation.firstVal) / parseFloat(_operation.secondVal);
            }
            break;

        case 'mul':
            localResult = parseFloat(_operation.firstVal) * parseFloat(_operation.secondVal);
            break;

        case 'min':
            localResult = parseFloat(_operation.firstVal) - parseFloat(_operation.secondVal);
            break;

        case 'add':
            localResult = parseFloat(_operation.firstVal) + parseFloat(_operation.secondVal);
            break;

        case 'mod':
            localResult = parseFloat(_operation.firstVal) % parseFloat(_operation.secondVal);
            break;
    }

    if(localResult % 1 != 0)
    {
        return localResult.toFixed(4);
    }
    else
    {
        return localResult;
    }
}

function button(type)
{
    switch(type)
    {
        case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': case 'dot': case '00':
            if(type == 'dot') type = ".";
            if(operation.operator == undefined)//validar primer/segundo miembro
            {
                if(operation.firstVal == undefined) operation.firstVal = "";
                operation.firstVal += type;
            }
            else
            {
                if(operation.secondVal == undefined) operation.secondVal = "";
                operation.secondVal += type;
            }
            Show(operation);
            resultValue.innerHTML = "";
            break;

        case 'div':case 'mul':case 'min':case 'add':
            if((operation.operator == undefined || operation.operator != undefined) && operation.firstVal != undefined) 
            {
                operation.operator = "";
                operation.operator += type;
                Show(operation);
                resultValue.innerHTML = "";
            } 
            break;

        case 'clr':
            ClearScreen();
            firstTimeButtonDown = true;
            break;
        
        case 'equal':
            if(operation.secondVal != undefined)
            {
                SaveValues();
                firstTimeButtonDown = true;

                resultValue.innerHTML = CalculateResult(operation);
                operation.firstVal = CalculateResult(operation);
                operation.secondVal = undefined;
                operation.operator = undefined;
            }
            break;
        
        case 'ac':
            ClearScreen();
            firstTimeButtonDown = true;
            while(fValue.length != 0) EarseValues();
            break;

        case 'up':
            count = firstTimeButtonDown 
                  ? fValue.length - 1 
                  : count;

            if(!firstTimeButtonDown && count > 0) count--;

            if(count >= 0) ChangeOperationValues(count);

            firstTimeButtonDown = false;
            break;

        case 'down':
            if(count < fValue.length - 1 && count >= 0) 
            {
                count++;
                ChangeOperationValues(count);
            }
            break;
    }
}

function ClearScreen()
{
    resultValue.innerHTML = "";
    operation.firstVal = undefined;
    operation.secondVal = undefined;
    operation.operator = undefined;
    formula.innerHTML = "Enter some stuff here";
}

function SaveValues()
{
    fValue.push(operation.firstVal);
    oValue.push(operation.operator);
    sValue.push(operation.secondVal);
}

function EarseValues()
{
    fValue.pop();
    oValue.pop();
    sValue.pop();
}

function ChangeOperationValues(index)
{
    operation.firstVal = fValue[index];
    operation.operator = oValue[index];
    operation.secondVal = sValue[index];

    Show(operation);
    resultValue.innerHTML = CalculateResult(operation);

    operation.firstVal = CalculateResult(operation);
    operation.operator = undefined;
    operation.secondVal = undefined;
}