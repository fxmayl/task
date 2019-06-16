import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route } from 'react-router-dom'
import List from './task/list'
import Add from './task/Add';
import { Form } from 'antd';
import Update from './task/Update';



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA


const PrimaryLayout = () => (
  <div>
    <main>
      <Route path="/home" exact component={HomePage} />
      <Route path="/" exact component={ListPage} />
      <Route path="/add" exact component={AddPage} />
      <Route path="/update/:id" exact component={UpdatePage} />
      {/* <Route path="/echart" component={UsersPage} />
        <Route path="/" component={LoginPage} /> */}
    </main>
  </div>
)

const HomePage = () => <App />;
const ListPage = () => <List />;
const AddForm = Form.create()(Add)
const AddPage = () => <AddForm />;
const UpdateForm = Form.create()(Update)
const UpdatePage = () => <UpdateForm />;
//   const UsersPage = () => <EchartsComponent />
//   const WrapLoginPage = Form.create()(Login)
//   const LoginPage = () => <WrapLoginPage/>

const Main = () => (
  <BrowserRouter>
    <PrimaryLayout />
  </BrowserRouter>
)


ReactDOM.render(<Main />, document.getElementById('root'));
serviceWorker.unregister();
