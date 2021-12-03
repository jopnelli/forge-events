import {noteCreatePayloadSchema} from "../../types/note";

test("Rejects invalid noteCreatePayload", () => {
    expect(noteCreatePayloadSchema.validate({msg: "Hello", foo: 123}).error?.message).toBe("\"foo\" is not allowed");
});
test("Allows valid noteCreatePayload", () => {
    expect(noteCreatePayloadSchema.validate({msg: "Hello"}).error).toBeUndefined();
});
