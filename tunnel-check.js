if (!process.env.FORGE_USER_VAR_LOOPHOLE_HOST) {
    console.log("\x1b[31m", "⚠️ FORGE_USER_VAR_LOOPHOLE_HOST is not defined. Forge backend will make requests to the real remote service which is probably not what you want. Start loophole and specify host.");
}
