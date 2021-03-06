
const main = () => {
    self.importScripts(
        'https://klesun-misc.github.io/TypeScript/lib/typescriptServices.js',
        'https://klesun-productions.com/entry/ts-browser/src/UrlPathResolver_sideEffects.js',
        'https://klesun-productions.com/entry/ts-browser/src/actions/ParseTsModule_sideEffects.js'
    );
    const org = self.org;
    /** @type {ts} */
    const ts = self.ts;

    const onmessage = (evt) => {
        const {data} = evt;
        const {messageType, messageData, referenceId} = data;
        if (messageType === 'parseTsModule') {
            const {isJsSrc, staticDependencies, dynamicDependencies, getJsCode} =
                org.klesun.tsBrowser.ParseTsModule_sideEffects({
                    ...messageData, ts: ts,
                    addPathToUrl: org.klesun.tsBrowser.addPathToUrl,
                });
            self.postMessage({
                messageType: 'parseTsModule_deps',
                messageData: {isJsSrc, staticDependencies, dynamicDependencies},
                referenceId: referenceId,
            });
            const jsCode = getJsCode();
            self.postMessage({
                messageType: 'parseTsModule_code',
                messageData: {jsCode},
                referenceId: referenceId,
            });
        }
    };

    self.onmessage = evt => {
        try {
            onmessage(evt);
        } catch (exc) {
            self.postMessage({
                messageType: 'error',
                messageData: {
                    message: exc.message,
                    stack: exc.stack,
                },
            });
        }
    };
};

try {
    main();
} catch (exc) {
    self.postMessage('Failed to initialize worker - ' + exc + '\n' + exc.stack);
}