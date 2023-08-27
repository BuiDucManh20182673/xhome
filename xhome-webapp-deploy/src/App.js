import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import * as pages from "./pages";
import React, {
	useState, useEffect, useMemo,
	useContext, createContext,
} from "react";
import { getTokenFromStorage } from "./constants/keyManager";
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom.min";

const authContext = createContext();
function useAuth() {
	return useContext(authContext);
}

const fakeAuth = {
	isAuthenticated: false,
	signin(cb) {
		fakeAuth.isAuthenticated = true;
		setTimeout(cb, 1000); // fake async
	},
	signout(cb) {
		fakeAuth.isAuthenticated = false;
		setTimeout(cb, 1000);
	},
};

function useProvideAuth() {
	const [user, setUser] = useState(localStorage.getItem("UI") ? "user" : null);
	// useEffect(() => {
	// 	const token = getTokenFromStorage();
	// 	if(token) {
	// 		signin();
	// 	}
	// }, []);

	const signin = (cb) => {
		return fakeAuth.signin(() => {
			setUser("user");
			if (cb) cb();
		});
	};

	// const token = getTokenFromStorage();
	// if (token) {
	// 	signin();
	// }

	const signout = (cb) => {
		return fakeAuth.signout(() => {
			setUser(null);
			if (cb) cb();
		});
	};

	return {
		user,
		signin,
		signout,
	};
}

const ProvideAuth = ({ children }) => {
	const auth = useProvideAuth();
	//   useEffect(() => {
	//     const token = getTokenFromStorage();
	//     if(token) {
	//       alert("Redirect to dashboard !!!");
	//       auth.signin();
	//     }
	//   }, []);

	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

function PrivateRoute({ children, ...rest }) {
	let auth = useAuth();
	return (
		<Route
			{...rest}
			render={({ location }) =>
				auth.user ? (
					children
				) : (
						<Redirect
							to={{
								pathname: "/login",
								state: { from: location },
							}}
						/>
					)
			}
		/>
	);
}

function NegateAuthRoute({ children, ...rest }) {
	let auth = useAuth();
	return (
		<Route
			{...rest}
			render={() => (auth.user ? <Redirect to="/" /> : children)}
		/>
	);
}

const MainRouter = () => {
	return (
		<ProvideAuth>
			<Router>
				<Switch>
					<Route exact path="/">
						<Redirect to="/dashboard" />
					</Route>
					<PrivateRoute path="/dashboard">
						<pages.DashboardPage />
					</PrivateRoute>
					<NegateAuthRoute path="/login">
						<pages.AuthPage />
					</NegateAuthRoute>
					<Route path="*">
						<pages.NotFoundPage />
					</Route>
				</Switch>
			</Router>
		</ProvideAuth>
	);
};

const App = () => <MainRouter />;
export default App;

export { useAuth };
