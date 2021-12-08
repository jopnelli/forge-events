import Resolver from '@forge/resolver';
import {fetch} from "@forge/api";
import {ForgePageInvocationContext} from "./types";

const resolver = new Resolver();

const getRemoteHostToken = () => process.env.DATABASE_TOKEN || "";
const getRemoteHostUrl = () => process.env.LOOPHOLE_HOST ? `https://${process.env.LOOPHOLE_HOST}.loophole.site` : "https://language-manager.seibert-media.net";

resolver.define("writeToFirestore", async (req) => {
    const context = req.context as ForgePageInvocationContext;
    const response = await fetch(getRemoteHostUrl(), {
        headers: {
            "Authorization": getRemoteHostToken(),
        }
    });
    console.log(await response.text());
    console.log(response.status);
})

export const handler = resolver.getDefinitions(); // exports backend function
