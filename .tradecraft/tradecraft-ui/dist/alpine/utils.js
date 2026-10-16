import { yieldToMain } from '../utils/yield-to-main';
function load() {
    return {
        script(url) {
            return new Promise((resolve, reject) => {
                const existingScript = document.querySelector(`script[src="${url}"]`);
                if (existingScript) {
                    resolve('Script already exists.');
                    return;
                }
                const newScript = document.createElement('script');
                newScript.src = url;
                newScript.async = true;
                newScript.onload = () => resolve('Script loaded successfully.');
                newScript.onerror = () => reject('Failed to load script.');
                document.head.appendChild(newScript);
                return;
            });
        },
    };
}
/**
 * Magic to read/write/destroy browser cookies
 */
function cookie() {
    const configuration = {
        expires: null,
        path: '/',
        domain: window.location.hostname,
    };
    return {
        write(name, value) {
            document.cookie = `${name}=${value}; expires=${configuration.expires}; path=${configuration.path}; domain=${configuration.domain}`;
        },
        read(name) {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].split('=');
                if (name == cookie[0].trim()) {
                    return decodeURIComponent(cookie[1]);
                }
            }
            return null;
        },
        destroy(name) {
            if (document.cookie.split('; ').find((row) => row.startsWith(name))) {
                document.cookie = `${name}=; Max-Age=0; path=${configuration.path}; domain=${configuration.domain}`;
            }
        },
    };
}
export default function (Alpine) {
    Alpine.magic('debounce', function () {
        return Alpine.debounce;
    });
    Alpine.magic('throttle', function () {
        return Alpine.throttle;
    });
    Alpine.magic('yieldToMain', function () {
        return yieldToMain;
    });
    Alpine.magic('load', load);
    Alpine.magic('cookie', cookie);
}
