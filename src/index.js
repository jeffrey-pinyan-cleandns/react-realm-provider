import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import * as Realm from 'realm-web';

export const RealmContext = createContext({});

export const RealmProvider = ({ id, render=null, remember=true, children=null }) => {
    const app = useRef(new Realm.App ({ id })).current;
    const [ user, setUser ] = useState();
    const [ customData, setCustomData ] = useState();
    const [ mongo, setMongo ] = useState();
    const [ loading, setLoading ] = useState(remember && app.currentUser);
    const isLoggedIn = !loading && user;

    const register = useCallback(async (email, password, onRegister=null) => {
        const registration = await app.emailPasswordAuth.registerUser(email, password);
        if (onRegister) await onRegister(registration);
        return registration;
    }, []);

    const resetPassword = useCallback(async (token, tokenId, password, onResetPassword=null) => {
        const reset = await app.emailPasswordAuth.resetPassword(token, tokenId, password);
        if (onResetPassword) await onResetPassword(reset);
        return reset;
    })

    const confirm = useCallback(async (token, tokenId, onConfirm=null) => {
        const confirmation = await app.emailPasswordAuth.confirmUser(token, tokenId);
        if (onConfirm) await onConfirm(confirmation);
        return confirmation;
    }, []);

    const login = useCallback(async (how, ...creds) => {
        const onLogin = ('function' === typeof creds[creds.length-1]) && creds.pop();
        const user = await app.logIn(Realm.Credentials[how](...creds));

        if (onLogin) await onLogin(user);
        await user.refreshCustomData();
        updateUser(user);
        return user;
    }, []);

    const updateUser = useCallback(async (user) => {
        setLoading(true);
        const okay = user && await user.refreshCustomData().then(() => true).catch(() => false);

        if (okay) {
            user.mongo = user.mongoClient('mongodb-atlas');
    
            setUser(user);
            setMongo(user.mongo);
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

    const logout = useCallback(async (onLogout=null) => {
        return app.currentUser && app.currentUser.logOut().then(() => {
            setUser();
            return onLogout && onLogout();
        });
    }, []);

    const callFunction = useCallback((func, ...args) => user.functions[func](...args), [user]);

    const refreshCustomData = useCallback(async () => {
        if (user) {
            await user.refreshCustomData();
            setCustomData({ ...user.customData, _id: new Realm.BSON.ObjectId (user.customData._id) });
        }
    }, [user]);

    const context = {
        app,
        loading,
        user,
        customData,
        mongo,
        isLoggedIn,
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