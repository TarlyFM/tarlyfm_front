import React from 'react';
import { Menu } from 'semantic-ui-react';
import Logo from './Logo';


const UserInfo = (props) => {
  if (props.user.logged_in)
    return <label><i>Bienvenue, {props.user.name}</i></label>
  else
    return <a onClick={props.user.showLoginRegisterModal}>
      Sign in / register
    </a>
}


const Nav = (props) => {

  function makeOnClickHandler (name) {
    return () => {
      if (name !== props.current_view)
        props.onClick(name);
    }
  }

  function makeMenuItem (name) {
    return <Menu.Item
      name={name}
      active={name === props.CurrentView}
      onClick={makeOnClickHandler(name)}
      key={name}
      style={{'textAlign':'center'}}
    />
  }
  return <div>
  <Logo/>
  <Menu secondary vertical>
    {
      ['On Air', 'Replay', 'About', 'Upload', 'Adm'].map(makeMenuItem)
    }
  </Menu>
  <UserInfo user={props.user}/>
  </div>
};

export default Nav;