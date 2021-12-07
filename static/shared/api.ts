import {invoke} from "@forge/bridge";

export function invokeWriteToFirestore() {
    return invoke<any>("writeToFirestore")
}
