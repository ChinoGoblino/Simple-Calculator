let equation = [];
let length = 0;
let display = "";

function character(value) {
    display = "";
    // returns local storage if Ans
    if (value == 'Ans') {
      previous = localStorage.getItem("prev")
      equation[length] = previous;
    }
    else {
      equation[length] = value;
    }
    length++;
    // displays all characters of array
    for (i = 0; i < length; i++) {
      display = display + equation[i];  
    }  
  document.getElementById("array").innerHTML = display; 
}

// clears each character of the array when screen is cleared
function reset() {
  for (i = 0; i < length; i++) {
    equation.pop()
  }
  length = 0;
  display = "‎";
  document.getElementById("array").innerHTML = display;
}

// removes last character from array
function remove() {
    display = "";  
    equation.pop()
    length = length - 1;
    for (i = 0; i < length; i++) {
      display = display + equation[i];  
    }  
    document.getElementById("array").innerHTML = display; 
}

//returns final answer
function equals() {
  let error = false;
  let string = "";
  let newEquation = [];
  let part = 0;
  let result = "";

   // checks to see if the decimal place is used correctly
  for (i = 0; i < equation.length; i++) {
    if (equation[i] == '.') {
      if (equation[i + 1] == '.' || equation[i + 1] == '/' || equation[i + 1] == '*' || equation[i + 1] == '-' || equation[i + 1] == '+') {
        error = true;
      }
   }
  }
  
  // joins all integers together into one string
  for (i = 0; i < length; i++) {
    if (equation[i] != '*' && equation[i] != '-' && equation[i] != '/' && equation[i] != '+') {
      string = string + equation[i];
    }
    // adds string to the new equation, adds operator and begins new element
    else {
      if (string != "") {
        newEquation[part] = string;
        part = part + 1;
      }

      string = "";
      newEquation[part] = equation[i];
      part = part + 1;
    }  
  }
  // conditional to check if last character is operator and first character is not a multiply or divide
  if (string != "" && newEquation[0] != '*' && newEquation[0] != '/') {
    newEquation[part] = string;
  }
  else {
    error = true;
  } 

  // equation error free and contains elements:
  if (error == false && equation != "") {
    let equation = clean(newEquation);
    result = calculate(equation);
  }
  //equation clear, return clear
  else if (equation == "") {
  result = "‎";
  }

  if (error == true) {
    result = "error";
  }
  
  //set local item to be accessed by Ans later
  if (error == false) {
    localStorage.setItem("prev", result);
  }

  document.getElementById("answer").innerHTML = result; 
}

//simplifies operators
function clean(equation) {
  for (i = 0; i < equation.length; i++) {
    // turns '++' to '+' and '+-' to '-'
    if (equation[i] == '+') {
      while (equation[i + 1] == '+' && equation[i] == '+') {
        equation.splice(i + 1, 1);
        i = i - 1;
      }
      while (equation[i + 1] == '-' && equation[i] == '+') {
        equation.splice(i + 1, 1);
        equation[i] = '-'
        i = i - 1;
      }
    }

    // turns '-+' to '-' and '--' to '+'
    if (equation[i] == '-') {
      while (equation[i + 1] == '+' && equation[i] == '-') {
        equation.splice(i + 1, 1);
        i = i - 1;
      }
      while (equation[i + 1] == '-' && equation[i] == '-') {
        equation.splice(i + 1, 1);
        equation[i] = '+'
        i = i - 1;
      }
    }

    // checks that multiply and divide are not together
    if (equation[i] == '*') {
      if (equation[i + 1] == '*' || equation[i + 1] == '/') {
        return "error";
      }
    }
    if (equation[i] == '/') {
      if (equation[i + 1] == '*' || equation[i + 1] == '/') {
        return "error";
      }
    }
  }
  return equation;
}

function calculate(equation) {
  let calculation = []
  let value = 0;
  cleaned = compress(equation);
  // BODMAS
  for (i = 0; i < cleaned.length; i++) {
    // Multiply Numbers
    if (cleaned[i] == '*') {
      value = parseFloat(cleaned[i - 1]) * parseFloat(cleaned[i + 1]);
      cleaned[i - 1] = value.toString();
      cleaned.splice(i, 2);
      i = i - 2;
    }
    //divide numbers
    if (cleaned[i] == '/') {
      value = parseFloat(cleaned[i - 1]) / parseFloat(cleaned[i+1]);
      cleaned[i-1] = value.toString();
      cleaned.splice(i, 2);
      i = i - 2;
    }
  }
  //Removes '+' from start of equation
  if (cleaned[0] == '+') {
    cleaned.splice(0, 1);
  }

  // Adds numbers together (negative numbers will naturally subtract from this)
  if (cleaned.length > 1 && cleaned[0] != '+' && cleaned[0] != '-') {
    for (i = 0; i < cleaned.length - 1; i++) {
      let num = parseFloat(cleaned[i]) + parseFloat(cleaned[i + 1]);
      cleaned[i] = num.toString();  
      cleaned.splice(i + 1, 1);
      i--;
    }
  }

  //Creates final equation
  for (i = 0; i < cleaned.length; i++) {
    let value = cleaned[i];
    calculation = calculation + value;    
  }
  return calculation;
}

// Join operators with numbers. E.g. '-' and '45' to '-45' so '/-45' does not return NaN
function compress(cleaned) {
 for (i = 0; i < cleaned.length; i++) {
  // Mega compress of multiple negative numbers
  if (cleaned[i + 1] == '-' && cleaned[i - 2] == '-') {
    cleaned[i + 1] = "-" + cleaned[i + 2];
    cleaned[i - 1] = "-" + cleaned[i - 1];
    cleaned.splice(i + 2, 1);
    cleaned.splice(i - 2, 1);
  }
  // small compress of a negative number
  else if (cleaned[i + 1] == '-') {
    cleaned[i + 1] = "-" + cleaned[i + 2];
    cleaned.splice(i + 2, 1);
  }
  // small compress of a negative number
  else if (cleaned[i - 2] == '-') {
    cleaned[i - 1] = "-" + cleaned[i - 1];
    cleaned.splice(i - 2, 1);
  }
  // Mega compress of multiple positive numbers
  else if (cleaned[i + 1] == '+' && cleaned[i - 2] == '+') {
    cleaned[i + 1] = cleaned[i + 2];
    cleaned.splice(i + 2, 1);
    cleaned.splice(i - 2, 1);
  }
  // small compress of a positive number
  else if (cleaned[i + 1] == '+') {
    cleaned[i + 1] = cleaned[i + 2];
    cleaned.splice(i + 2, 1);
  }
  // small compress of a positive number
  else if (cleaned[i - 2] == '+') {
    cleaned[i - 1] = cleaned[i - 2];
    cleaned.splice(i - 2, 1);
  }
}
  return cleaned;
}

