export default function (Alpine) {
    Alpine.setErrorHandler((error, el, expression) => {
        const newError = Object.assign(error !== null && error !== void 0 ? error : { message: 'No error message given.' }, { el, expression });
        console.error(`
      Alpine Expression Error: ${newError.message}

      Element: %o

      Expression: ${newError.expression}
    `, newError.el);
        setTimeout(() => {
            throw newError;
        }, 0);
    });
}
