import { useState, useEffect } from 'react';
import Keycloak from 'keycloak-js';

let keycloakInstance = null;

export const useAuth = () => {
    const [initialized, setInitialized] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    if (!keycloakInstance) {
        keycloakInstance = new Keycloak({
            url: import.meta.env.VITE_KEYCLOAK_URL,
            realm: import.meta.env.VITE_KEYCLOAK_REALM,
            clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
        });
    }

    useEffect(() => {
        if (keycloakInstance.didInitialize) {
            setInitialized(true);
            setAuthenticated(keycloakInstance.authenticated || false);
            return;
        }

        const initAuth = async () => {
            try {
                const auth = await keycloakInstance.init({
                    onLoad: 'login-required',
                });

                setAuthenticated(auth);
            } catch (error) {
                console.error('Failed to initialize Keycloak:', error);

                setAuthenticated(false);
            } finally {
                setInitialized(true);
            }
        };

        initAuth();
    }, []);

    return { initialized, authenticated, keycloak: keycloakInstance };
};