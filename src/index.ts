import Resolver from '@forge/resolver';
import {fetch} from "@forge/api";

const resolver = new Resolver();

resolver.define("writeToFirestore", async (req) => {
    const token = process.env.DATABASE_TOKEN || "";
    const response = await fetch("https://language-manager.seibert-media.net/", {headers: {"Authorization": token}});
    console.log(response.status);
})

export const handler = resolver.getDefinitions(); // exports backend function
