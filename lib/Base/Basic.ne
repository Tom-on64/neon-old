import Docs;
import System;

@class("The base class for programs. \nIt gives you access to the Main(), Update() and proc properties")
class ProgramBase {
    const protected static Process proc = new Process();
    @method("The first method that will be called", ["The arguments given in the command line"]);
    public static abstract void Main(string[] args);
    @method("This method is called every frame", ["The amount of miliseconds sinde last update call"]);
    public static abstract void Update(float dt);
}

@class("The base for attributes")
class AttributeBase {}

@class("The process class gives you access to the current process id and such")
class Process {
    int pid;
    @method("Assigns the process values");
    public void Process() {
       pid = __PROC__.pid;
    }
}