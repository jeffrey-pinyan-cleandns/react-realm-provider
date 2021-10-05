import React, { useContext, useEffect, useState } from 'react';
import { RealmProvider, RealmContext, withRealm } from 'react-realm-provider';

const id = 'react-realm-provider-sandbox-wzhse';

const App = () => {
    return (
        <>
            <RealmProvider id={id}>
                <RealmApp/>
            </RealmProvider>
            <hr/>
            <RealmProvider id={id} render={(realm) => <RealmReceiver realm={realm}/>}/>
            <hr/>
            <WrappedRealmUser id={id}/>
        </>
    )
};

export default App;

const RealmApp = () => {
    const { isLoggedIn, loading, login, logout, user, mongo } = useContext(RealmContext);
    return <RealmBody {...{isLoggedIn, loading, login, logout, user, mongo}} />;
};

const RealmReceiver = ({ realm }) => {
    const { isLoggedIn, loading, login, logout, user, mongo } = useContext(RealmContext);
    return <RealmBody {...{isLoggedIn, loading, login, logout, user, mongo}} />;
};

const WrappedRealmUser = withRealm(RealmReceiver);

const RealmBody = ({ isLoggedIn, loading, login, logout, user, mongo }) => {
    const [ recent, setRecent ] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            fetch('https://api.ipify.org/').then((r) => r.text()).then(async (ip) => {
                await mongo.db('react_realm_provider').collection('sample').insertOne({ realmId: user.id, ts: new Date (), ip: ip.replace(/\d+$/, '0/24') })
                await mongo.db('react_realm_provider').collection('sample').aggregate([
                    { $sort: { 'ts': -1 } },
                    { $group: { _id: '$ip', ts: { $first: '$ts' } } },
                ]).then((res) => setRecent(res.map(({ _id, ts }) => ({ ip: _id, ts }))));
            });
        }
    }, [isLoggedIn, mongo]);

    return (
        <div>
            {isLoggedIn ? (
                <div><button onClick={() => logout()}>Log Out of Realm</button></div>
            ) : (
                <div><button onClick={() => login('anonymous')}>Log In to Realm</button></div>
            )}
            {loading && (
                <div>Logging in...</div>
            )}
            {isLoggedIn && (
                <div>
                    <div>Thank you for logging in, user!</div>
                    <div>
                        {recent && recent.map(({ ts, ip }, i) => <div key={i}>{ts.toString()} &mdash; {ip}</div>)}
                    </div>
                </div>
            )}
        </div>
    )
};