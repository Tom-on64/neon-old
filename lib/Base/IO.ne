import System;

@method("Logs a string to the standard output", ["message to be logged"])
@returns("The logged string")
string log(message) {
    string msg = formatString(message);
    #RUN __OUTPUT__ enable
    __OUTPUT__.buffer.push(msg);
    __OUTPUT__.update();
    #RUN __OUTPUT__ disable
}

@method("Formats a string", ["The string to be formated"])
@returns("The formated string")
string formatString(string string) {
    // TODO: format the string
    return formatedString;
}

@method("Gets input from the standard input", ["The prompt to show", "Show what input the user is typing", "Maximim lenght of the input string (NULL is infinite)"])
@returns("The inputed string")
string input(string prompt = "", bool show = true, int? maxLength) {
    string in;

    #RUN __INPUT__ enable
    __INPUT__.begin();

    while (__INPUT__.buffer != "\n" || in.length >= maxLength) {
        if (__INPUT__.buffer == NULL) {
            __INPUT__.update();
            continue;
        }
        
        in += __INPUT__.buffer;
        __INPUT__.clearBuffer();
    }
    #RUN __INPUT__ disable

    return in;
}
