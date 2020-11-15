import React, {Suspense, lazy} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import './scss/style.scss';

const Main = lazy(() => import('./view/Main'))
const PlaceSearcher = lazy(() => import('./view/PlaceSearcher'))

const loading = (
    <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"/>
    </div>
)

const App = () => {
    return (
        <BrowserRouter>
            <header className="py-2 px-3 d-flex justify-content-center align-content-center bg-dark">
                <div id="title" className="mr-auto text-white my-auto">Location Record Board</div>
            </header>
            <Suspense fallback={loading}>
                <Switch>
                    <Route exact path="/place/:id/:date" name="Place" render={props => <Main {...props}/>}/>
                    <Route exact path="/places" name="Places" render={props => <Main {...props}/>}/>
                    <Route path="/" name="Home" render={props => <PlaceSearcher {...props}/>}/>
                </Switch>
            </Suspense>
            <footer className="py-2 px-3 d-flex justify-content-center align-content-center bg-dark">
                <div className="my-auto">Copyright&copy; Team Nibble</div>
            </footer>
        </BrowserRouter>
    )
}

export default App