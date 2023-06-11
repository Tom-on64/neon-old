import Base.Basic;

class DocumentationBaseAttr : AttributeBase {
    string desc;
    public void DocumentationAttr(string description) {
        super();
        desc = description;
        paramDesc = paramDescription;
    }
}

class ClassAttr : DocumentationAttr {
    public void ClassAttr(string description) {
        super(description);
    }
}

class MethodAttr : DocumentationAttr {
    string[] paramDesc;
    public void ClassAttr(string description, string[]? paramDescription) {
        super(description);
        paramDesc = paramDescription;
    }
}

class ReturnsAttr : DocumentationAttr {
    string type = "any";
    public void ClassAttr(string description) {
        super(description);
        if (typeof baseObj) type = (typeof baseObj).toString();
    }
}
