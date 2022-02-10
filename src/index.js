import React, { createContext, useCallback, useMemo, useRef, useState } from 'react';
import * as Realm from 'realm-web';

export const RealmContext = createContext({});

export const RealmProvider = ({ id, render=null, remember=true, children=null }) => {
    const app = useRef(new Realm.App ({ id })).current;
    const [ user, setUser ] = useState(remember && app.currentUser);
    const [ customData, setCustomData ] = useState(user && user.customData);
    const [ loading, setLoading ] = useState(Boolean(user));
    const mongo = useMemo(() => user && user.mongoClient('mongodb-atlas'), [user]);

    const register = useCallback(async (email, password, onRegister=null) => {
        const registration = await app.emailPasswordAuth.registerUser(email, password);
        if (onRegister) await onRegister(registration);
        return registration;
    }, []);

    const resetPassword = useCallback(async (token, tokenId, password, onResetPassword=null) => {
        const reset = await app.emailPasswordAuth.resetPassword(token, tokenId, password);
        if (onResetPassword) await onResetPassword(reset);
        return reset;
    }, []);

    const confirm = useCallback(async (token, tokenId, onConfirm=null) => {
        const confirmation = await app.emailPasswordAuth.confirmUser(token, tokenId);
        if (onConfirm) await onConfirm(confirmation);
        return confirmation;
    }, []);

    const login = useCallback(async (how, ...creds) => {
        setLoading(true);
        const onLogin = ('function' === typeof creds[creds.length-1]) && creds.pop();
        const user = await app.logIn(Realm.Credentials[how](...creds)).catch((error) => {
            setLoading(false);
            throw error;
        });

        if (onLogin) await onLogin(user).catch((error) => {
            setLoading(false);
            throw error;
        });

        return await user.refreshCustomData().then(() => {
            setCustomData(user.customData);
            setUser(user);
            setLoading(false);
            return user;
        }).catch((error) => {
            setLoading(false);
            throw error;
        });
    }, []);

    const logout = useCallback(async (onLogout=null) => {
        return app.currentUser && app.currentUser.logOut().then(() => {
            setUser();
            return onLogout && onLogout();
        });
    }, []);

    const refreshCustomData = useCallback(() => user.refreshCustomData().then(() => setCustomData(user.customData)), [user]);

    const callFunction = useCallback((func, ...args) => user.functions[func](...args), [user]);

    const context = {
        app,
        loading,
        user,
        customData,
        mongo,
        isLoggedIn: Boolean(user) && user.isLoggedIn,
        login,
        logout,
        register,
        confirm,
        resetPassword,
        callFunction,
        refreshCustomData,
    };

    return (
        <RealmContext.Provider value={context}>
            {render ? render(context) : children}
        </RealmContext.Provider>
    );
};

export const withRealm = (Component) => {
    return ({ id }) => <RealmProvider id={id} render={(realm) => <Component realm={realm}/>}/>;
};