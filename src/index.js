import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import * as Realm from 'realm-web';

export const RealmContext = createContext({});

export const RealmProvider = ({ id, render=null, remember=true, children=null, ...opts }) => {
    const app = useRef(new Realm.App ({ id })).current;
    const [ user, setUser ] = useState();
    const [ customData, setCustomData ] = useState();
    const [ mongo, setMongo ] = useState();
    const [ loading, setLoading ] = useState(remember && app.currentUser);

    const register = useCallback(async (...creds) => {
        const registration = await app.emailPasswordAuth.registerUser(...creds);
        if (opts.onRegister) opts.onRegister(registration);
        return registration;
    }, []);

    const resetPassword = useCallback(async (token, tokenId, password) => {
        const reset = await app.emailPasswordAuth.resetPassword(token, tokenId, password);
        if (opts.onResetPassword) opts.onResetPassword(reset);
        return reset;
    })

    const confirm = useCallback(async (token, tokenId) => {
        const confirmation = await app.emailPasswordAuth.confirmUser(token, tokenId);
        if (opts.onConfirm) opts.onConfirm(confirmation);
        return confirmation;
    }, []);

    const login = useCallback(async (how, ...creds) => {
        const user = await app.logIn(Realm.Credentials[how](...creds));

        if (opts.onLogin) await opts.onLogin(user);
        await user.refreshCustomData();
        updateUser(user);
        return user;
    }, []);

    const updateUser = useCallback(async (user) => {
        setLoading(true);
        const okay = user && await user.refreshCustomData().then(() => true).catch(() => false);

        if (okay) {
            const mongo = user.mongoClient('mongodb-atlas');
    
            setUser(user);
            setMongo(mongo);
            setCustomData({ ...user.customData, _id: new Realm.BSON.ObjectId (user.customData._id) });    
        }
        else {
            setUser();
            setMongo();
            setCustomData();
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        remember && app.currentUser && updateUser(app.currentUser);
    }, []);

    const logout = useCallback(async () => {
        app.currentUser && app.currentUser.logOut().then(() => {
            setUser();
            if (opts.onLogout) opts.onLogout();
        });
    }, []);

    const callFunction = useCallback((func, ...args) => user.functions[func](...args), [user]);

    const context = {
        app,
        loading,
        user,
        customData,
        mongo,
        login,
        logout,
        register,
        confirm,
        resetPassword,
        callFunction,
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