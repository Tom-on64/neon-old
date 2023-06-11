import Base.IO;
import Base.Basic;

class Program : ProgramBase {
    public static void Main() {
        log("--- Calculator ---\n");
        GetInput();
    }

    static void GetInput() {
        float a = input("> ", true, 1);
        float m = input("", true, 1);
        float b = input("", true, 1);
    }
}
