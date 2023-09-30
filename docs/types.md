# Types

## Basic types

| Type   | Description                                      | Range                                                   | Type Definition |
| ------ | ------------------------------------------------ | ------------------------------------------------------- | --------------- |
| byte   | 8-bit unsigned integer                           | 0 to 255                                                | Base.Byte       |
| sbyte  | 8-bit signed integer                             | -128 to 127                                             | Base.SByte      |
| short  | 16-bit signed integer                            | -32,768 to 32,767                                       | Base.Int16      |
| ushort | 16-bit unsigned integer                          | 0 to 65,535                                             | Base.UInt16     |
| int    | 32-bit signed integer                            | -2,147,483,648 to 2,147,483,647                         | Base.Int32      |
| uint   | 32-bit unsigned integer                          | 0 to 4,294,967,295                                      | Base.UInt32     |
| long   | 64-bit signed integer                            | -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 | Base.Int64      |
| ulong  | 64-bit unsigned integer                          | 0 to 18,446,744,073,709,551,615                         | Base.UInt64     |
| float  | 32-bit single-precision floating point type      | (+ or -) 3.402823e38                                    | Base.Single     |
| double | 64-bit double-precision floating point type      | (+ or -) 1.79769313486232e308                           | Base.Double     |
| char   | 16-bit Unicode character                         | Any valid Unicode character                             | Base.Char       |
| bool   | 8-bit logical value                              | true or false                                           | Base.Boolean    |
| string | A null terminated sequence of Unicode characters |                                                         | Base.String     |
| object | The base type of all other types                 |                                                         | Base.Object     |